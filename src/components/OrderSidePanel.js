import { Pressable, Text, View } from "react-native";
import BillHistoryPanel from "./BillHistoryPanel";
import CartPanel from "./CartPanel";
import { useCart } from "../context/CartContext";
import { styles } from "../styles/orderSidePanelStyles";

export const PANEL_TAB = { cart: "cart", history: "history" };

function PanelTab({ label, accessibilityLabel, active, showDot, onPress }) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={[styles.tab, active && styles.tabActive]}
    >
      <Text style={[styles.tabText, active && styles.tabTextActive]}>
        {label}
      </Text>
      {showDot && <View style={styles.tabDot} />}
    </Pressable>
  );
}

export default function OrderSidePanel({
  billId,
  tab,
  onChangeTab,
  historyKey,
  hasNotice,
  onSent,
  onOpenBill,
}) {
  const cart = useCart();
  const cartLabel =
    cart.itemCount > 0 ? `ตะกร้า (${cart.itemCount})` : "ตะกร้า";

  return (
    <View style={styles.panel}>
      <View style={styles.tabs}>
        <PanelTab
          label={cartLabel}
          accessibilityLabel="แท็บตะกร้า"
          active={tab === PANEL_TAB.cart}
          onPress={() => onChangeTab(PANEL_TAB.cart)}
        />
        <PanelTab
          label="ประวัติ"
          accessibilityLabel="แท็บประวัติ"
          active={tab === PANEL_TAB.history}
          showDot={hasNotice}
          onPress={() => onChangeTab(PANEL_TAB.history)}
        />
      </View>

      {tab === PANEL_TAB.cart ? (
        <CartPanel billId={billId} onSent={onSent} />
      ) : (
        <BillHistoryPanel
          billId={billId}
          refreshKey={historyKey}
          onOpenBill={onOpenBill}
        />
      )}
    </View>
  );
}
