import { StyleSheet } from "react-native";
import { colors, font, layout, radius, space } from "./theme";

export const styles = StyleSheet.create({
  panel: {
    width: layout.panelWidth,
    borderLeftWidth: 1,
    borderLeftColor: colors.line,
    backgroundColor: colors.paper,
  },
  tabs: {
    flexDirection: "row",
    gap: space.sm,
    padding: space.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  tab: {
    flex: 1,
    minHeight: 42,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: space.xs,
  },
  tabActive: { borderColor: colors.ink, backgroundColor: colors.ink },
  tabText: { color: colors.inkSoft, fontSize: font.body, fontWeight: "700" },
  tabTextActive: { color: colors.surface },
  tabDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.saffron,
  },
});
