// Miroir de src/constants/phone.ts côté serveur (Deno n'importe pas
// directement le code React Native de l'app).
export function normalizeIvorianPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  const local = digits.startsWith("225") ? digits.slice(3) : digits;
  return `+225${local}`;
}
