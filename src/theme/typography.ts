import { Platform } from "react-native";

const fontFamily = Platform.select({
  ios: "System",
  android: "sans-serif",
  default: "System",
});

export const typography = {
  fontFamily,
  display: { fontSize: 32, lineHeight: 38, fontWeight: "800" as const },
  h1: { fontSize: 26, lineHeight: 32, fontWeight: "800" as const },
  h2: { fontSize: 21, lineHeight: 27, fontWeight: "700" as const },
  h3: { fontSize: 17, lineHeight: 23, fontWeight: "700" as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: "400" as const },
  bodyStrong: { fontSize: 15, lineHeight: 22, fontWeight: "600" as const },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: "500" as const },
  tiny: { fontSize: 11, lineHeight: 15, fontWeight: "600" as const },
  button: { fontSize: 16, lineHeight: 20, fontWeight: "700" as const },
};
