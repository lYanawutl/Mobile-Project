import { StyleSheet } from "react-native";
import { colors, font, space } from "./theme";

export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: space.xl,
    paddingTop: space.lg,
  },
  brand: { flexDirection: "row", alignItems: "center", gap: space.md },
  title: { color: colors.ink, fontSize: font.heading, fontWeight: "800" },
  subtitle: { color: colors.inkSoft, fontSize: font.small },
  bell: { padding: space.sm },
  bellBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: colors.chili,
    alignItems: "center",
    justifyContent: "center",
  },
  bellBadgeText: { color: colors.surface, fontSize: 11, fontWeight: "800" },
});
