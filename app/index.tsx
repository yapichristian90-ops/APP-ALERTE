import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect } from "expo-router";
import { Logo } from "@/components/Logo";
import { useAuthStore } from "@/store/authStore";
import { colors, typography } from "@/theme";

export default function SplashScreen() {
  const { isLoading, isAuthenticated, profile } = useAuthStore();
  const [minDurationElapsed, setMinDurationElapsed] = React.useState(false);
  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5 }),
      Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
    const t = setTimeout(() => setMinDurationElapsed(true), 1400);
    return () => clearTimeout(t);
  }, []);

  if (!isLoading && minDurationElapsed) {
    if (!isAuthenticated) return <Redirect href="/(auth)/welcome" />;
    if (!profile?.acceptedTermsAt) return <Redirect href="/(auth)/legal" />;
    return <Redirect href="/(app)/home" />;
  }

  return (
    <LinearGradient colors={[colors.brand[400], colors.brand[600], colors.brand[800]]} style={styles.container}>
      <Animated.View style={{ transform: [{ scale }], opacity }}>
        <View style={styles.logoWrapper}>
          <Logo size={128} />
        </View>
        <Text style={styles.title}>ALERTE</Text>
        <Text style={styles.subtitle}>Côte d'Ivoire</Text>
      </Animated.View>
      <Text style={styles.tagline}>Votre sécurité, à portée de main</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  logoWrapper: { alignItems: "center", marginBottom: 20 },
  title: { ...typography.display, color: colors.neutral[0], textAlign: "center", letterSpacing: 2 },
  subtitle: { ...typography.h2, color: "rgba(255,255,255,0.9)", textAlign: "center" },
  tagline: { position: "absolute", bottom: 56, ...typography.caption, color: "rgba(255,255,255,0.8)" },
});
