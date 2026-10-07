import { StyleSheet } from "react-native";
import { colors, font, radius, space } from "./theme";

export const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: space.lg, gap: space.md },
  line: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.md,
    gap: space.xs,
  },
  lineTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: space.md,
  },
  name: { flex: 1, color: colors.ink, fontSize: font.body, fontWeight: "700" },
  lineTotal: { color: colors.ink, fontSize: font.body, fontWeight: "700" },
  detail: { color: colors.inkSoft, fontSize: font.small },
  soldOut: { color: colors.chili, fontSize: font.small, fontWeight: "700" },
  lineBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: space.xs,
  },
  removeText: { color: colors.chili, fontSize: font.body, fontWeight: "600" },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.surface,
    padding: space.lg,
    gap: space.md,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  totalLabel: { color: colors.inkSoft, fontSize: font.body },
  totalValue: { color: colors.ink, fontSize: font.heading, fontWeight: "800" },
  warning: { color: colors.chili, fontSize: font.small, fontWeight: "600" },
});
