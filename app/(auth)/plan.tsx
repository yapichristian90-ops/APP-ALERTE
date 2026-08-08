import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Card } from "@/components/Card";
import { AppButton } from "@/components/AppButton";
import { colors, radius, spacing, typography } from "@/theme";

export default function PlanSelectionScreen() {
  const router = useRouter();

  return (
    <Screen background={colors.neutral[50]}>
      <ScreenHeader title="Choisissez votre forfait" subtitle="Étape 3 sur 3" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.planCard}>
          <View style={[styles.badge, { backgroundColor: colors.brand[100] }]}>
            <Text style={[styles.badgeText, { color: colors.brand[700] }]}>OFFERT 30 JOURS</Text>
          </View>
          <Text style={styles.planName}>Akwaba</Text>
          <Text style={styles.planPrice}>Gratuit pendant 30 jours</Text>
          <Text style={styles.planDescription}>
            Essayez gratuitement toutes les fonctionnalités : Alerte Violence, Alerte Enlèvement, contacts illimités en
            modification. Aucun paiement requis pour commencer.
          </Text>
          <AppButton
            label="Démarrer avec Akwaba"
            onPress={() => router.replace("/(app)/home")}
            style={{ marginTop: spacing.lg }}
          />
        </Card>

        <View style={styles.orDivider}>
          <View style={styles.dividerLine} />
          <Text style={styles.orText}>ou</Text>
          <View style={styles.dividerLine} />
        </View>

        <Card style={styles.planCard}>
          <View style={[styles.badge, { backgroundColor: colors.neutral[800] }]}>
            <Text style={[styles.badgeText, { color: colors.neutral[0] }]}>PREMIUM</Text>
          </View>
          <Text style={styles.planName}>Premium</Text>
          <Text style={styles.planPrice}>3 000 F CFA / an</Text>
          <Text style={styles.planDescription}>
            Accès continu après votre essai gratuit. Paiement sécurisé par Orange Money, MTN Money, Moov Money ou Wave.
          </Text>
          <AppButton
            label="Passer à Premium maintenant"
            variant="secondary"
            onPress={() => router.push("/(auth)/payment")}
            style={{ marginTop: spacing.lg }}
          />
        </Card>

        <Text style={styles.footNote}>
          Vous pourrez changer de forfait à tout moment depuis votre profil, rubrique « Gérer mon abonnement ».
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  planCard: { alignItems: "flex-start" },
  badge: { paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.pill, marginBottom: spacing.md },
  badgeText: { ...typography.tiny },
  planName: { ...typography.h1, color: colors.neutral[800] },
  planPrice: { ...typography.h3, color: colors.brand[600], marginTop: 2, marginBottom: spacing.md },
  planDescription: { ...typography.body, color: colors.neutral[600] },
  orDivider: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginVertical: spacing.lg },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.neutral[200] },
  orText: { ...typography.caption, color: colors.neutral[400] },
  footNote: { ...typography.caption, color: colors.neutral[500], textAlign: "center", marginTop: spacing.lg },
});
