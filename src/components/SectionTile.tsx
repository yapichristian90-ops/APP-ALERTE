import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, radius, shadow, spacing, typography } from "@/theme";

interface SectionTileProps {
  title: string;
  subtitle: string;
  emoji: string;
  colorsPair: readonly [string, string];
  onPress: () => void;
  badge?: string;
}

export function SectionTile({ title, subtitle, emoji, colorsPair, onPress, badge }: SectionTileProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.wrapper, { opacity: pressed ? 0.92 : 1 }]}>
      <LinearGradient colors={colorsPair} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.tile}>
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: { ...shadow.floating, borderRadius: radius.xl },
  tile: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    minHeight: 168,
    justifyContent: "flex-end",
  },
  emoji: { fontSize: 40, marginBottom: spacing.sm },
  title: { ...typography.h2, color: colors.neutral[0] },
  subtitle: { ...typography.body, color: "rgba(255,255,255,0.9)", marginTop: 2 },
  badge: {
    position: "absolute",
    top: spacing.lg,
    right: spacing.lg,
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  badgeText: { ...typography.tiny, color: colors.neutral[0] },
});
