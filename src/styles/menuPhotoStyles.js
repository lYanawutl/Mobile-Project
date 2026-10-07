import { StyleSheet } from "react-native";
import { colors } from "./theme";

export const styles = StyleSheet.create({
  frame: { overflow: "hidden" },
  fill: { width: "100%", height: "100%" },
  placeholder: {
    backgroundColor: colors.slateSoft,
    alignItems: "center",
    justifyContent: "center",
  },
});
