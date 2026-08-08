import React, { useEffect, useRef, useState } from "react";
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Card } from "@/components/Card";
import { AppButton } from "@/components/AppButton";
import { PhoneInput } from "@/components/PhoneInput";
import { colors, spacing, typography } from "@/theme";
import { useAuthStore } from "@/store/authStore";
import { watchLocation, LocationUnsubscribe } from "@/services/location";
import { pushMyLocation, disableTracking } from "@/services/kidnap";
import { isValidIvorianPhone } from "@/constants/phone";

export default function KidnapHomeScreen() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const [trackingActive, setTrackingActive] = useState(false);
  const [searchPhone, setSearchPhone] = useState("");
  const stopWatch = useRef<LocationUnsubscribe | null>(null);

  const trustedCount = profile?.trustedNumbers.length ?? 0;

  useEffect(() => {
    return () => {
      stopWatch.current?.();
    };
  }, []);

  async function toggleTracking(value: boolean) {
    if (value && trustedCount === 0) {
      Alert.alert(
        "Ajoutez un numéro de confiance",
        "Enregistrez au moins un numéro de confiance avant d'activer le suivi permanent.",
      );
      return;
    }
    setTrackingActive(value);
    if (value) {
      stopWatch.current = await watchLocation((coords) => {
        pushMyLocation(coords.latitude, coords.longitude, true).catch(() => {});
      });
    } else {
      stopWatch.current?.();
      stopWatch.current = null;
      await disableTracking().catch(() => {});
    }
  }

  function handleSearch() {
    if (!isValidIvorianPhone(searchPhone)) {
      Alert.alert("Numéro invalide", "Entrez un numéro ivoirien valide à 10 chiffres.");
      return;
    }
    router.push({ pathname: "/(app)/home/kidnap/map", params: { phone: searchPhone } });
  }

  return (
    <Screen background={colors.kidnap[100]}>
      <ScreenHeader title="Alerte Enlèvement" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text style={styles.sectionTitle}>Retrouver un proche</Text>
          <Text style={styles.sectionDescription}>
            Entrez le numéro de la personne recherchée. La position ne s'affichera que si vous êtes enregistré comme
            l'un de ses 3 numéros de confiance.
          </Text>
          <PhoneInput value={searchPhone} onChangeText={setSearchPhone} label="Numéro recherché" />
          <AppButton label="Rechercher la position" onPress={handleSearch} />
        </Card>

        <Card style={styles.trackingCard}>
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Ma position en temps réel</Text>
              <Text style={styles.sectionDescription}>
                Une fois activée, votre position reste transmise en continu, même en vous déplaçant, pour permettre à
                vos numéros de confiance de vous suivre en cas d'enlèvement.
              </Text>
            </View>
            <Switch
              value={trackingActive}
              onValueChange={toggleTracking}
              trackColor={{ true: colors.kidnap[500], false: colors.neutral[300] }}
            />
          </View>
          {trackingActive ? <Text style={styles.trackingActive}>🟢 Position active — transmise en direct</Text> : null}
        </Card>

        <Card style={styles.trustedCard} onTouchEnd={() => router.push("/(app)/home/kidnap/trusted")}>
          <Text style={styles.sectionTitle}>Mes numéros de confiance</Text>
          <Text style={styles.sectionDescription}>{trustedCount} / 3 enregistrés</Text>
          <Text style={styles.link}>Gérer les numéros →</Text>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl, gap: spacing.lg },
  sectionTitle: { ...typography.h3, color: colors.neutral[800] },
  sectionDescription: { ...typography.caption, color: colors.neutral[500], marginTop: 4, marginBottom: spacing.md },
  trackingCard: {},
  settingRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  trackingActive: { ...typography.caption, color: colors.kidnap[600], fontWeight: "700", marginTop: spacing.sm },
  trustedCard: {},
  link: { ...typography.caption, color: colors.kidnap[500], fontWeight: "700", marginTop: spacing.sm },
});
