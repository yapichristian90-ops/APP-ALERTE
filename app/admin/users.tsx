import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AdminShell } from "@/components/AdminShell";
import { Card } from "@/components/Card";
import { colors, radius, spacing, typography } from "@/theme";
import { fetchAllUsers } from "@/services/admin";

export default function AdminUsersScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllUsers().then(setUsers).catch((e) => setError(e.message));
  }, []);

  return (
    <AdminShell active="users" title="Inscriptions & forfaits">
      <ScrollView contentContainerStyle={styles.content}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Text style={styles.count}>{users.length} utilisateur(s) inscrit(s)</Text>

        {users.map((u) => (
          <Card key={u.id} style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{u.first_name} {u.last_name}</Text>
              <Text style={styles.detail}>+225 {String(u.phone).replace("+225", "")} · {u.commune}</Text>
              <Text style={styles.detail}>Inscrit le {new Date(u.created_at).toLocaleDateString("fr-FR")}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: u.plan === "premium" ? colors.brand[600] : colors.neutral[300] }]}>
              <Text style={styles.badgeText}>{u.plan === "premium" ? "PREMIUM" : "AKWABA"}</Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </AdminShell>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  error: { ...typography.body, color: colors.violence[500], marginBottom: spacing.md },
  count: { ...typography.caption, color: colors.neutral[500], marginBottom: spacing.md },
  row: { flexDirection: "row", alignItems: "center", marginBottom: spacing.md },
  name: { ...typography.bodyStrong, color: colors.neutral[800] },
  detail: { ...typography.caption, color: colors.neutral[500], marginTop: 2 },
  badge: { paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.pill },
  badgeText: { ...typography.tiny, color: colors.neutral[0] },
});
