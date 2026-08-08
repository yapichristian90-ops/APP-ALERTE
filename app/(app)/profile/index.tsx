import React from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { Card } from "@/components/Card";
import { AppButton } from "@/components/AppButton";
import { Logo } from "@/components/Logo";
import { colors, radius, spacing, typography } from "@/theme";
import { useAuthStore, computeEffectivePlan } from "@/store/authStore";

export default function ProfileScreen() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const signOut = useAuthStore((s) => s.signOut);
  const effectivePlan = computeEffectivePlan(profile);

  function handleLogout() {
    Alert.alert("Se déconnecter ?", "Vous devrez ressaisir votre code secret pour vous reconnecter.", [
      { text: "Annuler", style: "cancel" },
      { text: "Se déconnecter", style: "destructive", onPress: signOut },
    ]);
  }

  const menuItems: { label: string; emoji: string; onPress: () => void }[] = [
    { label: "Modifier mes informations", emoji: "✏️", onPress: () => router.push("/(app)/profile/edit") },
    { label: "Gérer mon abonnement", emoji: "💳", onPress: () => router.push("/(app)/profile/subscription") },
    { label: "Contacts d'urgence (Alerte Violence)", emoji: "🚨", onPress: () => router.push("/(app)/home/violence/contacts") },
    { label: "Numéros de confiance (Alerte Enlèvement)", emoji: "📍", onPress: () => router.push("/(app)/home/kidnap/trusted") },
    { label: "Questions fréquentes (FAQ)", emoji: "❓", onPress: () => router.push("/(app)/profile/faq") },
    { label: "Conditions Générales d'Utilisation", emoji: "📄", onPress: () => router.push("/legal/terms") },
    { label: "Politique de Confidentialité", emoji: "🔒", onPress: () => router.push("/legal/privacy") },
  ];

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Logo size={64} />
          <Text style={styles.name}>{profile?.firstName} {profile?.lastName}</Text>
          <Text style={styles.phone}>+225 {profile?.phone.replace("+225", "")}</Text>
          <View style={[styles.planBadge, { backgroundColor: effectivePlan === "premium" ? colors.brand[600] : colors.neutral[300] }]}>
            <Text style={styles.planBadgeText}>{effectivePlan === "premium" ? "PREMIUM" : "AKWABA"}</Text>
          </View>
        </View>

        <Card style={{ padding: 0, overflow: "hidden" }}>
          {menuItems.map((item, i) => (
            <View
              key={item.label}
              style={[styles.menuRow, i < menuItems.length - 1 && styles.menuRowBorder]}
              onTouchEnd={item.onPress}
            >
              <Text style={styles.menuEmoji}>{item.emoji}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuChevron}>›</Text>
            </View>
          ))}
        </Card>

        <AppButton label="Se déconnecter" variant="ghost" onPress={handleLogout} style={{ marginTop: spacing.xl }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.xxxl },
  header: { alignItems: "center", marginBottom: spacing.xl },
  name: { ...typography.h2, color: colors.neutral[800], marginTop: spacing.md },
  phone: { ...typography.caption, color: colors.neutral[500], marginTop: 2 },
  planBadge: { marginTop: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.pill },
  planBadgeText: { ...typography.tiny, color: colors.neutral[0] },
  menuRow: { flexDirection: "row", alignItems: "center", padding: spacing.lg, gap: spacing.md },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.neutral[100] },
  menuEmoji: { fontSize: 20 },
  menuLabel: { ...typography.body, color: colors.neutral[800], flex: 1 },
  menuChevron: { color: colors.neutral[300], fontSize: 22 },
});
