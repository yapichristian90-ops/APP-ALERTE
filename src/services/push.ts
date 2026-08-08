import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { supabase } from "./supabase";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotifications() {
  const { status: existing } = await Notifications.getPermissionsAsync();
  let status = existing;
  if (existing !== "granted") {
    const req = await Notifications.requestPermissionsAsync();
    status = req.status;
  }
  if (status !== "granted") return null;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("alertes-urgence", {
      name: "Alertes d'urgence",
      importance: Notifications.AndroidImportance.MAX,
      sound: "sirene.wav",
      vibrationPattern: [0, 500, 250, 500],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;

  const { data: session } = await supabase.auth.getSession();
  const uid = session.session?.user.id;
  if (uid) {
    await supabase.from("push_tokens").upsert({ user_id: uid, expo_push_token: token, updated_at: new Date().toISOString() });
  }
  return token;
}
