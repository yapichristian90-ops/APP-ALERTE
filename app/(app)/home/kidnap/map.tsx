import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { AppButton } from "@/components/AppButton";
import { colors, radius, spacing, typography } from "@/theme";
import { searchPersonLocation, KidnapSearchResult } from "@/services/kidnap";

const REFRESH_INTERVAL_MS = 12000;

export default function KidnapMapScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const router = useRouter();
  const [result, setResult] = useState<KidnapSearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const runSearch = useCallback(async () => {
    try {
      const data = await searchPersonLocation(String(phone));
      setResult(data);
      setError(null);
    } catch (e: any) {
      setError(e.message ?? "Recherche impossible.");
    } finally {
      setLoading(false);
    }
  }, [phone]);

  useEffect(() => {
    runSearch();
    intervalRef.current = setInterval(runSearch, REFRESH_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [runSearch]);

  return (
    <Screen background={colors.kidnap[100]}>
      <ScreenHeader title="Position en direct" subtitle={`+225 ${phone}`} onBack={() => router.back()} />
      <View style={styles.content}>
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={colors.kidnap[500]} size="large" />
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.errorEmoji}>🔒</Text>
            <Text style={styles.errorText}>{error}</Text>
            <AppButton label="Réessayer" variant="secondary" onPress={() => { setLoading(true); runSearch(); }} style={{ marginTop: spacing.lg }} />
          </View>
        ) : result ? (
          <>
            <MapView
              style={styles.map}
              region={{ latitude: result.latitude, longitude: result.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
            >
              <Marker coordinate={{ latitude: result.latitude, longitude: result.longitude }} title={result.fullName} pinColor={colors.kidnap[500]} />
            </MapView>
            <View style={styles.infoBar}>
              <Text style={styles.infoName}>{result.fullName}</Text>
              <Text style={styles.infoUpdated}>
                Mis à jour : {new Date(result.updatedAt).toLocaleTimeString("fr-FR")} — actualisation automatique
              </Text>
            </View>
          </>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.xl },
  errorEmoji: { fontSize: 48, marginBottom: spacing.md },
  errorText: { ...typography.body, color: colors.neutral[600], textAlign: "center" },
  map: { flex: 1, borderRadius: radius.lg, overflow: "hidden" },
  infoBar: { paddingVertical: spacing.md },
  infoName: { ...typography.h3, color: colors.neutral[800] },
  infoUpdated: { ...typography.caption, color: colors.neutral[500], marginTop: 2 },
});
