import { StyleSheet } from "react-native";
import { colors, font, radius, space } from "./theme";

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    padding: space.xl,
  },
  panel: {
    backgroundColor: colors.paper,
    borderRadius: radius.md,
    padding: space.xl,
    gap: space.lg,
  },
  title: { color: colors.ink, fontSize: font.title, fontWeight: "800" },
  itemName: { color: colors.inkSoft, fontSize: font.body },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: space.sm },
  actions: { flexDirection: "row", gap: space.md },
  action: { flex: 1 },
});
