import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, radius, spacing, typography } from "@/theme";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export function AppButton({ label, onPress, variant = "primary", disabled, loading, style, icon }: AppButtonProps) {
  const isDisabled = disabled || loading;

  const content = (
    <>
      {loading ? (
        <ActivityIndicator color={variant === "secondary" || variant === "ghost" ? colors.brand[600] : colors.neutral[0]} />
      ) : (
        <>
          {icon}
          <Text style={[styles.label, labelColor(variant)]}>{label}</Text>
        </>
      )}
    </>
  );

  if (variant === "primary" || variant === "danger") {
    const gradientColors = variant === "danger"
      ? ([colors.violence[500], colors.violence[600]] as const)
      : ([colors.brand[400], colors.brand[600]] as const);
    return (
      <Pressable onPress={onPress} disabled={isDisabled} style={({ pressed }) => [style, { opacity: pressed ? 0.9 : isDisabled ? 0.5 : 1 }]}>
        <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.button, styles.row]}>
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        styles.row,
        variant === "secondary" ? styles.secondary : styles.ghost,
        { opacity: pressed ? 0.85 : isDisabled ? 0.5 : 1 },
        style,
      ]}
    >
      {content}
    </Pressable>
  );
}

function labelColor(variant: Variant) {
  if (variant === "secondary" || variant === "ghost") return { color: colors.brand[600] };
  return { color: colors.neutral[0] };
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  row: { flexDirection: "row", gap: spacing.sm },
  secondary: {
    backgroundColor: colors.brand[100],
  },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.brand[300],
  },
  label: { ...typography.button },
});
