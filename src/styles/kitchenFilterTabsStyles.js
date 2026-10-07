import { StyleSheet } from "react-native";
import { colors, font, radius, space } from "./theme";

export const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: space.md,
    paddingHorizontal: space.xl,
    paddingVertical: space.md,
  },
  tab: {
    flex: 1,
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  tabActive: { backgroundColor: colors.jade, borderColor: colors.jade },
  label: { color: colors.ink, fontSize: font.body, fontWeight: "700" },
  labelActive: { color: colors.surface },
  count: {
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    paddingHorizontal: space.xs,
    backgroundColor: colors.slateSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  countActive: { backgroundColor: colors.surface },
  countText: { color: colors.ink, fontSize: font.small, fontWeight: "800" },
});
