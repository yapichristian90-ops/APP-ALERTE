import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { AppTextInput } from "@/components/AppTextInput";
import { PhoneInput } from "@/components/PhoneInput";
import { AppButton } from "@/components/AppButton";
import { Logo } from "@/components/Logo";
import { colors, spacing, typography } from "@/theme";
import { isValidIvorianPhone } from "@/constants/phone";
import { loginUser } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";

export default function LoginScreen() {
  const router = useRouter();
  const refreshProfile = useAuthStore((s) => s.refreshProfile);
  const [phone, setPhone] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    const nextErrors: Record<string, string> = {};
    if (!isValidIvorianPhone(phone)) nextErrors.phone = "Numéro ivoirien invalide.";
    if (accessCode.length < 6) nextErrors.accessCode = "Code secret invalide.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await loginUser(phone, accessCode);
      await refreshProfile();
      router.replace("/(app)/home");
    } catch (e: any) {
      Alert.alert("Connexion impossible", e.message ?? "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen background={colors.neutral[50]}>
      <ScreenHeader title="Se connecter" onBack={() => router.back()} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.logoWrap}>
            <Logo size={72} />
          </View>
          <PhoneInput value={phone} onChangeText={setPhone} error={errors.phone} />
          <AppTextInput
            label="Code secret d'accès"
            value={accessCode}
            onChangeText={setAccessCode}
            error={errors.accessCode}
            secureTextEntry
            placeholder="Votre code secret"
          />
          <AppButton label="Se connecter" onPress={handleSubmit} loading={submitting} style={{ marginTop: spacing.md }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  logoWrap: { alignItems: "center", marginVertical: spacing.xl },
});
