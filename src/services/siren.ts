import { Audio } from "expo-av";

let sirenSound: Audio.Sound | null = null;

/** Joue la sirène d'urgence en boucle, forte, jusqu'à arrêt explicite. */
export async function playSirenLoop() {
  await stopSiren();
  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    staysActiveInBackground: true,
    shouldDuckAndroid: false,
  });
  const { sound } = await Audio.Sound.createAsync(
    require("../../assets/audio/sirene.wav"),
    { isLooping: true, volume: 1.0, shouldPlay: true },
  );
  sirenSound = sound;
  await sound.playAsync();
}

export async function stopSiren() {
  if (sirenSound) {
    await sirenSound.stopAsync().catch(() => {});
    await sirenSound.unloadAsync().catch(() => {});
    sirenSound = null;
  }
}
