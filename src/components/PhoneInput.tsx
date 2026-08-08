import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radius, spacing, typography } from "@/theme";

interface PhoneInputProps {
  value: string;
  onChangeText: (v: string) => void;
  error?: string;
  label?: string;
}

export function PhoneInput({ value, onChangeText, error, label = "Numéro de téléphone" }: PhoneInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.row, Boolean(error) && styles.rowError]}>
        <View style={styles.prefix}>
          <Text style={styles.prefixText}>🇨🇮 +225</Text>
        </View>
        <TextInput
          value={value}
          onChangeText={(t) => onChangeText(t.replace(/[^0-9]/g, "").slice(0, 10))}
          keyboardType="number-pad"
          placeholder="07 XX XX XX XX"
          placeholderTextColor={colors.neutral[400]}
          style={styles.input}
          maxLength={10}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : (
        <Text style={styles.hint}>Numéro ivoirien à 10 chiffres, ex : 0701020304</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  label: { ...typography.bodyStrong, color: colors.neutral[700], marginBottom: spacing.xs },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
    backgroundColor: colors.neutral[0],
    borderRadius: radius.md,
    overflow: "hidden",
  },
  rowError: { borderColor: colors.violence[500] },
  prefix: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.brand[50],
    borderRightWidth: 1.5,
    borderRightColor: colors.neutral[200],
  },
  prefixText: { ...typography.bodyStrong, color: colors.brand[700] },
  input: { flex: 1, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, fontSize: 16, color: colors.neutral[800] },
  error: { ...typography.caption, color: colors.violence[500], marginTop: spacing.xs },
  hint: { ...typography.caption, color: colors.neutral[500], marginTop: spacing.xs },
});
