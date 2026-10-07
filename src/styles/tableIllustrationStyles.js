import { StyleSheet } from "react-native";
import { colors, font, space } from "./theme";

const TABLE = 68;

export const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
    height: 84,
  },
  chairs: { gap: space.md },
  chair: { width: 14, height: 22, borderRadius: 6, backgroundColor: colors.chair },
  chairBusy: { backgroundColor: colors.chairBusy },
  table: {
    width: TABLE,
    height: TABLE,
    borderRadius: TABLE / 2,
    borderWidth: 2,
    borderColor: colors.line,
    backgroundColor: colors.tableTop,
    alignItems: "center",
    justifyContent: "center",
  },
  tableBusy: { backgroundColor: colors.tableTopBusy, borderColor: colors.tableTopBusy },
  number: { color: colors.ink, fontSize: font.heading, fontWeight: "800" },
  numberBusy: { color: colors.surface },
});
