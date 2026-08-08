import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { CheckboxRow } from "@/components/CheckboxRow";
import { AppButton } from "@/components/AppButton";
import { Card } from "@/components/Card";
import { colors, spacing, typography } from "@/theme";
import { acceptLegalTerms } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";

const TERMS_VERSION = "2026-08-08";

export default function LegalAcceptanceScreen() {
  const router = useRouter();
  const refreshProfile = useAuthStore((s) => s.refreshProfile);
  const [acceptedCgu, setAcceptedCgu] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleContinue() {
    if (!acceptedCgu || !acceptedPrivacy) {
      Alert.alert("Acceptation requise", "Vous devez accepter les CGU et la Politique de Confidentialité pour continuer.");
      return;
    }
    setSubmitting(true);
    try {
      await acceptLegalTerms(TERMS_VERSION);
      await refreshProfile();
      router.replace("/(auth)/plan");
    } catch (e: any) {
      Alert.alert("Erreur", e.message ?? "Impossible d'enregistrer votre acceptation.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen background={colors.neutral[50]}>
      <ScreenHeader title="Dernière étape" subtitle="Étape 2 sur 3" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text style={styles.summaryTitle}>Avant de continuer</Text>
          <Text style={styles.summaryText}>
            ALERTE Côte d'Ivoire utilise votre position et, si vous l'activez, votre microphone pour déclencher des
            alertes de sécurité destinées aux contacts que vous choisissez. Lisez et acceptez les documents ci-dessous
            pour poursuivre.
          </Text>
        </Card>

        <CheckboxRow checked={acceptedCgu} onToggle={() => setAcceptedCgu((v) => !v)}>
          J'ai lu et j'accepte les{" "}
          <Text style={styles.link} onPress={() => router.push("/legal/terms")}>
            Conditions Générales d'Utilisation
          </Text>
          .
        </CheckboxRow>
        <CheckboxRow checked={acceptedPrivacy} onToggle={() => setAcceptedPrivacy((v) => !v)}>
          J'ai lu et j'accepte la{" "}
          <Text style={styles.link} onPress={() => router.push("/legal/privacy")}>
            Politique de Confidentialité
          </Text>
          .
        </CheckboxRow>

        <AppButton label="Accepter et continuer" onPress={handleContinue} loading={submitting} style={{ marginTop: spacing.lg }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl, gap: spacing.lg },
  summaryTitle: { ...typography.h3, color: colors.neutral[800], marginBottom: spacing.xs },
  summaryText: { ...typography.body, color: colors.neutral[600] },
  link: { color: colors.brand[600], fontWeight: "700" },
});
