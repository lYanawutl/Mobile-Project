import { useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import QuantityStepper from "../components/QuantityStepper";
import TableIllustration from "../components/TableIllustration";
import { getTable, openBill } from "../db/billQueries";
import { useCart } from "../context/CartContext";
import { useReloadOnFocus } from "../hooks/useReloadOnFocus";
import { ROUTES } from "../navigation/routes";
import { common } from "../styles/commonStyles";
import { styles } from "../styles/openTableStyles";
import { showError } from "../utils/alerts";

const DEFAULT_GUESTS = 2;
const MAX_GUESTS = 30; // ตรงกับ CHECK ของ bills.guest_count

// หน้ายืนยันการเปิดโต๊ะ แสดงซ้อนบนหน้าเลือกโต๊ะ กันแตะผิดแล้วได้บิลเปล่า
// ใส่จำนวนลูกค้า แล้วกดยืนยันจึงเปิดบิลใหม่ (ก1) และไปหน้าเมนูของบิลนั้น
export default function OpenTableScreen({ navigation, route }) {
  const { tableId } = route.params;
  const db = useSQLiteContext();
  const cart = useCart();
  const [table, setTable] = useState(null);
  const [opening, setOpening] = useState(false);
  const [guestCount, setGuestCount] = useState(DEFAULT_GUESTS);

  const load = useCallback(async () => {
    try {
      setTable(await getTable(db, tableId));
    } catch (error) {
      showError(error);
    }
  }, [db, tableId]);

  useReloadOnFocus(load);

  async function handleConfirm() {
    setOpening(true);
    try {
      const billId = await openBill(db, tableId, guestCount);
      cart.bindBill(billId);
      // เอาหน้ายืนยันออกจากประวัติ: ย้อนกลับจากหน้าเมนูแล้วกลับไปหน้าเลือกโต๊ะ
      navigation.reset({
        index: 1,
        routes: [{ name: ROUTES.tableSelect }, { name: ROUTES.menu, params: { billId } }],
      });
    } catch (error) {
      setOpening(false);
      showError(error);
    }
  }

  // ถ้ามีคนเปิดโต๊ะนี้ไปก่อนแล้ว ปุ่มยืนยันจะพากลับเข้าบิลเดิมแทน
  const alreadyOpen = table !== null && table.open_bill_id !== null;
  const willClearCart =
    table !== null && cart.lines.length > 0 && cart.billId !== table.open_bill_id;

  return (
    <View style={styles.backdrop}>
      <Pressable
        accessibilityLabel="ปิดหน้าต่าง"
        onPress={() => navigation.goBack()}
        style={styles.dismissArea}
      />
      {table && (
        <View style={styles.card}>
          <TableIllustration number={table.table_no} busy={alreadyOpen} />
          <Text style={styles.title}>
            {alreadyOpen ? `โต๊ะ ${table.table_no} มีบิลเปิดอยู่แล้ว` : `เปิดโต๊ะ ${table.table_no}`}
          </Text>
          <Text style={styles.message}>
            {alreadyOpen
              ? "กลับเข้าบิลเดิมของโต๊ะนี้ได้เลย"
              : "ยืนยันเพื่อเปิดบิลใหม่ให้โต๊ะนี้ แล้วเริ่มสั่งอาหารได้ทันที"}
          </Text>

          {!alreadyOpen && (
            <View style={styles.guestRow}>
              <Text style={styles.guestLabel}>จำนวนลูกค้า</Text>
              <QuantityStepper
                value={guestCount}
                onChange={setGuestCount}
                min={1}
                max={MAX_GUESTS}
              />
            </View>
          )}

          {willClearCart && (
            <View style={styles.warning}>
              <Text style={styles.warningText}>
                ตะกร้าของโต๊ะเดิมยังมี {cart.itemCount} รายการ จะถูกล้างเมื่อเปิดโต๊ะนี้
              </Text>
            </View>
          )}

          <View style={styles.actions}>
            <Pressable
              accessibilityLabel="ยกเลิกการเปิดโต๊ะ"
              onPress={() => navigation.goBack()}
              style={[common.button, common.buttonOutline, styles.action]}
            >
              <Text style={[common.buttonText, common.buttonOutlineText]}>ยกเลิก</Text>
            </Pressable>
            <Pressable
              accessibilityLabel="ยืนยันเปิดโต๊ะ"
              disabled={opening}
              onPress={handleConfirm}
              style={[common.button, styles.action, opening && common.buttonDisabled]}
            >
              <Text style={[common.buttonText, opening && common.buttonDisabledText]}>
                {alreadyOpen ? "เข้าบิลเดิม" : "เปิดโต๊ะ"}
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
