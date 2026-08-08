import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "@/theme";

interface CheckboxRowProps {
  checked: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function CheckboxRow({ checked, onToggle, children }: CheckboxRowProps) {
  return (
    <Pressable onPress={onToggle} style={styles.row}>
      <View style={[styles.box, checked && styles.boxChecked]}>{checked && <Text style={styles.check}>✓</Text>}</View>
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md, marginBottom: spacing.md },
  box: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.neutral[300],
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  boxChecked: { backgroundColor: colors.brand[500], borderColor: colors.brand[500] },
  check: { color: colors.neutral[0], fontWeight: "800", fontSize: 14 },
  text: { ...typography.body, color: colors.neutral[700], flex: 1 },
});
