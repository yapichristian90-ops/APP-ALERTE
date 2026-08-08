import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="register" />
      <Stack.Screen name="login" />
      <Stack.Screen name="legal" />
      <Stack.Screen name="plan" />
      <Stack.Screen name="payment" />
    </Stack>
  );
}
