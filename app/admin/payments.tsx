import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AdminShell } from "@/components/AdminShell";
import { Card } from "@/components/Card";
import { colors, radius, spacing, typography } from "@/theme";
import { fetchAllPayments } from "@/services/admin";
import type { PaymentRecord } from "@/types";

export default function AdminPaymentsScreen() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllPayments().then(setPayments).catch((e) => setError(e.message));
  }, []);

  return (
    <AdminShell active="payments" title="Paiements">
      <ScrollView contentContainerStyle={styles.content}>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {payments.map((p) => (
          <Card key={p.id} style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{p.userName || "Utilisateur"}</Text>
              <Text style={styles.detail}>+225 {p.userPhone.replace("+225", "")} · {p.provider} · {p.amount} F CFA</Text>
              <Text style={styles.detail}>{new Date(p.createdAt).toLocaleString("fr-FR")}</Text>
            </View>
            <View style={[styles.badge, statusColor(p.status)]}>
              <Text style={styles.badgeText}>{statusLabel(p.status)}</Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </AdminShell>
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
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  error: { ...typography.body, color: colors.violence[500], marginBottom: spacing.md },
  row: { flexDirection: "row", alignItems: "center", marginBottom: spacing.md },
  name: { ...typography.bodyStrong, color: colors.neutral[800] },
  detail: { ...typography.caption, color: colors.neutral[500], marginTop: 2 },
  badge: { paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.pill },
  badgeText: { ...typography.tiny, color: colors.neutral[0] },
});
