import { useCallback, useLayoutEffect, useState } from "react";
import { FlatList, Pressable, Switch, Text, TextInput, View } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import HeaderTextButton from "../components/HeaderTextButton";
import MenuPhoto from "../components/MenuPhoto";
import { getMenuItems, setMenuItemAvailable } from "../db/menuQueries";
import { useReloadOnFocus } from "../hooks/useReloadOnFocus";
import { ROUTES } from "../navigation/routes";
import { common } from "../styles/commonStyles";
import { styles } from "../styles/menuManageStyles";
import { colors } from "../styles/theme";
import { showError } from "../utils/alerts";
import { formatBaht } from "../utils/format";

// ข5: ตั้งค่าเมนูในแอป เพิ่ม แก้ราคา หรือปิดการขายชั่วคราว
export default function MenuManageScreen({ navigation }) {
  const db = useSQLiteContext();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    try {
      setItems(await getMenuItems(db, { search }));
    } catch (error) {
      showError(error);
    }
  }, [db, search]);

  useReloadOnFocus(load);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderTextButton
          label="เพิ่มเมนู"
          onPress={() => navigation.navigate(ROUTES.menuForm, {})}
        />
      ),
    });
  }, [navigation]);

  async function handleToggle(item, value) {
    try {
      await setMenuItemAvailable(db, item.id, value);
      await load();
    } catch (error) {
      showError(error);
    }
  }

  return (
    <View style={common.screen}>
      <View style={styles.searchWrap}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="ค้นหาเมนูจากชื่อ"
          placeholderTextColor={colors.slate}
          style={common.input}
        />
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={common.emptyBox}>
            <Text style={common.emptyTitle}>ไม่พบเมนู</Text>
            <Text style={common.emptyText}>ลองเปลี่ยนคำค้นหา หรือกด "เพิ่มเมนู"</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.row, item.is_available !== 1 && styles.rowSoldOut]}>
            <MenuPhoto image={item.image} style={styles.photo} />
            <View style={styles.body}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.meta}>{item.category_name}</Text>
              <Text style={styles.price}>{formatBaht(item.price)}</Text>
            </View>
            <Pressable
              accessibilityLabel={`แก้ไข ${item.name}`}
              onPress={() => navigation.navigate(ROUTES.menuForm, { menuItemId: item.id })}
              style={styles.edit}
            >
              <Text style={styles.editText}>แก้ไข</Text>
            </Pressable>
            <View style={styles.switchBox}>
              <Switch
                value={item.is_available === 1}
                onValueChange={(value) => handleToggle(item, value)}
                trackColor={{ false: colors.line, true: colors.jade }}
              />
              <Text style={styles.switchLabel}>
                {item.is_available === 1 ? "เปิดขาย" : "ปิดขาย"}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}