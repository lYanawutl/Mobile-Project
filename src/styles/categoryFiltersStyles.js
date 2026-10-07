import { StyleSheet } from "react-native";
import { colors, space } from "./theme";

export const styles = StyleSheet.create({
  row: { gap: space.sm, paddingRight: space.lg },
  column: { gap: space.md, padding: space.lg },
  chipVertical: { alignItems: "center", paddingVertical: space.md },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: space.xs },
});
