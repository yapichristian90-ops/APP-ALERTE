import React from "react";
import { Redirect, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Screen } from "./Screen";
import { colors, radius, spacing, typography } from "@/theme";
import { useAdminStore } from "@/store/adminStore";

const NAV_ITEMS = [
  { key: "dashboard", label: "Vue d'ensemble", href: "/admin/dashboard" as const },
  { key: "users", label: "Inscriptions & forfaits", href: "/admin/users" as const },
  { key: "payments", label: "Paiements", href: "/admin/payments" as const },
  { key: "editors", label: "Éditeurs", href: "/admin/editors" as const },
];

interface AdminShellProps {
  active: string;
  title: string;
  children: React.ReactNode;
  requirePrincipal?: boolean;
}

export function AdminShell({ active, title, children, requirePrincipal }: AdminShellProps) {
  const router = useRouter();
  const admin = useAdminStore((s) => s.admin);
  const logout = useAdminStore((s) => s.logout);

  if (!admin) return <Redirect href="/admin/login" />;
  if (requirePrincipal && admin.role !== "admin_principal") {
    return (
      <Screen background={colors.neutral[900]}>
        <View style={styles.deniedWrap}>
          <Text style={styles.deniedText}>Réservé à l'administrateur principal.</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen background={colors.neutral[900]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>ADMINISTRATION</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.logout} onPress={logout}>Déconnexion</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <Text
            key={item.key}
            style={[styles.navItem, active === item.key && styles.navItemActive]}
            onPress={() => router.replace(item.href)}
          >
            {item.label}
          </Text>
        ))}
      </ScrollView>

      <View style={styles.body}>{children}</View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  eyebrow: { ...typography.tiny, color: colors.brand[400], letterSpacing: 2 },
  title: { ...typography.h1, color: colors.neutral[0], marginTop: 4 },
  logout: { ...typography.caption, color: colors.neutral[400], marginTop: spacing.sm },
  nav: { paddingHorizontal: spacing.xl, gap: spacing.lg, paddingVertical: spacing.lg },
  navItem: { ...typography.bodyStrong, color: colors.neutral[500] },
  navItemActive: { color: colors.brand[400], textDecorationLine: "underline" },
  body: { flex: 1, backgroundColor: colors.neutral[50], borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl },
  deniedWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  deniedText: { ...typography.body, color: colors.neutral[300] },
});
