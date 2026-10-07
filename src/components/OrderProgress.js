import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/orderProgressStyles";
import { colors } from "../styles/theme";
import { formatTime } from "../utils/format";
import { PROGRESS_STEPS, progressIndexOf } from "../utils/kitchen";

// แถบความคืบหน้าของโต๊ะ: รับออเดอร์ -> กำลังทำ -> พร้อมเสิร์ฟ -> เสิร์ฟแล้ว
// ขั้นก่อนหน้าเป็นเครื่องหมายถูก ขั้นปัจจุบันเป็นจุดสีแดง ขั้นถัดไปเป็นวงว่าง
export default function OrderProgress({ status, orderedAt }) {
  const current = progressIndexOf(status);

  return (
    <View style={styles.wrap}>
      <View style={styles.line} />
      <View style={styles.row}>
        {PROGRESS_STEPS.map((label, index) => {
          const done = index < current;
          const isCurrent = index === current;
          return (
            <View key={label} style={styles.step}>
              <View style={[styles.dot, done && styles.dotDone, isCurrent && styles.dotCurrent]}>
                {done && <Ionicons name="checkmark" size={14} color={colors.surface} />}
                {isCurrent && <View style={styles.dotCenter} />}
              </View>
              <Text style={[styles.label, isCurrent && styles.labelCurrent]}>{label}</Text>
              {index === 0 && <Text style={styles.time}>{formatTime(orderedAt)}</Text>}
            </View>
          );
        })}
      </View>
    </View>
  );
}
