import { StyleSheet } from "react-native";
import { colors } from "./theme";

// ขนาดรูปมาจากผู้เรียก (style prop) และถูกใส่ที่กรอบ ไม่ได้ใส่ที่ Image โดยตรง
export const styles = StyleSheet.create({
  // กรอบรูป: ตัดส่วนที่ล้นออก ทำให้มุมโค้ง (borderRadius) ตัดรูปตามไปด้วย
  frame: { overflow: "hidden" },
  // รูปเต็มกรอบเสมอ ไม่ว่าไฟล์รูปจริงจะกี่พิกเซล
  fill: { width: "100%", height: "100%" },
  placeholder: {
    backgroundColor: colors.slateSoft,
    alignItems: "center",
    justifyContent: "center",
  },
});