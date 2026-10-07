import { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite";
import { Ionicons } from "@expo/vector-icons";
import TableIllustration from "../components/TableIllustration";
import { getTables } from "../db/billQueries";
import { useCart } from "../context/CartContext";
import { useReloadOnFocus } from "../hooks/useReloadOnFocus";
import { ROUTES } from "../navigation/routes";
import { colors, layout } from "../styles/theme";
import { styles } from "../styles/tableSelectStyles";
import { confirmAction, showError } from "../utils/alerts";

const WIDE_COLUMNS = 5;
const NARROW_COLUMNS = 2;

export default function TableSelectScreen({ navigation }) {
  const db = useSQLiteContext();
  const cart = useCart();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [tables, setTables] = useState([]);

  const columns =
    width >= layout.wideBreakpoint ? WIDE_COLUMNS : NARROW_COLUMNS;

  const load = useCallback(async () => {
    try {
      setTables(await getTables(db));
    } catch (error) {
      showError(error);
    }
  }, [db]);

  useReloadOnFocus(load);

  function enterBill(billId) {
    cart.bindBill(billId);
    navigation.navigate(ROUTES.menu, { billId });
  }

  function handleSelect(table) {
    if (table.open_bill_id === null) {
      navigation.navigate(ROUTES.openTable, { tableId: table.id });
      return;
    }

    const leavingFilledCart =
      cart.lines.length > 0 && cart.billId !== table.open_bill_id;
    if (leavingFilledCart) {
      confirmAction({
        title: "เปลี่ยนโต๊ะ",
        message:
          "ตะกร้าของโต๊ะเดิมยังมีรายการ ถ้าเปลี่ยนโต๊ะ ตะกร้านั้นจะถูกล้าง",
        confirmText: "ล้างตะกร้าและเปลี่ยนโต๊ะ",
        destructive: true,
        onConfirm: () => enterBill(table.open_bill_id),
      });
      return;
    }
    enterBill(table.open_bill_id);
  }

  function renderTable({ item }) {
    const busy = item.open_bill_id !== null;
    return (
      <View style={[styles.cell, { width: `${100 / columns}%` }]}>
        <Pressable
          accessibilityLabel={`โต๊ะ ${item.table_no}`}
          onPress={() => handleSelect(item)}
          style={styles.card}
        >
          <TableIllustration number={item.table_no} busy={busy} />
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, busy && styles.statusDotBusy]} />
            <Text style={[styles.statusText, busy && styles.statusTextBusy]}>
              {busy ? "มีบิลเปิดอยู่" : "ว่าง"}
            </Text>
          </View>
          {item.notice_count > 0 && (
            <View style={styles.noticeBadge}>
              <Text style={styles.noticeText}>!</Text>
            </View>
          )}
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>เลือกโต๊ะ</Text>
          <Text style={styles.subtitle}>
            แตะโต๊ะเพื่อเปิดบิลใหม่ หรือกลับเข้าบิลเดิมเพื่อดูคำสั่งซื้อ
          </Text>
        </View>
        <View style={styles.logo}>
          <Ionicons name="leaf-outline" size={24} color={colors.ink} />
        </View>
      </View>

      <FlatList
        key={`tables-${columns}`}
        data={tables}
        numColumns={columns}
        keyExtractor={(table) => String(table.id)}
        renderItem={renderTable}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
}
