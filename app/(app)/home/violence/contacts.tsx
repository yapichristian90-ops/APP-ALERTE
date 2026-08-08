import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ContactSlotEditor } from "@/components/ContactSlotEditor";
import { colors, spacing } from "@/theme";
import { useAuthStore } from "@/store/authStore";
import { saveEmergencyContact, removeEmergencyContact } from "@/services/contacts";

export default function EmergencyContactsScreen() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const refreshProfile = useAuthStore((s) => s.refreshProfile);

  const values = [1, 2, 3].map((slot) => {
    const contact = profile?.emergencyContacts[slot - 1];
    return contact ? { fullName: contact.fullName, phone: contact.phone } : null;
  });

  return (
    <Screen background={colors.violence[100]}>
      <ScreenHeader title="Contacts d'urgence" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <ContactSlotEditor
          title="Contact d'urgence"
          description="Ces 3 personnes recevront une sirène et votre position dès qu'une Alerte Violence est déclenchée."
          accentColor={colors.violence[500]}
          values={values}
          onSave={async (slot, value) => {
            await saveEmergencyContact(slot, value.fullName, value.phone);
            await refreshProfile();
          }}
          onRemove={async (slot) => {
            await removeEmergencyContact(slot);
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
