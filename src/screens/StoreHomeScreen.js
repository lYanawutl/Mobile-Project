import { useCallback, useState } from "react";
import { Alert, FlatList, Pressable, Text, View } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { getClosedBills } from "../db/billQueries";
import { resetAllData } from "../db/resetQueries";
import { useCart } from "../context/CartContext";
import { useNotices } from "../context/NoticeContext";
import { useReloadOnFocus } from "../hooks/useReloadOnFocus";
import { ROUTES } from "../navigation/routes";
import { common } from "../styles/commonStyles";
import { styles } from "../styles/storeHomeStyles";
import { confirmAction, showError } from "../utils/alerts";
import { formatBaht, formatDateTime } from "../utils/format";

export default function StoreHomeScreen({ navigation }) {
  const db = useSQLiteContext();
  const cart = useCart();
  const { refreshKitchenNotices } = useNotices();
  const [bills, setBills] = useState([]);

  const load = useCallback(async () => {
    try {
      setBills(await getClosedBills(db));
    } catch (error) {
      showError(error);
    }
  }, [db]);

  useReloadOnFocus(load);

  async function submitReset() {
    try {
      await resetAllData(db);
      cart.clearCart();
      await refreshKitchenNotices();
      await load();
      Alert.alert(
        "ล้างข้อมูลแล้ว",
        "เมนู โต๊ะ และตัวเลือกกลับเป็นค่าเริ่มต้น พร้อมใช้งานต่อทันที",
      );
    } catch (error) {
      showError(error);
    }
  }

  function handleReset() {
    confirmAction({
      title: "ล้างข้อมูลการขายทั้งหมด",
      message:
        "บิล ออร์เดอร์ และประวัติทั้งหมดจะถูกลบ เมนูที่แก้ไว้จะกลับเป็นค่าเริ่มต้น ย้อนกลับไม่ได้",
      confirmText: "ล้างข้อมูล",
      destructive: true,
      onConfirm: submitReset,
    });
  }

  const header = (
    <View style={styles.tools}>
      <Pressable
        accessibilityLabel="จัดการเมนู"
        onPress={() => navigation.navigate(ROUTES.menuManage)}
        style={[common.button, common.buttonOutline]}
      >
        <Text style={[common.buttonText, common.buttonOutlineText]}>
          จัดการเมนู
        </Text>
      </Pressable>
      <Pressable
        accessibilityLabel="ล้างข้อมูลการขาย"
        onPress={handleReset}
        style={[common.button, common.buttonOutline]}
      >
        <Text style={[common.buttonText, styles.resetText]}>
          ล้างข้อมูลการขาย
        </Text>
      </Pressable>
      <Text style={styles.sectionTitle}>ประวัติบิล</Text>
    </View>
  );

  return (
    <View style={common.screen}>
      <FlatList
        data={bills}
        keyExtractor={(bill) => String(bill.id)}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <View style={common.emptyBox}>
            <Text style={common.emptyTitle}>ยังไม่มีบิลที่ปิด</Text>
            <Text style={common.emptyText}>
              บิลที่ปิดแล้วจะขึ้นที่นี่ และดูย้อนหลังได้
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityLabel={`บิลโต๊ะ ${item.table_no}`}
            onPress={() =>
              navigation.navigate(ROUTES.bill, { billId: item.id })
            }
            style={styles.row}
          >
            <View>
              <Text style={styles.rowTitle}>โต๊ะ {item.table_no}</Text>
              <Text style={styles.rowMeta}>
                เปิด {formatDateTime(item.opened_at)} · ปิด{" "}
                {formatDateTime(item.closed_at)}
              </Text>
            </View>
            <Text style={styles.rowTotal}>{formatBaht(item.total)}</Text>
          </Pressable>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}
