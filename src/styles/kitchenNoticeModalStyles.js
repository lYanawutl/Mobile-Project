import { StyleSheet } from "react-native";
import { colors, font, radius, space } from "./theme";

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: "center",
    justifyContent: "center",
    padding: space.xl,
  },
  panel: {
    width: "100%",
    maxWidth: 520,
    maxHeight: "85%",
    backgroundColor: colors.paper,
    borderRadius: radius.md,
    padding: space.xl,
    gap: space.lg,
  },
  title: { color: colors.ink, fontSize: font.title, fontWeight: "800" },
  list: { gap: space.md },
  empty: { color: colors.inkSoft, fontSize: font.body, textAlign: "center" },
});
