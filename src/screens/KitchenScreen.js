import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite";
import CancelReasonModal from "../components/CancelReasonModal";
import KitchenFilterTabs from "../components/KitchenFilterTabs";
import KitchenHeader from "../components/KitchenHeader";
import KitchenNoticeModal from "../components/KitchenNoticeModal";
import KitchenTableCard from "../components/KitchenTableCard";
import KitchenTableDetail from "../components/KitchenTableDetail";
import {
  acknowledgeCustomerCancel,
  advanceBillItems,
  advanceItemStatus,
  getCustomerCancelNotices,
  getKitchenQueue,
} from "../db/kitchenQueries";
import { cancelOrderItem } from "../db/orderQueries";
import { useNotices } from "../context/NoticeContext";
import { useNow } from "../hooks/useNow";
import { useReloadOnFocus } from "../hooks/useReloadOnFocus";
import { common } from "../styles/commonStyles";
import { styles } from "../styles/kitchenStyles";
import { layout } from "../styles/theme";
import { showError } from "../utils/alerts";
import {
  countTablesByStatus,
  groupKitchenTables,
  KITCHEN_FILTER,
} from "../utils/kitchen";
import { CANCELLED_BY, KITCHEN_CANCEL_REASONS } from "../utils/status";

export default function KitchenScreen() {
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const now = useNow();
  const { kitchenNoticeCount, refreshKitchenNotices } = useNotices();

  const [items, setItems] = useState([]);
  const [notices, setNotices] = useState([]);
  const [filter, setFilter] = useState(KITCHEN_FILTER.all);
  const [selectedBillId, setSelectedBillId] = useState(null);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const isWide = width >= layout.wideBreakpoint;

  const load = useCallback(async () => {
    try {
      setItems(await getKitchenQueue(db));
      setNotices(await getCustomerCancelNotices(db));
      await refreshKitchenNotices();
    } catch (error) {
      showError(error);
    }
  }, [db, refreshKitchenNotices]);

  useReloadOnFocus(load);

  const tables = useMemo(() => groupKitchenTables(items), [items]);
  const counts = useMemo(() => countTablesByStatus(tables), [tables]);
  const visibleTables =
    filter === KITCHEN_FILTER.all
      ? tables
      : tables.filter((table) => table.status === filter);

  const chosen =
    tables.find((table) => table.billId === selectedBillId) ?? null;
  const selected = chosen ?? (isWide ? (visibleTables[0] ?? null) : null);

  async function handleRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  async function handleAdvanceItem(item) {
    try {
      const changed = await advanceItemStatus(db, item.id, item.status);
      if (!changed) {
        Alert.alert(
          "รายการเปลี่ยนไปแล้ว",
          "รายการนี้ถูกเปลี่ยนสถานะหรือยกเลิกไปแล้ว",
        );
      }
      await load();
    } catch (error) {
      showError(error);
    }
  }

  async function handlePrimaryAction(action) {
    if (!selected) {
      return;
    }
    try {
      await advanceBillItems(db, selected.billId, action.from);
      await load();
    } catch (error) {
      showError(error);
    }
  }

  function handleItemMenu(item) {
    Alert.alert(`${item.name} ×${item.quantity}`, "รายการนี้ยังไม่ได้เริ่มทำ", [
      { text: "ปิด", style: "cancel" },
      {
        text: "ยกเลิกรายการ",
        style: "destructive",
        onPress: () => setCancelTarget(item),
      },
    ]);
  }

  async function handleCancel(reason) {
    const target = cancelTarget;
    setCancelTarget(null);
    try {
      const cancelled = await cancelOrderItem(
        db,
        target.id,
        CANCELLED_BY.kitchen,
        reason,
      );
      if (!cancelled) {
        Alert.alert(
          "ยกเลิกไม่ได้",
          "รายการนี้เริ่มทำไปแล้วหรือถูกยกเลิกไปแล้ว",
        );
      }
      await load();
    } catch (error) {
      showError(error);
    }
  }

  async function handleAcknowledge(notice) {
    try {
      await acknowledgeCustomerCancel(db, notice.id);
      await load();
    } catch (error) {
      showError(error);
    }
  }

  const detail = selected && (
    <KitchenTableDetail
      table={selected}
      onAdvanceItem={handleAdvanceItem}
      onItemMenu={handleItemMenu}
      onPrimaryAction={handlePrimaryAction}
    />
  );

  return (
    <View style={[common.screen, { paddingTop: insets.top }]}>
      <KitchenHeader
        noticeCount={kitchenNoticeCount}
        onPressBell={() => setNoticeOpen(true)}
      />

      <KitchenFilterTabs value={filter} counts={counts} onChange={setFilter} />

      <View style={styles.body}>
        <FlatList
          style={styles.list}
          data={visibleTables}
          keyExtractor={(table) => String(table.billId)}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          renderItem={({ item: table }) => (
            <KitchenTableCard
              table={table}
              now={now}
              selected={selected?.billId === table.billId}
              onPress={() => setSelectedBillId(table.billId)}
            />
          )}
          ListEmptyComponent={
            <View style={common.emptyBox}>
              <Text style={common.emptyTitle}>ไม่มีออเดอร์ค้าง</Text>
              <Text style={common.emptyText}>
                เมื่อลูกค้าส่งออเดอร์ โต๊ะจะขึ้นที่นี่ เรียงตามเวลาที่สั่ง
                เก่าสุดก่อน
              </Text>
            </View>
          }
        />

        {isWide && (
          <View style={styles.detail}>
            {detail ?? (
              <View style={styles.detailEmpty}>
                <Text style={common.emptyText}>
                  เลือกโต๊ะทางซ้ายเพื่อดูรายละเอียด
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {!isWide && (
        <Modal
          visible={selected !== null}
          animationType="slide"
          onRequestClose={() => setSelectedBillId(null)}
        >
          <View style={[styles.modalScreen, { paddingTop: insets.top }]}>
            <View style={styles.modalHeader}>
              <Pressable
                accessibilityLabel="ปิดรายละเอียดโต๊ะ"
                onPress={() => setSelectedBillId(null)}
              >
                <Text style={styles.closeText}>ปิด</Text>
              </Pressable>
            </View>
            {detail}
          </View>
        </Modal>
      )}

      <KitchenNoticeModal
        visible={noticeOpen}
        notices={notices}
        onClose={() => setNoticeOpen(false)}
        onAcknowledge={handleAcknowledge}
      />

      <CancelReasonModal
        visible={cancelTarget !== null}
        itemLabel={
          cancelTarget
            ? `โต๊ะ ${cancelTarget.table_no} · ${cancelTarget.name} ×${cancelTarget.quantity}`
            : ""
        }
        quickReasons={KITCHEN_CANCEL_REASONS}
        onClose={() => setCancelTarget(null)}
        onSubmit={handleCancel}
      />
    </View>
  );
}
