import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  SectionList,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSQLiteContext } from "expo-sqlite";
import CategoryFilters from "../components/CategoryFilters";
import HeaderTextButton from "../components/HeaderTextButton";
import MenuGridCard from "../components/MenuGridCard";
import MenuItemCard from "../components/MenuItemCard";
import MenuItemSheet from "../components/MenuItemSheet";
import OrderSidePanel, { PANEL_TAB } from "../components/OrderSidePanel";
import { getBill, getKitchenCancelNotices } from "../db/billQueries";
import { getCategories, getMenuItemOptions, getMenuItems } from "../db/menuQueries";
import { useCart } from "../context/CartContext";
import { useReloadOnFocus } from "../hooks/useReloadOnFocus";
import { ROUTES } from "../navigation/routes";
import { common } from "../styles/commonStyles";
import { styles } from "../styles/menuStyles";
import { colors, layout, space } from "../styles/theme";
import { showError } from "../utils/alerts";
import { groupByCategory } from "../utils/grouping";
import { BILL_STATUS } from "../utils/status";

// ก2, ก3: ดูเมนูแยกหมวด ค้นหา กรองเฉพาะที่มีของ (ข2) แล้วใส่ตะกร้า
// จอกว้าง: ค้นหาด้านบน ตัวกรองซ้าย ตารางเมนูกลาง แผงตะกร้า/ประวัติขวา
// จอแคบ: รายการเมนูเต็มจอ และปุ่มตะกร้าด้านล่าง
export default function MenuScreen({ navigation, route }) {
  const { billId } = route.params;
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const cart = useCart();

  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState(0);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sheet, setSheet] = useState(null);
  const [panelTab, setPanelTab] = useState(PANEL_TAB.cart);
  const [historyKey, setHistoryKey] = useState(0);
  const [noticeCount, setNoticeCount] = useState(0);

  const isWide = width >= layout.wideBreakpoint;
  const gridWidth = width - layout.sidebarWidth - layout.panelWidth;
  const columns = Math.max(1, Math.floor(gridWidth / layout.gridCardMinWidth));

  // ข้อมูลของหน้า (บิล หมวด แจ้งเตือน) โหลดเมื่อกลับมาที่หน้า
  const loadScreen = useCallback(async () => {
    try {
      const bill = await getBill(db, billId);
      if (!bill || bill.status !== BILL_STATUS.open) {
        navigation.popToTop();
        return;
      }
      navigation.setOptions({ title: `โต๊ะ ${bill.table_no}` });
      setCategories(await getCategories(db));
      setNoticeCount((await getKitchenCancelNotices(db, billId)).length);
    } catch (error) {
      showError(error);
    }
  }, [db, billId, navigation]);

  // รายการเมนูโหลดใหม่ทั้งตอนกลับมาที่หน้า และทุกครั้งที่ค้นหาหรือเปลี่ยนตัวกรอง
  // (พิมพ์ค้นหาจึงไม่ต้องโหลดบิลและหมวดซ้ำทุกตัวอักษร)
  const loadItems = useCallback(async () => {
    try {
      setItems(await getMenuItems(db, { search, categoryId, onlyAvailable }));
    } catch (error) {
      showError(error);
    }
  }, [db, search, categoryId, onlyAvailable]);

  useReloadOnFocus(loadScreen);
  useReloadOnFocus(loadItems);

  const openBill = useCallback(
    () => navigation.navigate(ROUTES.bill, { billId }),
    [navigation, billId],
  );

  // จอแคบมีปุ่ม "บิล" ที่หัวจอ จอกว้างดูบิลได้จากแผงประวัติ
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: isWide
        ? undefined
        : () => <HeaderTextButton label="บิล" accessibilityLabel="ดูบิล" onPress={openBill} />,
    });
  }, [navigation, isWide, openBill]);

  const sections = useMemo(() => groupByCategory(items), [items]);

  async function openSheet(item) {
    try {
      const options = await getMenuItemOptions(db, item.id);
      setSheet({ item, options });
    } catch (error) {
      showError(error);
    }
  }

  function handleAdd(line) {
    cart.addLine(line);
    setSheet(null);
    setPanelTab(PANEL_TAB.cart);
  }

  function handleSent() {
    setPanelTab(PANEL_TAB.history);
    setHistoryKey((key) => key + 1);
  }

  const searchInput = (
    <TextInput
      value={search}
      onChangeText={setSearch}
      placeholder="ค้นหาเมนูจากชื่อ"
      placeholderTextColor={colors.slate}
      style={common.input}
    />
  );

  const filters = (
    <CategoryFilters
      vertical={isWide}
      categories={categories}
      categoryId={categoryId}
      onlyAvailable={onlyAvailable}
      onSelectCategory={setCategoryId}
      onToggleAvailable={() => setOnlyAvailable((value) => !value)}
    />
  );

  const emptyMenu = (
    <View style={common.emptyBox}>
      <Text style={common.emptyTitle}>ไม่พบเมนู</Text>
      <Text style={common.emptyText}>ลองเปลี่ยนคำค้นหา หรือปิดตัวกรอง "เฉพาะที่มีของ"</Text>
    </View>
  );

  function renderWide() {
    return (
      <>
        <View style={styles.wideSearch}>{searchInput}</View>
        <View style={styles.wideBody}>
          <View style={styles.sidebar}>{filters}</View>

          <FlatList
            key={`grid-${columns}`}
            style={styles.gridList}
            data={items}
            numColumns={columns}
            keyExtractor={(item) => String(item.id)}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.grid}
            ListEmptyComponent={emptyMenu}
            renderItem={({ item }) => (
              <View style={[styles.gridCell, { width: `${100 / columns}%` }]}>
                <MenuGridCard item={item} onPress={openSheet} />
              </View>
            )}
          />

          <OrderSidePanel
            billId={billId}
            tab={panelTab}
            onChangeTab={setPanelTab}
            historyKey={historyKey}
            hasNotice={noticeCount > 0}
            onSent={handleSent}
            onOpenBill={openBill}
          />
        </View>
      </>
    );
  }

  function renderNarrow() {
    const cartEmpty = cart.itemCount === 0;
    return (
      <>
        <View style={styles.filters}>
          {searchInput}
          {filters}
        </View>

        <SectionList
          sections={sections}
          keyExtractor={(item) => String(item.id)}
          keyboardShouldPersistTaps="handled"
          stickySectionHeadersEnabled
          contentContainerStyle={styles.listBottom}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          renderItem={({ item }) => (
            <View style={styles.itemWrap}>
              <MenuItemCard item={item} onPress={openSheet} />
            </View>
          )}
          ListEmptyComponent={emptyMenu}
        />

        <View style={[styles.cartBar, { paddingBottom: insets.bottom + space.md }]}>
          <Pressable
            accessibilityLabel="ดูตะกร้า"
            disabled={cartEmpty}
            onPress={() => navigation.navigate(ROUTES.cart, { billId })}
            style={[common.button, cartEmpty && common.buttonDisabled]}
          >
            <View style={styles.cartButtonContent}>
              <Text style={[common.buttonText, cartEmpty && common.buttonDisabledText]}>
                {cartEmpty ? "ตะกร้ายังว่าง" : "ดูตะกร้า"}
              </Text>
              {!cartEmpty && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cart.itemCount}</Text>
                </View>
              )}
            </View>
          </Pressable>
        </View>
      </>
    );
  }

  return (
    <View style={common.screen}>
      {isWide ? renderWide() : renderNarrow()}

      <MenuItemSheet
        visible={sheet !== null}
        item={sheet?.item ?? null}
        options={sheet?.options ?? []}
        onClose={() => setSheet(null)}
        onAdd={handleAdd}
      />
    </View>
  );
}
