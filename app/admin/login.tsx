import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Screen } from "@/components/Screen";
import { AppTextInput } from "@/components/AppTextInput";
import { PhoneInput } from "@/components/PhoneInput";
import { AppButton } from "@/components/AppButton";
import { colors, spacing, typography } from "@/theme";
import { useAdminStore } from "@/store/adminStore";

export default function AdminLoginScreen() {
  const router = useRouter();
  const login = useAdminStore((s) => s.login);
  const isLoading = useAdminStore((s) => s.isLoading);
  const [phone, setPhone] = useState("");
  const [accessCode, setAccessCode] = useState("");

  async function handleSubmit() {
    try {
      await login(phone, accessCode);
      router.replace("/admin/dashboard");
    } catch (e: any) {
      Alert.alert("Connexion refusée", e.message ?? "Identifiants incorrects.");
    }
  }

  return (
    <Screen background={colors.neutral[900]}>
      <LinearGradient colors={[colors.neutral[900], colors.neutral[800]]} style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <View style={styles.headerWrap}>
            <Text style={styles.eyebrow}>ALERTE CÔTE D'IVOIRE</Text>
            <Text style={styles.title}>Espace administrateur</Text>
            <Text style={styles.subtitle}>Accès réservé à l'équipe d'administration.</Text>
          </View>

          <PhoneInput value={phone} onChangeText={setPhone} />
          <AppTextInput label="Code secret" value={accessCode} onChangeText={setAccessCode} secureTextEntry placeholder="Code administrateur" />

          <AppButton label="Accéder au tableau de bord" onPress={handleSubmit} loading={isLoading} style={{ marginTop: spacing.lg }} />
        </KeyboardAvoidingView>
      </LinearGradient>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.xl, justifyContent: "center" },
  headerWrap: { marginBottom: spacing.xxl },
  eyebrow: { ...typography.tiny, color: colors.brand[400], letterSpacing: 2 },
  title: { ...typography.h1, color: colors.neutral[0], marginTop: spacing.sm },
  subtitle: { ...typography.body, color: colors.neutral[400], marginTop: spacing.xs },
});
