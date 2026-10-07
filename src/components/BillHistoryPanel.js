import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import StatusBadge from "./StatusBadge";
import { getBillLines, getBillTotal, getKitchenCancelNotices } from "../db/billQueries";
import { useReloadOnFocus } from "../hooks/useReloadOnFocus";
import { common } from "../styles/commonStyles";
import { styles } from "../styles/billHistoryPanelStyles";
import { showError } from "../utils/alerts";
import { formatBaht, formatTime } from "../utils/format";
import { groupByRound } from "../utils/grouping";
import { ORDER_STATUS } from "../utils/status";

// แผง "ประวัติ" ของหน้าเมนูจอกว้าง: รายการที่สั่งไปแล้วในบิลนี้ แยกตามรอบ พร้อมสถานะจากครัว
// การยกเลิกและปิดบิลทำในหน้าบิลเต็ม (onOpenBill)
export default function BillHistoryPanel({ billId, refreshKey, onOpenBill }) {
  const db = useSQLiteContext();
  const [lines, setLines] = useState([]);
  const [total, setTotal] = useState(0);
  const [noticeCount, setNoticeCount] = useState(0);

  // refreshKey เปลี่ยนเมื่อเพิ่งส่งรอบใหม่ ใช้บังคับให้โหลดใหม่
  const load = useCallback(async () => {
    try {
      setLines(await getBillLines(db, billId));
      setTotal(await getBillTotal(db, billId));
      setNoticeCount((await getKitchenCancelNotices(db, billId)).length);
    } catch (error) {
      showError(error);
    }
  }, [db, billId, refreshKey]);

  useReloadOnFocus(load);

  const rounds = groupByRound(lines);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {noticeCount > 0 && (
          <Pressable accessibilityLabel="ดูรายการที่ครัวยกเลิก" onPress={onOpenBill} style={styles.notice}>
            <Text style={styles.noticeText}>
              ครัวยกเลิก {noticeCount} รายการ · แตะเพื่อดูเหตุผล
            </Text>
          </Pressable>
        )}

        {rounds.length === 0 && (
          <View style={common.emptyBox}>
            <Text style={common.emptyTitle}>ยังไม่ได้สั่ง</Text>
            <Text style={common.emptyText}>รายการที่ส่งเข้าครัวแล้วจะขึ้นที่นี่</Text>
          </View>
        )}

        {rounds.map((round) => (
          <View key={round.roundNo}>
            <Text style={styles.roundHeader}>
              รอบที่ {round.roundNo} · {formatTime(round.orderedAt)}
            </Text>
            {round.data.map((line) => {
              const cancelled = line.status === ORDER_STATUS.cancelled;
              return (
                <View key={line.id} style={styles.row}>
                  <View style={styles.rowTop}>
                    <Text style={[styles.name, cancelled && styles.struck]}>
                      {line.name} ×{line.quantity}
                    </Text>
                    <Text style={[styles.amount, cancelled && styles.struck]}>
                      {formatBaht(line.line_total)}
                    </Text>
                  </View>
                  <StatusBadge status={line.status} />
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>ยอดรวมทั้งบิล</Text>
          <Text style={styles.totalValue}>{formatBaht(total)}</Text>
        </View>
        <Pressable
          accessibilityLabel="ดูบิลเต็ม"
          onPress={onOpenBill}
          style={[common.button, common.buttonOutline]}
        >
          <Text style={[common.buttonText, common.buttonOutlineText]}>
            ดูบิล · ยกเลิกรายการ · ปิดบิล
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
