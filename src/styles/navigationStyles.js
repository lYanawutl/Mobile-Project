import { StyleSheet } from "react-native";
import { colors, font, space } from "./theme";

// สไตล์ของแถบหัวและแถบแท็บของ React Navigation
export const styles = StyleSheet.create({
  header: { backgroundColor: colors.paper },
  headerTitle: { color: colors.ink, fontSize: font.title, fontWeight: "800" },
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.line,
    paddingTop: space.xs,
  },
  tabLabel: { fontSize: font.small, fontWeight: "700" },
  tabBadge: { backgroundColor: colors.chili, color: colors.surface },
});
