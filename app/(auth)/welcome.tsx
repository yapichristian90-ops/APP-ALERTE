import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Logo } from "@/components/Logo";
import { AppButton } from "@/components/AppButton";
import { colors, spacing, typography } from "@/theme";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={[colors.brand[50], colors.neutral[0]]} style={styles.container}>
      <View style={styles.hero}>
        <Logo size={104} />
        <Text style={styles.title}>ALERTE Côte d'Ivoire</Text>
        <Text style={styles.subtitle}>
          Une réaction immédiate face aux violences et aux disparitions, grâce à votre réseau de confiance.
        </Text>
      </View>

      <View style={styles.pillars}>
        <Pillar emoji="🚨" text="Alerte discrète en cas de violence" />
        <Pillar emoji="📍" text="Localisation en temps réel en cas d'enlèvement" />
        <Pillar emoji="👨‍👩‍👧" text="Vos proches, prévenus instantanément" />
      </View>

      <View style={styles.actions}>
        <AppButton label="Créer un compte" onPress={() => router.push("/(auth)/register")} />
        <AppButton
          label="J'ai déjà un compte — Se connecter"
          variant="secondary"
          onPress={() => router.push("/(auth)/login")}
          style={{ marginTop: spacing.md }}
        />
      </View>
    </LinearGradient>
  );
}

function Pillar({ emoji, text }: { emoji: string; text: string }) {
  return (
    <View style={styles.pillarRow}>
      <Text style={styles.pillarEmoji}>{emoji}</Text>
      <Text style={styles.pillarText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.xxxl, justifyContent: "space-between" },
  hero: { alignItems: "center", marginTop: spacing.xl },
  title: { ...typography.h1, color: colors.neutral[800], marginTop: spacing.lg, textAlign: "center" },
  subtitle: { ...typography.body, color: colors.neutral[600], textAlign: "center", marginTop: spacing.sm },
  pillars: { gap: spacing.lg, marginVertical: spacing.xl },
  pillarRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  pillarEmoji: { fontSize: 24 },
  pillarText: { ...typography.bodyStrong, color: colors.neutral[700], flex: 1 },
  actions: { paddingBottom: spacing.xl },
});
