import { StyleSheet } from "react-native";
import { colors, font, radius, space } from "./theme";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
  },
  cardSoldOut: { opacity: 0.55 },
  photo: { width: "100%", aspectRatio: 4 / 3 },
  body: { padding: space.md, gap: space.xs },
  name: { color: colors.ink, fontSize: font.body, fontWeight: "700", minHeight: 40 },
  price: { color: colors.chili, fontSize: font.title, fontWeight: "800" },
  soldOut: { color: colors.slate, fontSize: font.small, fontWeight: "600" },
});
