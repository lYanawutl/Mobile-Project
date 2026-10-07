import { StyleSheet } from "react-native";
import { colors, font, radius, space } from "./theme";

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.paper,
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
    maxHeight: "85%",
  },
  sheetContent: { padding: space.xl, gap: space.lg },
  photo: { width: "100%", height: 160, borderRadius: radius.md },
  title: { color: colors.ink, fontSize: font.heading, fontWeight: "800" },
  price: { color: colors.chili, fontSize: font.title, fontWeight: "700" },
  sectionLabel: {
    color: colors.inkSoft,
    fontSize: font.small,
    fontWeight: "600",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    minHeight: 44,
  },
  optionName: { flex: 1, color: colors.ink, fontSize: font.body },
  optionPrice: { color: colors.inkSoft, fontSize: font.body },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.lg,
  },
  addButton: { flex: 1 },
});
