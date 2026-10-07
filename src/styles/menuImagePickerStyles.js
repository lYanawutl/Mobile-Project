import { StyleSheet } from "react-native";
import { colors, font, radius, space } from "./theme";

const THUMB = 88;

export const styles = StyleSheet.create({
  row: { gap: space.sm, paddingVertical: space.xs },
  option: {
    width: THUMB,
    alignItems: "center",
    gap: space.xs,
    padding: space.xs,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionActive: { borderColor: colors.jade, backgroundColor: colors.jadeSoft },
  thumb: { width: THUMB - 16, height: THUMB - 16, borderRadius: radius.sm },
  name: { color: colors.inkSoft, fontSize: 11, textAlign: "center" },
  empty: { color: colors.inkSoft, fontSize: font.small },
});
