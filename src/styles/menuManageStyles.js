import { StyleSheet } from "react-native";
import { colors, font, radius, space } from "./theme";

export const styles = StyleSheet.create({
  searchWrap: { padding: space.lg, paddingBottom: space.sm },
  list: { padding: space.lg, gap: space.sm, paddingBottom: space.xl * 2 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.md,
  },
  // เมนูที่ปิดขาย: รูปและข้อความจางลง ให้เห็นต่างจากเมนูที่ขายอยู่
  rowSoldOut: { opacity: 0.6 },
  photo: { width: 72, height: 72, borderRadius: radius.sm },
  body: { flex: 1, gap: space.xs },
  name: { color: colors.ink, fontSize: font.title, fontWeight: "700" },
  meta: { color: colors.inkSoft, fontSize: font.small },
  price: { color: colors.chili, fontSize: font.body, fontWeight: "700" },
  editText: { color: colors.ink, fontSize: font.body, fontWeight: "700" },
  edit: { paddingHorizontal: space.md, paddingVertical: space.sm },
  switchBox: { alignItems: "center", gap: space.xs },
  switchLabel: { color: colors.inkSoft, fontSize: font.small },
});
