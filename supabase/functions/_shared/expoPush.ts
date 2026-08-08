// Envoi de notifications push via l'API Expo, utilisées pour réveiller
// l'écran d'alerte plein écran + la sirène chez les contacts, même si leur
// téléphone est verrouillé ou l'app en arrière-plan.
interface ExpoPushMessage {
  to: string;
  title: string;
  body: string;
  sound?: string;
  priority?: "default" | "normal" | "high";
  channelId?: string;
  data?: Record<string, unknown>;
}

export async function sendExpoPush(messages: ExpoPushMessage[]) {
  if (messages.length === 0) return;
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      messages.map((m) => ({
        to: m.to,
        title: m.title,
        body: m.body,
        sound: m.sound ?? "sirene.wav",
        priority: m.priority ?? "high",
        channelId: m.channelId ?? "alertes-urgence",
        data: m.data ?? {},
      })),
    ),
  });
}
