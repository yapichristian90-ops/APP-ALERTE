import { Stack } from "expo-router";

// Accès administrateur : jamais lié depuis la navigation de l'app
// utilisateur (aucun bouton, aucun menu n'y mène). Uniquement accessible en
// connaissant l'URL /admin/login, puis protégé par la vérification du rôle
// dans admin_roles (voir services/admin.ts + RLS côté Supabase).
export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="users" />
      <Stack.Screen name="payments" />
      <Stack.Screen name="editors" />
    </Stack>
  );
}
