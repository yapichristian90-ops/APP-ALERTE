import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { colors, radius, spacing, typography } from "@/theme";

interface AppTextInputProps extends TextInputProps {
  label: string;
  error?: string;
  hint?: string;
}

export function AppTextInput({ label, error, hint, style, ...props }: AppTextInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.neutral[400]}
        style={[
          styles.input,
          focused && styles.inputFocused,
          Boolean(error) && styles.inputError,
          style,
        ]}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  label: { ...typography.bodyStrong, color: colors.neutral[700], marginBottom: spacing.xs },
  input: {
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
    backgroundColor: colors.neutral[0],
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.neutral[800],
  },
  inputFocused: { borderColor: colors.brand[400] },
  inputError: { borderColor: colors.violence[500] },
  error: { ...typography.caption, color: colors.violence[500], marginTop: spacing.xs },
  hint: { ...typography.caption, color: colors.neutral[500], marginTop: spacing.xs },
});
