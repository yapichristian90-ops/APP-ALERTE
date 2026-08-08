import * as Location from "expo-location";

export async function requestLocationPermission(background = false): Promise<boolean> {
  const fg = await Location.requestForegroundPermissionsAsync();
  if (fg.status !== "granted") return false;
  if (background) {
    const bg = await Location.requestBackgroundPermissionsAsync();
    return bg.status === "granted";
  }
  return true;
}

export async function getCurrentLocation(): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const granted = await requestLocationPermission(false);
    if (!granted) return null;
    const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    return { latitude: position.coords.latitude, longitude: position.coords.longitude };
  } catch {
    return null;
  }
}

export type LocationUnsubscribe = () => void;

/** Suit la position en continu (utilisé par Alerte Enlèvement quand actif). */
export async function watchLocation(
  onUpdate: (coords: { latitude: number; longitude: number }) => void,
): Promise<LocationUnsubscribe> {
  const granted = await requestLocationPermission(true);
  if (!granted) return () => {};

  const subscription = await Location.watchPositionAsync(
    { accuracy: Location.Accuracy.High, timeInterval: 15000, distanceInterval: 25 },
    (position) => onUpdate({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
  );

  return () => subscription.remove();
}
