import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ContactSlotEditor } from "@/components/ContactSlotEditor";
import { colors, spacing } from "@/theme";
import { useAuthStore } from "@/store/authStore";
import { saveTrustedNumber, removeTrustedNumber } from "@/services/contacts";

export default function TrustedNumbersScreen() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const refreshProfile = useAuthStore((s) => s.refreshProfile);

  const values = [1, 2, 3].map((slot) => {
    const trusted = profile?.trustedNumbers[slot - 1];
    return trusted ? { fullName: trusted.fullName, phone: trusted.phone } : null;
  });

  return (
    <Screen background={colors.kidnap[100]}>
      <ScreenHeader title="Numéros de confiance" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <ContactSlotEditor
          title="Numéro de confiance"
          description="Seules ces 3 personnes peuvent retrouver votre position en cas d'enlèvement. Toute autre recherche est refusée."
          accentColor={colors.kidnap[500]}
          values={values}
          onSave={async (slot, value) => {
            await saveTrustedNumber(slot, value.fullName, value.phone);
            await refreshProfile();
          }}
          onRemove={async (slot) => {
            await removeTrustedNumber(slot);
            await refreshProfile();
          }}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
});
