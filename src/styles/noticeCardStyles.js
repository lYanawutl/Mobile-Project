import { StyleSheet } from "react-native";
import { colors, font, radius, space } from "./theme";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.saffronSoft,
    borderRadius: radius.md,
    padding: space.lg,
    gap: space.xs,
  },
  title: { color: colors.saffron, fontSize: font.body, fontWeight: "800" },
  line: { color: colors.ink, fontSize: font.body },
  note: { color: colors.inkSoft, fontSize: font.small },
  action: { alignSelf: "flex-end", paddingVertical: space.xs },
  actionText: { color: colors.saffron, fontSize: font.body, fontWeight: "800" },
});
