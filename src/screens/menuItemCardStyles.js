import { StyleSheet } from "react-native";
import { colors, font, radius, space } from "./theme";

export const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.md,
  },
  cardSoldOut: { opacity: 0.55 },
  photo: { width: 72, height: 72, borderRadius: radius.sm },
  body: { flex: 1, gap: space.xs },
  name: { color: colors.ink, fontSize: font.title, fontWeight: "700" },
  price: { color: colors.chili, fontSize: font.body, fontWeight: "700" },
  soldOut: { color: colors.slate, fontSize: font.small, fontWeight: "600" },
});
