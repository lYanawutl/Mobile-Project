import { StyleSheet } from "react-native";
import { colors, font, space } from "./theme";

export const styles = StyleSheet.create({
  list: { padding: space.lg, paddingBottom: space.xl * 2 },
  summary: { gap: space.xs, marginBottom: space.md },
  tableTitle: { color: colors.ink, fontSize: font.heading, fontWeight: "800" },
  meta: { color: colors.inkSoft, fontSize: font.small },

  noticeSpacing: { marginBottom: space.md },

  roundHeader: {
    color: colors.inkSoft,
    fontSize: font.small,
    fontWeight: "700",
    paddingTop: space.lg,
    paddingBottom: space.sm,
    backgroundColor: colors.paper,
  },

  totalCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginTop: space.lg,
    paddingTop: space.lg,
    borderTopWidth: 2,
    borderTopColor: colors.ink,
  },
  totalLabel: { color: colors.ink, fontSize: font.title, fontWeight: "700" },
  totalValue: { color: colors.ink, fontSize: font.display, fontWeight: "800" },
  actions: { flexDirection: "row", gap: space.md, marginTop: space.xl },
  action: { flex: 1 },
});
