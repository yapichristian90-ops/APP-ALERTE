import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Card } from "@/components/Card";
import { colors, spacing, typography } from "@/theme";
import { FAQ_ITEMS } from "@/constants/faq";

export default function FaqScreen() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Screen background={colors.neutral[50]}>
      <ScreenHeader title="Questions fréquentes" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        {FAQ_ITEMS.map((item, index) => {
          const open = openIndex === index;
          return (
            <Card key={item.question} style={styles.card} onTouchEnd={() => setOpenIndex(open ? null : index)}>
              <View style={styles.questionRow}>
                <Text style={styles.question}>{item.question}</Text>
                <Text style={styles.chevron}>{open ? "−" : "+"}</Text>
              </View>
              {open ? <Text style={styles.answer}>{item.answer}</Text> : null}
            </Card>
          );
        })}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  card: { marginBottom: spacing.md },
  questionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  question: { ...typography.bodyStrong, color: colors.neutral[800], flex: 1 },
  chevron: { ...typography.h3, color: colors.brand[500] },
  answer: { ...typography.body, color: colors.neutral[600], marginTop: spacing.md },
});
