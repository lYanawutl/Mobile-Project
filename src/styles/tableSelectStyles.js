import { StyleSheet } from "react-native";
import { colors, font, radius, space } from "./theme";

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.tableScreen },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: space.lg,
    paddingHorizontal: space.xl,
    paddingTop: space.lg,
    paddingBottom: space.md,
  },
  headerText: { flex: 1, gap: space.xs },
  title: { color: colors.ink, fontSize: font.display, fontWeight: "800" },
  subtitle: { color: colors.inkSoft, fontSize: font.body },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },

  grid: { paddingHorizontal: space.lg, paddingBottom: space.xl * 2 },
  cell: { padding: space.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: space.lg,
    paddingHorizontal: space.md,
    alignItems: "center",
    gap: space.md,
    shadowColor: colors.ink,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statusRow: { flexDirection: "row", alignItems: "center", gap: space.xs },
  statusDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.statusFree },
  statusDotBusy: { backgroundColor: colors.statusBusy },
  statusText: { color: colors.inkSoft, fontSize: font.small, fontWeight: "700" },
  statusTextBusy: { color: colors.ink },

  // ครัวยกเลิกรายการของโต๊ะนี้ และลูกค้ายังไม่กดรับทราบ
  noticeBadge: {
    position: "absolute",
    top: space.sm,
    right: space.sm,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.saffron,
    alignItems: "center",
    justifyContent: "center",
  },
  noticeText: { color: colors.surface, fontSize: font.small, fontWeight: "800" },
});
