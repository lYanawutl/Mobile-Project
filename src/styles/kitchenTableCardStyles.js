import { StyleSheet } from "react-native";
import { colors, font, radius, space } from "./theme";

export const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.lg,
  },
  cardSelected: { borderColor: colors.jade, borderWidth: 2 },

  left: { width: 96, gap: space.xs },
  tableChip: {
    alignSelf: "flex-start",
    backgroundColor: colors.ink,
    borderRadius: radius.sm,
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
  },
  tableChipText: {
    color: colors.surface,
    fontSize: font.body,
    fontWeight: "800",
  },
  meta: { color: colors.inkSoft, fontSize: font.small },
  metaRow: { flexDirection: "row", alignItems: "center", gap: space.xs },

  photo: { width: 72, height: 72, borderRadius: radius.md },

  items: { flex: 1, gap: space.xs },
  itemsTitle: { color: colors.ink, fontSize: font.small, fontWeight: "700" },
  itemRow: { flexDirection: "row", alignItems: "center", gap: space.sm },
  itemName: { color: colors.ink, fontSize: font.body },
  more: { color: colors.inkSoft, fontSize: font.small },

  right: { width: 150, gap: space.sm, alignItems: "flex-start" },
});
