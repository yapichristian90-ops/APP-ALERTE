import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { AdminShell } from "@/components/AdminShell";
import { Card } from "@/components/Card";
import { AppButton } from "@/components/AppButton";
import { PhoneInput } from "@/components/PhoneInput";
import { colors, radius, spacing, typography } from "@/theme";
import {
  fetchEditors,
  findUserByPhone,
  inviteEditor,
  setEditorStatus,
  updateEditorPermissions,
} from "@/services/admin";
import type { AdminUser, EditorPermission } from "@/types";

const ALL_PERMISSIONS: { id: EditorPermission; label: string }[] = [
  { id: "gerer_inscriptions", label: "Gérer les inscriptions" },
  { id: "gerer_forfaits", label: "Gérer les forfaits" },
  { id: "gerer_paiements", label: "Gérer les paiements" },
  { id: "gerer_editeurs", label: "Gérer les éditeurs" },
];

export default function AdminEditorsScreen() {
  const [editors, setEditors] = useState<AdminUser[]>([]);
  const [phone, setPhone] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<EditorPermission[]>([]);
  const [inviting, setInviting] = useState(false);

  function reload() {
    fetchEditors().then(setEditors).catch(() => {});
  }

  useEffect(reload, []);

  function togglePermission(p: EditorPermission) {
    setSelectedPermissions((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  }

  async function handleInvite() {
    setInviting(true);
    try {
      const user = await findUserByPhone(phone);
      if (!user) {
        Alert.alert(
          "Compte introuvable",
          "Cette personne doit d'abord créer un compte utilisateur standard dans l'application avant de pouvoir être invitée comme éditeur.",
        );
        return;
      }
      await inviteEditor(user.id, `${user.first_name} ${user.last_name}`.trim(), user.phone, selectedPermissions);
      Alert.alert("Invitation envoyée", "L'éditeur doit être validé (statut « actif ») avant de pouvoir se connecter au tableau de bord.");
      setPhone("");
      setSelectedPermissions([]);
      reload();
    } catch (e: any) {
      Alert.alert("Erreur", e.message ?? "Invitation impossible.");
    } finally {
      setInviting(false);
    }
  }

  async function handleValidate(editor: AdminUser) {
    await setEditorStatus(editor.id, editor.status === "actif" ? "suspendu" : "actif");
    reload();
  }

  return (
    <AdminShell active="editors" title="Éditeurs" requirePrincipal>
      <ScrollView contentContainerStyle={styles.content}>
        <Card>
          <Text style={styles.sectionTitle}>Inviter un éditeur</Text>
          <Text style={styles.sectionDescription}>
            La personne doit déjà avoir un compte utilisateur standard (créé depuis l'application). Recherchez-la par
            son numéro puis attribuez-lui des permissions.
          </Text>
          <PhoneInput value={phone} onChangeText={setPhone} label="Numéro de la personne à inviter" />

          <Text style={styles.permTitle}>Permissions</Text>
          {ALL_PERMISSIONS.map((perm) => (
            <View key={perm.id} style={styles.permRow} onTouchEnd={() => togglePermission(perm.id)}>
              <View style={[styles.checkbox, selectedPermissions.includes(perm.id) && styles.checkboxChecked]} />
              <Text style={styles.permLabel}>{perm.label}</Text>
            </View>
          ))}

          <AppButton label="Envoyer l'invitation" onPress={handleInvite} loading={inviting} style={{ marginTop: spacing.lg }} />
        </Card>

        <Text style={styles.listTitle}>Équipe éditoriale</Text>
        {editors.map((editor) => (
          <Card key={editor.id} style={styles.editorRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.editorName}>{editor.fullName}</Text>
              <Text style={styles.editorDetail}>+225 {editor.phone.replace("+225", "")}</Text>
              <Text style={styles.editorDetail}>{editor.permissions.length} permission(s)</Text>
            </View>
            <View style={styles.editorActions}>
              <View style={[styles.statusBadge, statusColor(editor.status)]}>
                <Text style={styles.statusText}>{statusLabel(editor.status)}</Text>
              </View>
              <Text style={styles.toggleAction} onPress={() => handleValidate(editor)}>
                {editor.status === "actif" ? "Suspendre" : "Activer"}
              </Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </AdminShell>
  );
}

function statusLabel(status: string) {
  if (status === "actif") return "Actif";
  if (status === "suspendu") return "Suspendu";
  return "En attente";
}
function statusColor(status: string) {
  if (status === "actif") return { backgroundColor: colors.success };
  if (status === "suspendu") return { backgroundColor: colors.violence[500] };
  return { backgroundColor: colors.warning };
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  sectionTitle: { ...typography.h3, color: colors.neutral[800] },
  sectionDescription: { ...typography.caption, color: colors.neutral[500], marginTop: 4, marginBottom: spacing.md },
  permTitle: { ...typography.bodyStrong, color: colors.neutral[700], marginTop: spacing.sm, marginBottom: spacing.sm },
  permRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.sm },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 1.5, borderColor: colors.neutral[300] },
  checkboxChecked: { backgroundColor: colors.brand[500], borderColor: colors.brand[500] },
  permLabel: { ...typography.body, color: colors.neutral[700] },
  listTitle: { ...typography.h3, color: colors.neutral[800], marginTop: spacing.xl, marginBottom: spacing.md },
  editorRow: { flexDirection: "row", alignItems: "center", marginBottom: spacing.md },
  editorName: { ...typography.bodyStrong, color: colors.neutral[800] },
  editorDetail: { ...typography.caption, color: colors.neutral[500], marginTop: 2 },
  editorActions: { alignItems: "flex-end", gap: spacing.xs },
  statusBadge: { paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.pill },
  statusText: { ...typography.tiny, color: colors.neutral[0] },
  toggleAction: { ...typography.caption, color: colors.brand[600], fontWeight: "700" },
});
