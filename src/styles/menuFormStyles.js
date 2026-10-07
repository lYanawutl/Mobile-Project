import { StyleSheet } from "react-native";
import { colors, font, radius, space } from "./theme";

export const styles = StyleSheet.create({
  content: { padding: space.lg, gap: space.xl, paddingBottom: space.xl * 2 },
  field: { gap: space.xs },
  fixedName: {
    minHeight: 46,
    justifyContent: "center",
    paddingHorizontal: space.md,
    borderRadius: radius.sm,
    backgroundColor: colors.slateSoft,
  },
  fixedNameText: { color: colors.ink, fontSize: font.body },
  help: { color: colors.inkSoft, fontSize: font.small },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: space.sm },
  error: { color: colors.chili, fontSize: font.small, fontWeight: "600" },
});
