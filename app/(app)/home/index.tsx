import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { SectionTile } from "@/components/SectionTile";
import { Logo } from "@/components/Logo";
import { colors, spacing, typography } from "@/theme";
import { useAuthStore, trialDaysRemaining, computeEffectivePlan } from "@/store/authStore";

export default function HomeScreen() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const daysLeft = trialDaysRemaining(profile);
  const effectivePlan = computeEffectivePlan(profile);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bonjour {profile?.firstName ?? ""} 👋</Text>
            <Text style={styles.subGreeting}>Vous êtes en sécurité avec ALERTE CI</Text>
          </View>
          <Logo size={44} />
        </View>

        {effectivePlan === "premium" && profile?.plan !== "premium" ? (
          <View style={styles.trialBanner}>
            <Text style={styles.trialText}>
              🎁 Essai Akwaba actif — {daysLeft} jour{daysLeft > 1 ? "s" : ""} restant{daysLeft > 1 ? "s" : ""}
            </Text>
          </View>
        ) : null}

        <SectionTile
          title="Alerte Violence"
          subtitle="Cri discret, sirène et position envoyés à vos contacts d'urgence"
          emoji="🚨"
          colorsPair={[colors.violence[500], colors.violence[600]] as const}
          onPress={() => router.push("/(app)/home/violence")}
          badge="URGENCE"
        />

        <View style={{ height: spacing.lg }} />

        <SectionTile
          title="Alerte Enlèvement"
          subtitle="Retrouvez un proche par son numéro grâce aux contacts de confiance"
          emoji="📍"
          colorsPair={[colors.kidnap[500], colors.kidnap[600]] as const}
          onPress={() => router.push("/(app)/home/kidnap")}
        />

        <Text style={styles.reminder}>
          En cas de danger immédiat, contactez toujours en priorité la Police (110/111), la Gendarmerie (170) ou les
          Sapeurs-Pompiers (180).
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.xxxl },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.xl },
  greeting: { ...typography.h2, color: colors.neutral[800] },
  subGreeting: { ...typography.caption, color: colors.neutral[500], marginTop: 2 },
  trialBanner: {
    backgroundColor: colors.brand[100],
    borderRadius: 14,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  trialText: { ...typography.bodyStrong, color: colors.brand[700] },
  reminder: { ...typography.caption, color: colors.neutral[500], textAlign: "center", marginTop: spacing.xl, lineHeight: 18 },
});
