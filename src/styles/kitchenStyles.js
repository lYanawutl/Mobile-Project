import { StyleSheet } from "react-native";
import { colors, font, layout, radius, space } from "./theme";

export const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: "row",
    gap: space.lg,
    paddingHorizontal: space.xl,
  },
  list: { flex: 1 },
  listContent: { gap: space.md, paddingBottom: space.xl * 2 },

  detail: {
    width: layout.kitchenPanelWidth,
    marginBottom: space.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
  },
  detailEmpty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: space.xl,
  },

  modalScreen: { flex: 1, backgroundColor: colors.paper },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: space.lg,
    paddingTop: space.lg,
  },
  closeText: { color: colors.chili, fontSize: font.body, fontWeight: "700" },
});
