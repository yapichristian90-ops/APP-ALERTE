import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "@/theme";

/**
 * Rendu minimal des documents légaux (Markdown -> RN Text), sans dépendance
 * externe : titres (#, ##), listes (-), gras (**...**), tableaux simplifiés
 * en lignes « clé — valeur », le reste en paragraphes.
 */
export function MarkdownLite({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <View>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <View key={i} style={{ height: spacing.sm }} />;
        if (trimmed.startsWith("## ")) {
          return (
            <Text key={i} style={styles.h2}>
              {trimmed.replace("## ", "")}
            </Text>
          );
        }
        if (trimmed.startsWith("# ")) {
          return (
            <Text key={i} style={styles.h1}>
              {trimmed.replace("# ", "")}
            </Text>
          );
        }
        if (trimmed.startsWith("- ")) {
          return (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.paragraph}>{renderInline(trimmed.replace("- ", ""))}</Text>
            </View>
          );
        }
        if (trimmed.startsWith("|")) {
          return (
            <Text key={i} style={styles.tableRow}>
              {trimmed.replace(/\|/g, " ").trim()}
            </Text>
          );
        }
        return (
          <Text key={i} style={styles.paragraph}>
            {renderInline(trimmed)}
          </Text>
        );
      })}
    </View>
  );
}

function renderInline(text: string): string {
  return text.replace(/\*\*/g, "").replace(/`/g, "");
}

const styles = StyleSheet.create({
  h1: { ...typography.h2, color: colors.neutral[800], marginTop: spacing.lg, marginBottom: spacing.sm },
  h2: { ...typography.h3, color: colors.brand[700], marginTop: spacing.md, marginBottom: spacing.xs },
  paragraph: { ...typography.body, color: colors.neutral[600], flex: 1 },
  bulletRow: { flexDirection: "row", gap: spacing.sm, marginBottom: 2 },
  bullet: { color: colors.brand[500] },
  tableRow: { ...typography.caption, color: colors.neutral[500], marginBottom: 2 },
});
