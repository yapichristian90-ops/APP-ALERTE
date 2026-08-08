import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Card } from "@/components/Card";
import { AppButton } from "@/components/AppButton";
import { colors, radius, spacing, typography } from "@/theme";
import { useAuthStore, computeEffectivePlan, trialDaysRemaining } from "@/store/authStore";
import { fetchMyPayments } from "@/services/payments";

export default function SubscriptionScreen() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const effectivePlan = computeEffectivePlan(profile);
  const daysLeft = trialDaysRemaining(profile);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    fetchMyPayments().then(setPayments).catch(() => {});
  }, []);

  return (
    <Screen background={colors.neutral[50]}>
      <ScreenHeader title="Gérer mon abonnement" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text style={styles.planLabel}>Forfait actuel</Text>
          <Text style={styles.planName}>{effectivePlan === "premium" ? "Premium" : "Akwaba (essai gratuit)"}</Text>
          {profile?.plan !== "premium" ? (
            <Text style={styles.planDetail}>
              {daysLeft > 0 ? `${daysLeft} jour${daysLeft > 1 ? "s" : ""} restant${daysLeft > 1 ? "s" : ""} avant la fin de l'essai.` : "Votre essai gratuit est terminé."}
            </Text>
          ) : (
            <Text style={styles.planDetail}>
              Actif jusqu'au {profile?.subscriptionActiveUntil ? new Date(profile.subscriptionActiveUntil).toLocaleDateString("fr-FR") : "—"}
            </Text>
          )}

          {profile?.plan !== "premium" ? (
            <AppButton
              label="Passer à Premium — 3 000 F CFA/an"
              onPress={() => router.push("/(auth)/payment")}
              style={{ marginTop: spacing.lg }}
            />
          ) : null}
        </Card>

        <Text style={styles.historyTitle}>Historique des paiements</Text>
        {payments.length === 0 ? (
          <Text style={styles.emptyHistory}>Aucun paiement pour le moment.</Text>
        ) : (
          payments.map((p) => (
            <Card key={p.id} style={styles.paymentRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.paymentAmount}>{p.amount} F CFA — {p.provider}</Text>
                <Text style={styles.paymentDate}>{new Date(p.created_at).toLocaleDateString("fr-FR")}</Text>
              </View>
              <View style={[styles.statusBadge, statusColor(p.status)]}>
                <Text style={styles.statusText}>{statusLabel(p.status)}</Text>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

function statusLabel(status: string) {
  if (status === "reussi") return "Réussi";
  if (status === "echoue") return "Échoué";
  return "En attente";
}

function statusColor(status: string) {
  if (status === "reussi") return { backgroundColor: colors.success };
  if (status === "echoue") return { backgroundColor: colors.violence[500] };
  return { backgroundColor: colors.warning };
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  planLabel: { ...typography.caption, color: colors.neutral[500] },
  planName: { ...typography.h1, color: colors.neutral[800], marginTop: 2 },
  planDetail: { ...typography.body, color: colors.neutral[600], marginTop: spacing.xs },
  historyTitle: { ...typography.h3, color: colors.neutral[800], marginTop: spacing.xl, marginBottom: spacing.md },
  emptyHistory: { ...typography.body, color: colors.neutral[400] },
  paymentRow: { flexDirection: "row", alignItems: "center", marginBottom: spacing.md },
  paymentAmount: { ...typography.bodyStrong, color: colors.neutral[800] },
  paymentDate: { ...typography.caption, color: colors.neutral[500], marginTop: 2 },
  statusBadge: { paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.pill },
  statusText: { ...typography.tiny, color: colors.neutral[0] },
});
