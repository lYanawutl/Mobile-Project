import { StyleSheet } from "react-native";
import { colors, font, space } from "./theme";

const DOT = 24;

export const styles = StyleSheet.create({
  wrap: { paddingVertical: space.md },
  line: {
    position: "absolute",
    top: space.md + DOT / 2 - 1,
    left: "12.5%",
    right: "12.5%",
    height: 2,
    backgroundColor: colors.line,
  },
  row: { flexDirection: "row" },
  step: { flex: 1, alignItems: "center", gap: space.xs },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
    borderWidth: 2,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  dotDone: { backgroundColor: colors.jade, borderColor: colors.jade },
  dotCurrent: { backgroundColor: colors.chili, borderColor: colors.chili },
  dotCenter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surface,
  },
  label: { color: colors.inkSoft, fontSize: font.small, textAlign: "center" },
  labelCurrent: { color: colors.ink, fontWeight: "800" },
  time: { color: colors.slate, fontSize: 12 },
});
