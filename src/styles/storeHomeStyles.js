import { StyleSheet } from "react-native";
import { colors, font, radius, space } from "./theme";

export const styles = StyleSheet.create({
  list: { padding: space.lg, gap: space.sm, paddingBottom: space.xl * 2 },
  tools: { gap: space.md, marginBottom: space.lg },
  sectionTitle: {
    color: colors.ink,
    fontSize: font.title,
    fontWeight: "800",
    marginTop: space.md,
    marginBottom: space.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.lg,
  },
  rowTitle: { color: colors.ink, fontSize: font.title, fontWeight: "700" },
  rowMeta: { color: colors.inkSoft, fontSize: font.small, marginTop: space.xs },
  rowTotal: { color: colors.ink, fontSize: font.title, fontWeight: "800" },
  resetText: { color: colors.chili },
});
