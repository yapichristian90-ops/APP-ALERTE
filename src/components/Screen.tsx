import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import { colors } from "@/theme";

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: Edge[];
  background?: string;
}

export function Screen({ children, style, edges = ["top", "bottom"], background = colors.brand[50] }: ScreenProps) {
  return (
    <SafeAreaView edges={edges} style={[styles.container, { backgroundColor: background }, style]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
