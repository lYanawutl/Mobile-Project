import { StyleSheet } from "react-native";
import { colors, font, layout, radius, space } from "./theme";

export const styles = StyleSheet.create({
  // ----- จอแคบ (มือถือแนวตั้ง) -----
  filters: {
    gap: space.md,
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    paddingBottom: space.sm,
  },
  sectionHeader: {
    color: colors.ink,
    fontSize: font.title,
    fontWeight: "800",
    paddingHorizontal: space.lg,
    paddingTop: space.lg,
    paddingBottom: space.sm,
    backgroundColor: colors.paper,
  },
  itemWrap: { paddingHorizontal: space.lg, paddingBottom: space.sm },
  listBottom: { paddingBottom: 120 },
  cartBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  cartButtonContent: { flexDirection: "row", alignItems: "center" },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: space.sm,
  },
  badgeText: { color: colors.chili, fontSize: font.small, fontWeight: "800" },

  // ----- จอกว้าง (แท็บเล็ตแนวนอน): ค้นหาด้านบน + ตัวกรองซ้าย + ตารางเมนูกลาง (แผงขวาอยู่ใน OrderSidePanel) -----
  wideSearch: {
    paddingHorizontal: space.xl,
    paddingVertical: space.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  wideBody: { flex: 1, flexDirection: "row" },
  sidebar: {
    width: layout.sidebarWidth,
    borderRightWidth: 1,
    borderRightColor: colors.line,
  },
  gridList: { flex: 1 },
  grid: { padding: space.md },
  gridCell: { padding: space.sm },
});
