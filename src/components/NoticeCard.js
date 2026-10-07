import { Pressable, Text, View } from "react-native";
import { styles } from "../styles/noticeCardStyles";

// การ์ดแจ้งเตือนการยกเลิก ใช้ทั้งฝั่งลูกค้า (ครัวยกเลิก) และฝั่งครัว (ลูกค้ายกเลิก)
// lines = ข้อความหลักทีละบรรทัด, note = ข้อความรองตัวเล็ก (ไม่ใส่ก็ได้)
export default function NoticeCard({ title, lines, note, actionLabel = "รับทราบ", onAction, style }) {
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.title}>{title}</Text>
      {lines.map((line, index) => (
        <Text key={index} style={styles.line}>
          {line}
        </Text>
      ))}
      {note ? <Text style={styles.note}>{note}</Text> : null}
      <Pressable accessibilityLabel={actionLabel} onPress={onAction} style={styles.action}>
        <Text style={styles.actionText}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
}
