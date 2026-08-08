import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { AppTextInput } from "@/components/AppTextInput";
import { PhoneInput } from "@/components/PhoneInput";
import { AppButton } from "@/components/AppButton";
import { colors, spacing, typography } from "@/theme";
import { isValidIvorianPhone } from "@/constants/phone";
import { COMMUNES_CI } from "@/constants/communes";
import { registerUser } from "@/services/auth";
import { CommunePicker } from "@/components/CommunePicker";

export default function RegisterScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [commune, setCommune] = useState<string | null>(null);
  const [accessCode, setAccessCode] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    const nextErrors: Record<string, string> = {};
    if (firstName.trim().length < 2) nextErrors.firstName = "Indiquez votre prénom.";
    if (lastName.trim().length < 2) nextErrors.lastName = "Indiquez votre nom.";
    if (!isValidIvorianPhone(phone)) nextErrors.phone = "Numéro ivoirien invalide (10 chiffres).";
    if (!commune) nextErrors.commune = "Choisissez votre commune.";
    if (accessCode.length < 6) nextErrors.accessCode = "Le code secret doit contenir au moins 6 caractères.";
    if (accessCode !== confirmCode) nextErrors.confirmCode = "Les deux codes ne correspondent pas.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await registerUser({ firstName, lastName, phone, commune: commune!, accessCode });
      router.replace("/(auth)/legal");
    } catch (e: any) {
      Alert.alert("Inscription impossible", e.message ?? "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen background={colors.neutral[50]}>
      <ScreenHeader title="Créer un compte" subtitle="Étape 1 sur 3" onBack={() => router.back()} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.intro}>
            Ces informations permettent de vous identifier et de transmettre votre position à vos contacts en cas d'alerte.
          </Text>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <AppTextInput label="Prénom" value={firstName} onChangeText={setFirstName} error={errors.firstName} placeholder="Awa" />
            </View>
            <View style={{ flex: 1 }}>
              <AppTextInput label="Nom" value={lastName} onChangeText={setLastName} error={errors.lastName} placeholder="Koné" />
            </View>
          </View>

          <PhoneInput value={phone} onChangeText={setPhone} error={errors.phone} />

          <CommunePicker value={commune} onChange={setCommune} options={COMMUNES_CI} error={errors.commune} />

          <AppTextInput
            label="Code secret d'accès"
            value={accessCode}
            onChangeText={setAccessCode}
            error={errors.accessCode}
            secureTextEntry
            placeholder="Au moins 6 caractères"
            hint="Ce code vous servira à vous connecter avec votre numéro."
          />
          <AppTextInput
            label="Confirmer le code secret"
            value={confirmCode}
            onChangeText={setConfirmCode}
            error={errors.confirmCode}
            secureTextEntry
            placeholder="Ressaisissez le code"
          />

          <AppButton label="Continuer" onPress={handleSubmit} loading={submitting} style={{ marginTop: spacing.md }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  intro: { ...typography.body, color: colors.neutral[600], marginBottom: spacing.xl },
  row: { flexDirection: "row", gap: spacing.md },
});
