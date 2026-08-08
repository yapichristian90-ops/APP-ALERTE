import React, { useEffect, useRef, useState } from "react";
import { Animated, Linking, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AppButton } from "@/components/AppButton";
import { colors, radius, spacing, typography } from "@/theme";
import { supabase } from "@/services/supabase";
import { playSirenLoop, stopSiren } from "@/services/siren";
import { stopSirenAsContact } from "@/services/violence";

interface AlertRow {
  id: string;
  victim_name: string;
  victim_phone: string;
  latitude: number | null;
  longitude: number | null;
  status: string;
}

export default function IncomingAlertScreen() {
  const { alertId } = useLocalSearchParams<{ alertId: string }>();
  const router = useRouter();
  const [alert, setAlert] = useState<AlertRow | null>(null);
  const [stopping, setStopping] = useState(false);
  const flash = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let active = true;
    playSirenLoop().catch(() => {});

    supabase
      .from("violence_alerts")
      .select("*")
      .eq("id", alertId)
      .single()
      .then(({ data }) => {
        if (active && data) setAlert(data as AlertRow);
      });

    const channel = supabase
      .channel(`alert-${alertId}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "violence_alerts", filter: `id=eq.${alertId}` }, (payload) => {
        const row = payload.new as AlertRow;
        setAlert(row);
        if (row.status !== "active") {
          stopSiren();
          router.back();
        }
      })
      .subscribe();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(flash, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(flash, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    );
    loop.start();

    return () => {
      active = false;
      loop.stop();
      stopSiren();
      supabase.removeChannel(channel);
    };
  }, [alertId]);

  async function handleStopSiren() {
    setStopping(true);
    try {
      await stopSirenAsContact(String(alertId));
      await stopSiren();
      router.back();
    } catch {
      await stopSiren();
      router.back();
    } finally {
      setStopping(false);
    }
  }

  function handleCall() {
    if (alert?.victim_phone) Linking.openURL(`tel:${alert.victim_phone}`);
  }

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.popPop, { opacity: flash }]}>POP POP</Animated.Text>
      <Text style={styles.title}>🚨 ALERTE VIOLENCE</Text>
      <Text style={styles.victim}>{alert?.victim_name ?? "Un proche"} a besoin d'aide</Text>
      <Text style={styles.instructions}>Appelez immédiatement et rejoignez sa position ci-dessous.</Text>

      {alert?.latitude && alert?.longitude ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: alert.latitude,
            longitude: alert.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={{ latitude: alert.latitude, longitude: alert.longitude }} title={alert.victim_name} pinColor={colors.violence[500]} />
        </MapView>
      ) : (
        <View style={[styles.map, styles.mapPlaceholder]}>
          <Text style={styles.mapPlaceholderText}>Position en cours de réception…</Text>
        </View>
      )}

      <AppButton label={`📞 Appeler ${alert?.victim_name ?? ""}`} onPress={handleCall} style={{ marginTop: spacing.lg }} />
      <AppButton label="Couper la sirène chez moi" variant="secondary" onPress={handleStopSiren} loading={stopping} style={{ marginTop: spacing.md }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.violence[600], paddingTop: 72, paddingHorizontal: spacing.xl },
  popPop: { ...typography.h1, color: colors.neutral[0], textAlign: "center", letterSpacing: 4 },
  title: { ...typography.display, color: colors.neutral[0], textAlign: "center", marginTop: spacing.sm },
  victim: { ...typography.h2, color: colors.neutral[0], textAlign: "center", marginTop: spacing.sm },
  instructions: { ...typography.body, color: "rgba(255,255,255,0.85)", textAlign: "center", marginTop: spacing.xs },
  map: { height: 220, borderRadius: radius.lg, marginTop: spacing.lg, overflow: "hidden" },
  mapPlaceholder: { alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.15)" },
  mapPlaceholderText: { color: colors.neutral[0] },
});
