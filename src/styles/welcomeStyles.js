import { StyleSheet } from "react-native";
import { colors, font, space } from "./theme";

const PLATE = 220;
const PLATE_WIDE = 300;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: space.xl,
  },
  content: { alignItems: "center", gap: space.xl, width: "100%", maxWidth: 440 },
  contentWide: { flexDirection: "row", gap: space.xl * 3, maxWidth: 960 },

  // จานกระเบื้องใบใหญ่ ล้อกับโต๊ะรูปจานในหน้าเลือกโต๊ะ
  plate: {
    width: PLATE,
    height: PLATE,
    borderRadius: PLATE / 2,
    borderWidth: 2,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  plateWide: { width: PLATE_WIDE, height: PLATE_WIDE, borderRadius: PLATE_WIDE / 2 },
  plateInner: {
    width: PLATE - 40,
    height: PLATE - 40,
    borderRadius: (PLATE - 40) / 2,
    borderWidth: 1,
    borderColor: colors.chili,
    alignItems: "center",
    justifyContent: "center",
  },
  plateInnerWide: {
    width: PLATE_WIDE - 52,
    height: PLATE_WIDE - 52,
    borderRadius: (PLATE_WIDE - 52) / 2,
  },

  textBlock: { alignItems: "center", gap: space.sm, width: "100%" },
  textBlockWide: { alignItems: "flex-start", flex: 1 },
  eyebrow: { color: colors.inkSoft, fontSize: font.body, fontWeight: "600" },
  title: { color: colors.ink, fontSize: 40, fontWeight: "800" },
  subtitle: { color: colors.inkSoft, fontSize: font.title, textAlign: "center", lineHeight: 28 },
  subtitleWide: { textAlign: "left" },

  actions: { gap: space.md, width: "100%", marginTop: space.lg },
  primaryButton: { minHeight: 56 },
  primaryText: { fontSize: font.title },

  footnote: { flexDirection: "row", alignItems: "center", gap: space.xs, marginTop: space.md },
  footnoteText: { color: colors.slate, fontSize: font.small },
});
