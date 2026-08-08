/**
 * Depuis 2021 la Côte d'Ivoire est passée à la numérotation à 10 chiffres :
 * 01 (Moov), 05 (MTN), 07 (Orange), et les blocs 08/09 ouverts pour la
 * croissance du parc mobile. On valide le format local (0XXXXXXXXX) et on
 * normalise vers +225XXXXXXXXXX pour tout échange avec le serveur.
 */
const MOBILE_PREFIXES = ["01", "05", "07", "08", "09"];

export function isValidIvorianPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, "");
  const local = digits.startsWith("225") ? digits.slice(3) : digits;
  if (local.length !== 10 || !local.startsWith("0")) return false;
  return MOBILE_PREFIXES.includes(local.slice(0, 2));
}

export function normalizeIvorianPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  const local = digits.startsWith("225") ? digits.slice(3) : digits;
  return `+225${local}`;
}

export function formatIvorianPhoneForDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  const local = digits.startsWith("225") ? digits.slice(3) : digits;
  return local.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
}

export function operatorFromPhone(raw: string): "Moov Money" | "MTN Money" | "Orange Money" | "Wave" | null {
  const digits = raw.replace(/\D/g, "");
  const local = digits.startsWith("225") ? digits.slice(3) : digits;
  const prefix = local.slice(0, 2);
  if (prefix === "01") return "Moov Money";
  if (prefix === "05") return "MTN Money";
  if (prefix === "07") return "Orange Money";
  return null;
}
