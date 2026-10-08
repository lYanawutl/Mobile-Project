import { StyleSheet } from "react-native";
import { colors, font, radius, space } from "./theme";

export const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: space.sm },
  button: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: { borderColor: colors.line },
  buttonText: { color: colors.ink, fontSize: font.title, fontWeight: "700" },
  buttonTextDisabled: { color: colors.slate },
  value: {
    minWidth: 32,
    textAlign: "center",
    color: colors.ink,
    fontSize: font.title,
    fontWeight: "700",
  },
});
