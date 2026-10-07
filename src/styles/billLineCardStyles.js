import { StyleSheet } from "react-native";
import { colors, font, radius, space } from "./theme";

export const styles = StyleSheet.create({
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
});
