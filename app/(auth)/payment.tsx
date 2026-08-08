import React, { useState } from "react";
import { Alert, Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Card } from "@/components/Card";
import { AppButton } from "@/components/AppButton";
import { colors, radius, spacing, typography } from "@/theme";
import { initiatePremiumPayment } from "@/services/payments";
import type { MobileMoneyProvider } from "@/types";

const PROVIDERS: { id: MobileMoneyProvider; label: string; emoji: string; color: string }[] = [
  { id: "orange", label: "Orange Money", emoji: "🟠", color: "#FF7900" },
  { id: "mtn", label: "MTN Money", emoji: "🟡", color: "#FFCB05" },
  { id: "moov", label: "Moov Money", emoji: "🔵", color: "#0072CE" },
  { id: "wave", label: "Wave", emoji: "🌊", color: "#1DC8E4" },
];

export default function PaymentScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<MobileMoneyProvider | null>(null);
  const [processing, setProcessing] = useState(false);
  const [pendingPaymentId, setPendingPaymentId] = useState<string | null>(null);

  async function handlePay() {
    if (!selected) return;
    setProcessing(true);
    try {
      const session = await initiatePremiumPayment(selected);
      setPendingPaymentId(session.paymentId);
      if (session.checkoutUrl) {
        await Linking.openURL(session.checkoutUrl);
      } else {
        Alert.alert(
          "Paiement en préparation",
          "Votre demande de paiement de 3 000 F CFA a été enregistrée. La confirmation par " +
            PROVIDERS.find((p) => p.id === selected)?.label +
            " arrivera automatiquement dès que le prestataire de paiement sera activé sur ce compte.",
        );
      }
    } catch (e: any) {
      Alert.alert("Paiement impossible", e.message ?? "Réessayez dans un instant.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <Screen background={colors.neutral[50]}>
      <ScreenHeader title="Paiement Premium" subtitle="3 000 F CFA / an" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.intro}>Choisissez votre moyen de paiement mobile money :</Text>

        {PROVIDERS.map((provider) => (
          <Card
            key={provider.id}
            style={[styles.providerCard, selected === provider.id && { borderColor: provider.color, borderWidth: 2 }]}
          >
            <View style={styles.providerRow} onTouchEnd={() => setSelected(provider.id)}>
              <Text style={styles.providerEmoji}>{provider.emoji}</Text>
              <Text style={styles.providerLabel}>{provider.label}</Text>
              <View style={[styles.radio, selected === provider.id && { backgroundColor: provider.color, borderColor: provider.color }]} />
            </View>
          </Card>
        ))}

        <AppButton
          label={pendingPaymentId ? "Paiement en attente de confirmation" : "Payer 3 000 F CFA"}
          onPress={handlePay}
          disabled={!selected || Boolean(pendingPaymentId)}
          loading={processing}
          style={{ marginTop: spacing.lg }}
        />

        <AppButton
          label="Continuer avec l'essai gratuit Akwaba pour l'instant"
          variant="ghost"
          onPress={() => router.replace("/(app)/home")}
          style={{ marginTop: spacing.md }}
        />

        <Text style={styles.security}>
          🔒 Le paiement est traité directement par votre opérateur mobile money. ALERTE Côte d'Ivoire ne stocke jamais
          votre code secret mobile money.
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  intro: { ...typography.body, color: colors.neutral[600], marginBottom: spacing.lg },
  providerCard: { marginBottom: spacing.md },
  providerRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  providerEmoji: { fontSize: 26 },
  providerLabel: { ...typography.bodyStrong, color: colors.neutral[800], flex: 1 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.neutral[300] },
  security: { ...typography.caption, color: colors.neutral[500], textAlign: "center", marginTop: spacing.xl },
});
