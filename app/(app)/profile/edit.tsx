import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { AppTextInput } from "@/components/AppTextInput";
import { AppButton } from "@/components/AppButton";
import { CommunePicker } from "@/components/CommunePicker";
import { colors, spacing, typography } from "@/theme";
import { COMMUNES_CI } from "@/constants/communes";
import { useAuthStore } from "@/store/authStore";
import { updateMyProfile } from "@/services/auth";

export default function EditProfileScreen() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const refreshProfile = useAuthStore((s) => s.refreshProfile);
  const [firstName, setFirstName] = useState(profile?.firstName ?? "");
  const [lastName, setLastName] = useState(profile?.lastName ?? "");
  const [commune, setCommune] = useState<string | null>(profile?.commune ?? null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!commune) {
      Alert.alert("Commune requise", "Choisissez votre commune.");
      return;
    }
    setSaving(true);
    try {
      await updateMyProfile({ firstName, lastName, commune });
      await refreshProfile();
      router.back();
    } catch (e: any) {
      Alert.alert("Erreur", e.message ?? "Impossible d'enregistrer.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen background={colors.neutral[50]}>
      <ScreenHeader title="Mes informations" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <AppTextInput label="Prénom" value={firstName} onChangeText={setFirstName} />
        <AppTextInput label="Nom" value={lastName} onChangeText={setLastName} />
        <CommunePicker value={commune} onChange={setCommune} options={COMMUNES_CI} />

        <Text style={styles.readonlyLabel}>Numéro de téléphone</Text>
        <Text style={styles.readonlyValue}>+225 {profile?.phone.replace("+225", "")}</Text>
        <Text style={styles.readonlyHint}>
          Le numéro de téléphone est votre identifiant de connexion et ne peut pas être modifié ici. Contactez le
          support pour tout changement de numéro.
        </Text>

        <AppButton label="Enregistrer" onPress={handleSave} loading={saving} style={{ marginTop: spacing.lg }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  readonlyLabel: { ...typography.bodyStrong, color: colors.neutral[700], marginBottom: spacing.xs },
  readonlyValue: { ...typography.body, color: colors.neutral[500] },
  readonlyHint: { ...typography.caption, color: colors.neutral[400], marginTop: spacing.xs, marginBottom: spacing.lg },
});
