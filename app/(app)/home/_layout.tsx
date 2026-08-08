import { Stack } from "expo-router";

export default function HomeStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="violence/index" />
      <Stack.Screen name="violence/contacts" />
      <Stack.Screen name="kidnap/index" />
      <Stack.Screen name="kidnap/search" />
      <Stack.Screen name="kidnap/map" />
      <Stack.Screen name="kidnap/trusted" />
    </Stack>
  );
}
