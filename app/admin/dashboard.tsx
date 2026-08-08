import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AdminShell } from "@/components/AdminShell";
import { Card } from "@/components/Card";
import { colors, spacing, typography } from "@/theme";
import { fetchAdminStats, AdminStats } from "@/services/admin";

export default function AdminDashboardScreen() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminStats().then(setStats).catch((e) => setError(e.message));
  }, []);

  return (
    <AdminShell active="dashboard" title="Vue d'ensemble">
      <ScrollView contentContainerStyle={styles.content}>
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.grid}>
          <StatCard label="Utilisateurs inscrits" value={stats?.totalUsers ?? "—"} />
          <StatCard label="Abonnés Premium" value={stats?.premiumUsers ?? "—"} />
          <StatCard label="Essai Akwaba" value={stats?.akwabaUsers ?? "—"} />
        </View>

        <Text style={styles.sectionTitle}>Revenus des paiements réussis</Text>
        <View style={styles.grid}>
          <StatCard label="Aujourd'hui" value={formatXof(stats?.revenue.today)} accent />
          <StatCard label="Ce mois-ci" value={formatXof(stats?.revenue.month)} accent />
          <StatCard label="Cette année" value={formatXof(stats?.revenue.year)} accent />
        </View>
      </ScrollView>
    </AdminShell>
  );
}

function formatXof(value?: number) {
  if (value === undefined) return "—";
  return `${value.toLocaleString("fr-FR")} F CFA`;
}

function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <Card style={[styles.statCard, accent && { backgroundColor: colors.brand[600] }]}>
      <Text style={[styles.statValue, accent && { color: colors.neutral[0] }]}>{value}</Text>
      <Text style={[styles.statLabel, accent && { color: "rgba(255,255,255,0.85)" }]}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  error: { ...typography.body, color: colors.violence[500], marginBottom: spacing.md },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md, marginBottom: spacing.xl },
  statCard: { flexGrow: 1, minWidth: 140 },
  statValue: { ...typography.h1, color: colors.neutral[800] },
  statLabel: { ...typography.caption, color: colors.neutral[500], marginTop: 4 },
  sectionTitle: { ...typography.h3, color: colors.neutral[800], marginBottom: spacing.md },
});
