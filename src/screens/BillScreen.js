import { useCallback, useMemo, useState } from "react";
import { Alert, Pressable, SectionList, Text, View } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import BillLineCard from "../components/BillLineCard";
import CancelReasonModal from "../components/CancelReasonModal";
import NoticeCard from "../components/NoticeCard";
import {
  acknowledgeKitchenCancels,
  closeBill,
  getBill,
  getBillLines,
  getBillTotal,
  getKitchenCancelNotices,
  getUnfinishedItems,
} from "../db/billQueries";
import { cancelOrderItem } from "../db/orderQueries";
import { useNotices } from "../context/NoticeContext";
import { useReloadOnFocus } from "../hooks/useReloadOnFocus";
import { common } from "../styles/commonStyles";
import { styles } from "../styles/billStyles";
import { confirmAction, showError } from "../utils/alerts";
import { formatBaht, formatDateTime, formatTime } from "../utils/format";
import { groupByRound } from "../utils/grouping";
import {
  BILL_STATUS,
  CANCELLED_BY,
  CUSTOMER_CANCEL_REASONS,
  ORDER_STATUS,
} from "../utils/status";

// ก6, ก10: สรุปบิล ทุกรอบ ราคาต่อหน่วย ราคารวมรายการ ยอดรวมทั้งบิล และปิดบิล
// ใช้ได้ทั้งบิลที่เปิดอยู่ (ฝั่งลูกค้า) และบิลที่ปิดแล้ว (ดูย้อนหลังจากแท็บร้าน)
export default function BillScreen({ navigation, route }) {
  const { billId } = route.params;
  const db = useSQLiteContext();
  const { refreshKitchenNotices } = useNotices();

  const [bill, setBill] = useState(null);
  const [lines, setLines] = useState([]);
  const [total, setTotal] = useState(0);
  const [notices, setNotices] = useState([]);
  const [cancelTarget, setCancelTarget] = useState(null);

  const load = useCallback(async () => {
    try {
      const loadedBill = await getBill(db, billId);
      if (!loadedBill) {
        navigation.popToTop();
        return;
      }
      setBill(loadedBill);
      setLines(await getBillLines(db, billId));
      setTotal(await getBillTotal(db, billId));
      setNotices(await getKitchenCancelNotices(db, billId));
    } catch (error) {
      showError(error);
    }
  }, [db, billId, navigation]);

  useReloadOnFocus(load);

  const sections = useMemo(() => groupByRound(lines), [lines]);
  const isOpen = bill?.status === BILL_STATUS.open;

  async function handleCancel(reason) {
    const target = cancelTarget;
    setCancelTarget(null);
    try {
      const cancelled = await cancelOrderItem(db, target.id, CANCELLED_BY.customer, reason);
      if (!cancelled) {
        Alert.alert(
          "ยกเลิกไม่ได้",
          "ครัวเริ่มทำรายการนี้แล้ว จึงยกเลิกไม่ได้",
        );
      }
      await load();
      await refreshKitchenNotices();
    } catch (error) {
      showError(error);
    }
  }

  async function handleAcknowledge() {
    try {
      await acknowledgeKitchenCancels(db, billId);
      await load();
    } catch (error) {
      showError(error);
    }
  }

  async function submitClose() {
    try {
      const closed = await closeBill(db, billId);
      if (closed) {
        navigation.popToTop();
        return;
      }
      const unfinished = await getUnfinishedItems(db, billId);
      const names = unfinished
        .map((item) => `${item.name} ×${item.quantity}`)
        .join("\n");
      Alert.alert(
        "ปิดบิลไม่ได้",
        `ยังมีรายการที่ครัวไม่ได้เสิร์ฟ:\n${names}`,
      );
      await load();
    } catch (error) {
      showError(error);
    }
  }

  function handleClose() {
    confirmAction({
      title: "ปิดบิล",
      message: `ยอดรวม ${formatBaht(total)} ปิดแล้วโต๊ะนี้จะเปิดบิลใหม่ได้`,
      confirmText: "ปิดบิล",
      onConfirm: submitClose,
    });
  }

  // ยกเลิกได้เฉพาะบิลที่ยังเปิด และรายการที่ครัวยังไม่ได้ลงมือทำ (ข3)
  function renderLine({ item }) {
    const canCancel = isOpen && item.status === ORDER_STATUS.pending;
    return <BillLineCard item={item} onCancel={canCancel ? setCancelTarget : undefined} />;
  }

  const header = bill && (
    <View>
      <View style={styles.summary}>
        <Text style={styles.tableTitle}>โต๊ะ {bill.table_no}</Text>
        <Text style={styles.meta}>
          {bill.guest_count} คน · เปิดบิล {formatDateTime(bill.opened_at)}
          {bill.closed_at ? ` · ปิดบิล ${formatDateTime(bill.closed_at)}` : ""}
        </Text>
      </View>
      {notices.length > 0 && (
        <NoticeCard
          title="ครัวยกเลิกรายการ"
          lines={notices.map(
            (notice) =>
              `${notice.name} ×${notice.quantity} (รอบ ${notice.round_no}) · ${notice.cancel_reason}`,
          )}
          onAction={handleAcknowledge}
          style={styles.noticeSpacing}
        />
      )}
    </View>
  );

  const footer = bill && (
    <View>
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>ยอดรวมทั้งบิล</Text>
        <Text style={styles.totalValue}>{formatBaht(total)}</Text>
      </View>
      {isOpen && (
        <View style={styles.actions}>
          <Pressable
            accessibilityLabel="สั่งเพิ่ม"
            onPress={() => navigation.goBack()}
            style={[common.button, common.buttonOutline, styles.action]}
          >
            <Text style={[common.buttonText, common.buttonOutlineText]}>สั่งเพิ่ม</Text>
          </Pressable>
          <Pressable
            accessibilityLabel="ปิดบิล"
            onPress={handleClose}
            style={[common.button, styles.action]}
          >
            <Text style={common.buttonText}>ปิดบิล</Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  return (
    <View style={common.screen}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderLine}
        renderSectionHeader={({ section }) => (
          <Text style={styles.roundHeader}>
            รอบที่ {section.roundNo} · {formatTime(section.orderedAt)}
          </Text>
        )}
        ListHeaderComponent={header}
        ListFooterComponent={footer}
        ListEmptyComponent={
          <View style={common.emptyBox}>
            <Text style={common.emptyTitle}>ยังไม่มีรายการสั่ง</Text>
            <Text style={common.emptyText}>
              กลับไปเลือกเมนู แล้วส่งรอบแรกเข้าครัว
            </Text>
          </View>
        }
        contentContainerStyle={styles.list}
        stickySectionHeadersEnabled={false}
      />

      <CancelReasonModal
        visible={cancelTarget !== null}
        itemLabel={cancelTarget ? `${cancelTarget.name} ×${cancelTarget.quantity}` : ""}
        quickReasons={CUSTOMER_CANCEL_REASONS}
        onClose={() => setCancelTarget(null)}
        onSubmit={handleCancel}
      />
    </View>
  );
}
