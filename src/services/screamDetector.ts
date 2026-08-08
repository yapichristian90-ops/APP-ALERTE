import { Audio } from "expo-av";

/**
 * Détection d'un « cri discret » de détresse.
 *
 * Ceci N'EST PAS un modèle de reconnaissance vocale : c'est une heuristique
 * de niveau sonore, volontairement simple et qui tourne entièrement en local
 * sur l'appareil (aucun audio n'est jamais envoyé au serveur, voir la
 * Politique de Confidentialité). On surveille le niveau du microphone
 * (mesuré en dB par expo-av) et on compare chaque échantillon à une base de
 * bruit ambiant glissante : un pic soudain, bien au-dessus de cette base et
 * proche du niveau sonore maximal du micro, est interprété comme un cri.
 *
 * Un vrai modèle de classification audio (on-device, type TensorFlow Lite)
 * serait la suite logique pour réduire les faux positifs/négatifs — hors
 * périmètre de cette première version.
 */

const SAMPLE_INTERVAL_MS = 250;
const BASELINE_WINDOW = 12; // ~3 s de bruit ambiant
const SPIKE_ABOVE_BASELINE_DB = 18;
const ABSOLUTE_LOUD_THRESHOLD_DB = -18; // proche de 0 dBFS = très fort
const COOLDOWN_MS = 8000;

export type ScreamDetectorUnsubscribe = () => void;

export async function startScreamDetection(onDetected: () => void): Promise<ScreamDetectorUnsubscribe> {
  const permission = await Audio.requestPermissionsAsync();
  if (!permission.granted) return () => {};

  await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });

  const recording = new Audio.Recording();
  const baseline: number[] = [];
  let lastTrigger = 0;
  let stopped = false;

  await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.LOW_QUALITY);
  recording.setProgressUpdateInterval(SAMPLE_INTERVAL_MS);
  recording.setOnRecordingStatusUpdate((status) => {
    if (stopped || !status.isRecording || typeof status.metering !== "number") return;

    const level = status.metering; // en dBFS, généralement entre -160 (silence) et 0 (max)
    const avgBaseline = baseline.length ? baseline.reduce((a, b) => a + b, 0) / baseline.length : level;

    const isSpike = level > avgBaseline + SPIKE_ABOVE_BASELINE_DB && level > ABSOLUTE_LOUD_THRESHOLD_DB;

    if (isSpike) {
      const now = Date.now();
      if (now - lastTrigger > COOLDOWN_MS) {
        lastTrigger = now;
        onDetected();
      }
    } else {
      baseline.push(level);
      if (baseline.length > BASELINE_WINDOW) baseline.shift();
    }
  });

  await recording.startAsync();

  return async () => {
    stopped = true;
    try {
      await recording.stopAndUnloadAsync();
    } catch {
      // déjà arrêté
    }
  };
}
