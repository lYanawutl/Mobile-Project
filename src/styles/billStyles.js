import { StyleSheet } from "react-native";
import { colors, font, radius, space } from "./theme";

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
  line: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.lg,
    gap: space.xs,
    marginBottom: space.sm,
  },
  lineTop: { flexDirection: "row", justifyContent: "space-between", gap: space.md },
  name: { flex: 1, color: colors.ink, fontSize: font.title, fontWeight: "700" },
  lineTotal: { color: colors.ink, fontSize: font.title, fontWeight: "700" },
  struck: { textDecorationLine: "line-through", color: colors.slate },
  detail: { color: colors.inkSoft, fontSize: font.small },
  cancelInfo: { color: colors.slate, fontSize: font.small },
  lineBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: space.sm,
  },
  cancelText: { color: colors.chili, fontSize: font.body, fontWeight: "600" },

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
