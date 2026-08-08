import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { MarkdownLite } from "@/components/MarkdownLite";
import { CGU_TEXT } from "@/constants/legal";
import { colors, spacing } from "@/theme";

export default function TermsScreen() {
  const router = useRouter();
  return (
    <Screen background={colors.neutral[50]}>
      <ScreenHeader title="Conditions Générales d'Utilisation" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <MarkdownLite content={CGU_TEXT} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
});
