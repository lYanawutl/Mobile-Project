import { Pressable, Text, View } from "react-native";
import StatusBadge from "./StatusBadge";
import { styles } from "../styles/billLineCardStyles";
import { formatBaht, formatDateTime } from "../utils/format";
import { CANCEL_BY_LABEL, ORDER_STATUS } from "../utils/status";

// หนึ่งรายการในหน้าสรุปบิล (ก6): ชื่อ ×จำนวน ราคารวม ราคาต่อหน่วย ตัวเลือก หมายเหตุ สถานะ
// รายการที่ยกเลิกแล้วขีดฆ่าและบอกว่าใครยกเลิก เมื่อไร เพราะอะไร
// onCancel = ปุ่มยกเลิก (ส่งมาเฉพาะรายการที่ยังยกเลิกได้)
export default function BillLineCard({ item, onCancel }) {
  const cancelled = item.status === ORDER_STATUS.cancelled;

  return (
    <View style={styles.line}>
      <View style={styles.lineTop}>
        <Text style={[styles.name, cancelled && styles.struck]}>
          {item.name} ×{item.quantity}
        </Text>
        <Text style={[styles.lineTotal, cancelled && styles.struck]}>
          {formatBaht(item.line_total)}
        </Text>
      </View>
      <Text style={styles.detail}>
        {formatBaht(item.unit_total)} ต่อหน่วย
        {item.options_text ? ` · ${item.options_text}` : ""}
      </Text>
      {item.note !== "" && <Text style={styles.detail}>หมายเหตุ: {item.note}</Text>}
      {cancelled && (
        <Text style={styles.cancelInfo}>
          {CANCEL_BY_LABEL[item.cancelled_by]}ยกเลิก {formatDateTime(item.cancelled_at)} ·{" "}
          {item.cancel_reason}
        </Text>
      )}
      <View style={styles.lineBottom}>
        <StatusBadge status={item.status} />
        {onCancel && (
          <Pressable accessibilityLabel={`ยกเลิก ${item.name}`} onPress={() => onCancel(item)}>
            <Text style={styles.cancelText}>ยกเลิก</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
