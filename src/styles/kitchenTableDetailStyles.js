import { StyleSheet } from "react-native";
import { colors, font, radius, space } from "./theme";

export const styles = StyleSheet.create({
  panel: { flex: 1 },
  content: { padding: space.lg, gap: space.lg },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: { color: colors.ink, fontSize: font.heading, fontWeight: "800" },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
    marginTop: space.xs,
  },
  meta: { color: colors.inkSoft, fontSize: font.small, marginRight: space.sm },

  itemsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: font.body,
    fontWeight: "800",
    padding: space.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  rowPhoto: { width: 64, height: 64, borderRadius: radius.sm },
  rowBody: { flex: 1, gap: 2 },
  rowName: { color: colors.ink, fontSize: font.body, fontWeight: "700" },
  rowMeta: { color: colors.inkSoft, fontSize: font.small },
  rowNote: { color: colors.chili, fontSize: font.small, fontWeight: "600" },
  rowSide: { alignItems: "flex-end", gap: space.sm },
  rowPrice: { color: colors.ink, fontSize: font.body, fontWeight: "700" },
  rowAction: {
    borderWidth: 1.5,
    borderColor: colors.ink,
    borderRadius: radius.sm,
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
  },
  rowActionText: { color: colors.ink, fontSize: font.small, fontWeight: "700" },
  menuButton: { width: 28, alignItems: "center", paddingVertical: space.sm },

  footer: { padding: space.lg, borderTopWidth: 1, borderTopColor: colors.line },
  primaryContent: { flexDirection: "row", alignItems: "center", gap: space.sm },
});
