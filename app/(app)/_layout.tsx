import React, { useEffect, useRef } from "react";
import { Redirect, Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/authStore";
import { subscribeToRelevantAlerts } from "@/services/violence";
import { registerForPushNotifications } from "@/services/push";
import { colors } from "@/theme";

export default function AppTabsLayout() {
  const { isLoading, isAuthenticated, profile } = useAuthStore();
  const router = useRouter();
  const myPhone = useRef(profile?.phone);
  myPhone.current = profile?.phone;

  useEffect(() => {
    if (!isAuthenticated) return;
    registerForPushNotifications().catch(() => {});
    const unsubscribe = subscribeToRelevantAlerts((alert) => {
      if (alert.status !== "active") return;
      if (alert.victimPhone === myPhone.current) return; // ma propre alerte : rien chez moi
      router.push(`/alerte-recue/${alert.id}`);
    });
    return unsubscribe;
  }, [isAuthenticated]);

  if (isLoading) return null;
  if (!isAuthenticated) return <Redirect href="/(auth)/welcome" />;
  if (!profile?.acceptedTermsAt) return <Redirect href="/(auth)/legal" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brand[600],
        tabBarInactiveTintColor: colors.neutral[400],
        tabBarStyle: { height: 64, paddingBottom: 10, paddingTop: 6 },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color, size }) => <Ionicons name="shield-checkmark" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => <Ionicons name="person-circle" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
