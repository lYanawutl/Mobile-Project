import { StyleSheet } from "react-native";
import { colors, font, radius, space } from "./theme";

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: "center",
    justifyContent: "center",
    padding: space.xl,
  },
  // พื้นที่รอบการ์ด แตะแล้วปิดหน้ายืนยัน
  dismissArea: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: space.xl,
    gap: space.lg,
    alignItems: "center",
  },
  title: { color: colors.ink, fontSize: font.heading, fontWeight: "800", textAlign: "center" },
  message: { color: colors.inkSoft, fontSize: font.body, textAlign: "center" },
  guestRow: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  guestLabel: { color: colors.ink, fontSize: font.body, fontWeight: "700" },
  warning: {
    alignSelf: "stretch",
    backgroundColor: colors.saffronSoft,
    borderRadius: radius.sm,
    padding: space.md,
  },
  warningText: {
    color: colors.saffron,
    fontSize: font.small,
    fontWeight: "700",
    textAlign: "center",
  },
  actions: { flexDirection: "row", gap: space.md, alignSelf: "stretch" },
  action: { flex: 1 },
});
