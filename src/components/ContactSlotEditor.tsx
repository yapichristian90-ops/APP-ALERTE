import React, { useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Card } from "./Card";
import { AppButton } from "./AppButton";
import { AppTextInput } from "./AppTextInput";
import { PhoneInput } from "./PhoneInput";
import { colors, radius, spacing, typography } from "@/theme";
import { isValidIvorianPhone } from "@/constants/phone";

export interface ContactSlotValue {
  fullName: string;
  phone: string;
}

interface ContactSlotEditorProps {
  title: string;
  description: string;
  accentColor: string;
  values: (ContactSlotValue | null)[]; // longueur 3
  onSave: (slot: 1 | 2 | 3, value: ContactSlotValue) => Promise<void>;
  onRemove: (slot: 1 | 2 | 3) => Promise<void>;
}

export function ContactSlotEditor({ title, description, accentColor, values, onSave, onRemove }: ContactSlotEditorProps) {
  const [editingSlot, setEditingSlot] = useState<1 | 2 | 3 | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  function openEditor(slot: 1 | 2 | 3) {
    const existing = values[slot - 1];
    setFullName(existing?.fullName ?? "");
    setPhone(existing?.phone.replace("+225", "") ?? "");
    setEditingSlot(slot);
  }

  async function handleSave() {
    if (!editingSlot) return;
    if (fullName.trim().length < 2) {
      Alert.alert("Nom requis", "Indiquez le nom complet de ce contact.");
      return;
    }
    if (!isValidIvorianPhone(phone)) {
      Alert.alert("Numéro invalide", "Entrez un numéro ivoirien valide à 10 chiffres.");
      return;
    }
    setSaving(true);
    try {
      await onSave(editingSlot, { fullName, phone });
      setEditingSlot(null);
    } catch (e: any) {
      Alert.alert("Erreur", e.message ?? "Impossible d'enregistrer ce contact.");
    } finally {
      setSaving(false);
    }
  }

  function handleRemove(slot: 1 | 2 | 3) {
    Alert.alert("Retirer ce contact ?", "Il ne recevra plus vos alertes.", [
      { text: "Annuler", style: "cancel" },
      { text: "Retirer", style: "destructive", onPress: () => onRemove(slot) },
    ]);
  }

  return (
    <View>
      <Text style={styles.description}>{description}</Text>
      {[1, 2, 3].map((slotNumber) => {
        const slot = slotNumber as 1 | 2 | 3;
        const value = values[slot - 1];
        return (
          <Card key={slot} style={styles.slotCard}>
            <View style={[styles.slotBadge, { backgroundColor: accentColor }]}>
              <Text style={styles.slotBadgeText}>{slot}</Text>
            </View>
            <View style={{ flex: 1 }}>
              {value ? (
                <>
                  <Text style={styles.contactName}>{value.fullName}</Text>
                  <Text style={styles.contactPhone}>+225 {value.phone.replace("+225", "")}</Text>
                </>
              ) : (
                <Text style={styles.emptySlot}>Emplacement libre</Text>
              )}
            </View>
            <View style={styles.actions}>
              <Pressable onPress={() => openEditor(slot)} style={styles.actionButton}>
                <Text style={[styles.actionText, { color: accentColor }]}>{value ? "Modifier" : "Ajouter"}</Text>
              </Pressable>
              {value ? (
                <Pressable onPress={() => handleRemove(slot)} style={styles.actionButton}>
                  <Text style={styles.removeText}>Retirer</Text>
                </Pressable>
              ) : null}
            </View>
          </Card>
        );
      })}

      <Modal visible={editingSlot !== null} animationType="slide" transparent onRequestClose={() => setEditingSlot(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{title} — emplacement {editingSlot}</Text>
            <AppTextInput label="Nom complet" value={fullName} onChangeText={setFullName} placeholder="Ex : Awa Koné" />
            <PhoneInput value={phone} onChangeText={setPhone} />
            <AppButton label="Enregistrer" onPress={handleSave} loading={saving} />
            <AppButton label="Annuler" variant="ghost" onPress={() => setEditingSlot(null)} style={{ marginTop: spacing.sm }} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  description: { ...typography.body, color: colors.neutral[600], marginBottom: spacing.lg },
  slotCard: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.md },
  slotBadge: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  slotBadgeText: { color: colors.neutral[0], fontWeight: "800" },
  contactName: { ...typography.bodyStrong, color: colors.neutral[800] },
  contactPhone: { ...typography.caption, color: colors.neutral[500], marginTop: 2 },
  emptySlot: { ...typography.body, color: colors.neutral[400], fontStyle: "italic" },
  actions: { alignItems: "flex-end", gap: 4 },
  actionButton: { paddingVertical: 4, paddingHorizontal: 6 },
  actionText: { ...typography.caption, fontWeight: "700" },
  removeText: { ...typography.tiny, color: colors.violence[500] },
  modalOverlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: "flex-end" },
  modalCard: { backgroundColor: colors.neutral[0], borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.xl },
  modalTitle: { ...typography.h3, color: colors.neutral[800], marginBottom: spacing.lg },
});
