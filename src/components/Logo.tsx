import React from "react";
import { Image, StyleSheet, View, ViewStyle } from "react-native";

interface LogoProps {
  size?: number;
  style?: ViewStyle;
}

export function Logo({ size = 96, style }: LogoProps) {
  return (
    <View style={[styles.wrapper, { width: size, height: size }, style]}>
      <Image source={require("../../assets/icon.png")} style={{ width: size, height: size, borderRadius: size * 0.22 }} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", justifyContent: "center" },
});
