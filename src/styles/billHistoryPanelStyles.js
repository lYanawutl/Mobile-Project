import { StyleSheet } from "react-native";
import { colors, font, radius, space } from "./theme";

export const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: space.lg, gap: space.sm },
  notice: {
    backgroundColor: colors.saffronSoft,
    borderRadius: radius.md,
    padding: space.md,
  },
  noticeText: { color: colors.saffron, fontSize: font.small, fontWeight: "800" },
  roundHeader: {
    color: colors.inkSoft,
    fontSize: font.small,
    fontWeight: "700",
    marginTop: space.sm,
  },
  row: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.md,
    gap: space.xs,
  },
  rowTop: { flexDirection: "row", justifyContent: "space-between", gap: space.sm },
  name: { flex: 1, color: colors.ink, fontSize: font.body, fontWeight: "700" },
  amount: { color: colors.ink, fontSize: font.body, fontWeight: "700" },
  struck: { textDecorationLine: "line-through", color: colors.slate },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.surface,
    padding: space.lg,
    gap: space.md,
  },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  totalLabel: { color: colors.inkSoft, fontSize: font.body },
  totalValue: { color: colors.ink, fontSize: font.heading, fontWeight: "800" },
});
