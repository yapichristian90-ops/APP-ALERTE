import React, { useMemo, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radius, spacing, typography } from "@/theme";

interface CommunePickerProps {
  value: string | null;
  onChange: (v: string) => void;
  options: readonly string[];
  error?: string;
}

export function CommunePicker({ value, onChange, options, error }: CommunePickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => options.filter((c) => c.toLowerCase().includes(search.toLowerCase())),
    [options, search],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Commune de résidence</Text>
      <Pressable style={[styles.field, Boolean(error) && styles.fieldError]} onPress={() => setOpen(true)}>
        <Text style={value ? styles.valueText : styles.placeholderText}>{value ?? "Choisir une commune"}</Text>
        <Text style={styles.chevron}>▾</Text>
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Choisissez votre commune</Text>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Rechercher..."
              placeholderTextColor={colors.neutral[400]}
              style={styles.search}
            />
            <FlatList
              data={filtered}
              keyExtractor={(item) => item}
              style={{ maxHeight: 360 }}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.option}
                  onPress={() => {
                    onChange(item);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  label: { ...typography.bodyStrong, color: colors.neutral[700], marginBottom: spacing.xs },
  field: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
    backgroundColor: colors.neutral[0],
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  fieldError: { borderColor: colors.violence[500] },
  valueText: { fontSize: 16, color: colors.neutral[800] },
  placeholderText: { fontSize: 16, color: colors.neutral[400] },
  chevron: { color: colors.neutral[400] },
  error: { ...typography.caption, color: colors.violence[500], marginTop: spacing.xs },
  overlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: "flex-end" },
  sheet: { backgroundColor: colors.neutral[0], borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.xl, maxHeight: "75%" },
  sheetTitle: { ...typography.h3, color: colors.neutral[800], marginBottom: spacing.md },
  search: {
    borderWidth: 1.5,
    borderColor: colors.neutral[200],
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
    fontSize: 15,
  },
  option: { paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.neutral[100] },
  optionText: { ...typography.body, color: colors.neutral[800] },
});
