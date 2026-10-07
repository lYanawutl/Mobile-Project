import { StyleSheet } from "react-native";
import { colors, font, layout, radius, space } from "./theme";

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

  body: { flex: 1, flexDirection: "row", gap: space.lg, paddingHorizontal: space.xl },
  list: { flex: 1 },
  listContent: { gap: space.md, paddingBottom: space.xl * 2 },

  // แผงรายละเอียดด้านขวา (จอกว้าง)
  detail: {
    width: layout.kitchenPanelWidth,
    marginBottom: space.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
  },
  detailEmpty: { flex: 1, alignItems: "center", justifyContent: "center", padding: space.xl },

  // รายละเอียดแบบเต็มจอ (จอแคบ)
  modalScreen: { flex: 1, backgroundColor: colors.paper },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: space.lg,
    paddingTop: space.lg,
  },
  closeText: { color: colors.chili, fontSize: font.body, fontWeight: "700" },
});
