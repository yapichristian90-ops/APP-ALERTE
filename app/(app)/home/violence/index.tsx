import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Card } from "@/components/Card";
import { AppButton } from "@/components/AppButton";
import { colors, radius, spacing, typography } from "@/theme";
import { getCurrentLocation } from "@/services/location";
import { triggerViolenceAlert, resolveMyAlert } from "@/services/violence";
import { startScreamDetection, ScreamDetectorUnsubscribe } from "@/services/screamDetector";
import { useAuthStore } from "@/store/authStore";

const HOLD_DURATION_MS = 1400;

export default function ViolenceHomeScreen() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const [listeningForCry, setListeningForCry] = useState(false);
  const [activeAlertId, setActiveAlertId] = useState<string | null>(null);
  const [triggering, setTriggering] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const detectorStop = useRef<ScreamDetectorUnsubscribe | null>(null);

  const contactsCount = profile?.emergencyContacts.length ?? 0;

  useEffect(() => {
    return () => {
      detectorStop.current?.();
    };
  }, []);

  async function toggleCryListening(value: boolean) {
    if (value && contactsCount === 0) {
      Alert.alert("Ajoutez un contact d'urgence", "Vous devez enregistrer au moins un contact avant d'activer l'écoute.");
      return;
    }
    setListeningForCry(value);
    if (value) {
      detectorStop.current = await startScreamDetection(() => {
        handleTrigger("cri");
      });
    } else {
      detectorStop.current?.();
      detectorStop.current = null;
    }
  }

  async function handleTrigger(mode: "cri" | "manuel") {
    if (contactsCount === 0) {
      Alert.alert("Ajoutez un contact d'urgence", "Vous devez enregistrer au moins un contact avant de déclencher une alerte.");
      return;
    }
    setTriggering(true);
    try {
      const location = await getCurrentLocation();
      const { alert } = await triggerViolenceAlert(mode, location);
      setActiveAlertId(alert.id);
    } catch (e: any) {
      Alert.alert("Alerte impossible", e.message ?? "Réessayez.");
    } finally {
      setTriggering(false);
    }
  }

  async function handleEndAlert() {
    if (!activeAlertId) return;
    try {
      await resolveMyAlert(activeAlertId);
      setActiveAlertId(null);
    } catch (e: any) {
      Alert.alert("Erreur", e.message ?? "Impossible de lever l'alerte.");
    }
  }

  function startHold() {
    Animated.timing(scale, { toValue: 1.12, duration: HOLD_DURATION_MS, useNativeDriver: true }).start();
    holdTimer.current = setTimeout(() => handleTrigger("manuel"), HOLD_DURATION_MS);
  }

  function cancelHold() {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    Animated.timing(scale, { toValue: 1, duration: 150, useNativeDriver: true }).start();
  }

  return (
    <Screen background={colors.violence[100]}>
      <ScreenHeader title="Alerte Violence" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        {activeAlertId ? (
          <Card style={styles.activeCard}>
            <Text style={styles.activeTitle}>🚨 Alerte en cours</Text>
            <Text style={styles.activeText}>
              Vos contacts d'urgence ont été prévenus et votre position leur a été transmise. La sirène sonne chez eux.
            </Text>
            <AppButton label="Je suis en sécurité — Terminer l'alerte" variant="secondary" onPress={handleEndAlert} style={{ marginTop: spacing.lg }} />
          </Card>
        ) : (
          <>
            <View style={styles.sosWrapper}>
              <Animated.View
                style={[styles.sosButton, { transform: [{ scale }] }]}
                onTouchStart={startHold}
                onTouchEnd={cancelHold}
              >
                <Text style={styles.sosText}>{triggering ? "…" : "SOS"}</Text>
              </Animated.View>
            </View>
            <Text style={styles.sosHint}>Maintenez appuyé 1,5 seconde pour déclencher l'alerte manuellement</Text>
          </>
        )}

        <Card style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Écoute du cri discret</Text>
              <Text style={styles.settingDescription}>
                Le microphone détecte un cri de détresse et déclenche l'alerte automatiquement, sans que vous touchiez le
                téléphone.
              </Text>
            </View>
            <Switch
              value={listeningForCry}
              onValueChange={toggleCryListening}
              trackColor={{ true: colors.violence[500], false: colors.neutral[300] }}
            />
          </View>
        </Card>

        <Card style={styles.contactsCard} onTouchEnd={() => router.push("/(app)/home/violence/contacts")}>
          <Text style={styles.contactsTitle}>Mes contacts d'urgence</Text>
          <Text style={styles.contactsCount}>{contactsCount} / 3 enregistrés</Text>
          <Text style={styles.contactsLink}>Gérer les contacts →</Text>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl, alignItems: "center" },
  activeCard: { width: "100%", backgroundColor: colors.violence[500] },
  activeTitle: { ...typography.h2, color: colors.neutral[0] },
  activeText: { ...typography.body, color: "rgba(255,255,255,0.9)", marginTop: spacing.sm },
  sosWrapper: { marginTop: spacing.xxl, marginBottom: spacing.lg },
  sosButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.violence[500],
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.violence[600],
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 10,
  },
  sosText: { ...typography.display, color: colors.neutral[0], letterSpacing: 4 },
  sosHint: { ...typography.caption, color: colors.violence[600], textAlign: "center", marginBottom: spacing.xl },
  settingCard: { width: "100%", marginBottom: spacing.lg },
  settingRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  settingTitle: { ...typography.bodyStrong, color: colors.neutral[800] },
  settingDescription: { ...typography.caption, color: colors.neutral[500], marginTop: 2 },
  contactsCard: { width: "100%" },
  contactsTitle: { ...typography.bodyStrong, color: colors.neutral[800] },
  contactsCount: { ...typography.caption, color: colors.neutral[500], marginTop: 2 },
  contactsLink: { ...typography.caption, color: colors.violence[500], fontWeight: "700", marginTop: spacing.sm },
});
