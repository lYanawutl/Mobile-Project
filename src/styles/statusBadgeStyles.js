import { StyleSheet } from "react-native";
import { colors, font, radius, space } from "./theme";

export const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
    borderRadius: radius.pill,
  },
  badgeSmall: { paddingHorizontal: space.sm, paddingVertical: 2 },
  text: { fontSize: font.small, fontWeight: "700" },
  textSmall: { fontSize: 12 },
  pending: { backgroundColor: colors.slateSoft },
  pendingText: { color: colors.inkSoft },
  cooking: { backgroundColor: colors.chiliSoft },
  cookingText: { color: colors.chili },
  ready: { backgroundColor: colors.jadeSoft },
  readyText: { color: colors.jade },
  served: { backgroundColor: colors.jade },
  servedText: { color: colors.surface },
  cancelled: { backgroundColor: colors.slateSoft },
  cancelledText: { color: colors.slate },
});
