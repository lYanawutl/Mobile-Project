import { useCallback, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import QuantityStepper from "./QuantityStepper";
import { getCartPreview, sendOrderRound } from "../db/orderQueries";
import { useCart } from "../context/CartContext";
import { useNotices } from "../context/NoticeContext";
import { useReloadOnFocus } from "../hooks/useReloadOnFocus";
import { common } from "../styles/commonStyles";
import { styles } from "../styles/cartPanelStyles";
import { confirmAction, showError } from "../utils/alerts";
import { formatBaht } from "../utils/format";


export default function CartPanel({ billId, onSent, onBrowseMenu }) {
  const db = useSQLiteContext();
  const cart = useCart();
  const { refreshKitchenNotices } = useNotices();

  const [rows, setRows] = useState([]);
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    try {
      setRows(await getCartPreview(db, cart.lines));
    } catch (error) {
      showError(error);
    }
  }, [db, cart.lines]);

  useReloadOnFocus(load);

  
  const total = rows.length > 0 ? rows[0].cart_total : 0;
  const hasSoldOut = rows.some((row) => row.is_available === 0);
  const canSend = rows.length > 0 && !hasSoldOut && !sending;

  async function submit() {
    setSending(true);
    try {
      await sendOrderRound(db, billId, cart.lines);
      cart.clearCart();
      await refreshKitchenNotices();
      setSending(false);
      onSent();
    } catch (error) {
      setSending(false);
      showError(error);
      load();
    }
  }

  function handleSend() {
    confirmAction({
      title: "ส่งเข้าครัว",
      message: "ส่งแล้วแก้ไขรายการไม่ได้ แต่ยังยกเลิกได้ถ้าครัวยังไม่เริ่มทำ",
      confirmText: "ส่งเข้าครัว",
      onConfirm: submit,
    });
  }

  function renderLine({ item: row }) {
    const line = cart.lines[row.idx];
    if (!line) {
      return null;
    }
    return (
      <View style={styles.line}>
        <View style={styles.lineTop}>
          <Text style={styles.name}>{row.name}</Text>
          <Text style={styles.lineTotal}>{formatBaht(row.line_total)}</Text>
        </View>
        <Text style={styles.detail}>
          {formatBaht(row.unit_total)} ต่อหน่วย
          {row.options_text ? ` · ${row.options_text}` : ""}
        </Text>
        {line.note !== "" && <Text style={styles.detail}>หมายเหตุ: {line.note}</Text>}
        {row.is_available === 0 && (
          <Text style={styles.soldOut}>เมนูนี้ปิดการขายอยู่ ลบออกก่อนจึงจะส่งได้</Text>
        )}
        <View style={styles.lineBottom}>
          <QuantityStepper
            value={line.quantity}
            min={1}
            onChange={(quantity) => cart.setQuantity(line.key, quantity)}
          />
          <Pressable accessibilityLabel="ลบรายการ" onPress={() => cart.setQuantity(line.key, 0)}>
            <Text style={styles.removeText}>ลบ</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={rows}
        keyExtractor={(row) => String(row.idx)}
        renderItem={renderLine}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={common.emptyBox}>
            <Text style={common.emptyTitle}>ตะกร้ายังว่าง</Text>
            <Text style={common.emptyText}>แตะเมนูเพื่อใส่ตะกร้า</Text>
            {onBrowseMenu && (
              <Pressable
                accessibilityLabel="กลับไปเลือกเมนู"
                onPress={onBrowseMenu}
                style={[common.button, common.buttonOutline]}
              >
                <Text style={[common.buttonText, common.buttonOutlineText]}>กลับไปเลือกเมนู</Text>
              </Pressable>
            )}
          </View>
        }
      />

      {rows.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>ยอดรอบนี้</Text>
            <Text style={styles.totalValue}>{formatBaht(total)}</Text>
          </View>
          {hasSoldOut && <Text style={styles.warning}>มีเมนูที่ปิดการขายอยู่ในตะกร้า</Text>}
          <Pressable
            accessibilityLabel="ส่งเข้าครัว"
            disabled={!canSend}
            onPress={handleSend}
            style={[common.button, !canSend && common.buttonDisabled]}
          >
            <Text style={[common.buttonText, !canSend && common.buttonDisabledText]}>
              ส่งเข้าครัว
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
