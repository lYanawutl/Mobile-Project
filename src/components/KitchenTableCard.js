import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MenuPhoto from "./MenuPhoto";
import StatusBadge from "./StatusBadge";
import { styles } from "../styles/kitchenTableCardStyles";
import { colors } from "../styles/theme";
import { formatTime, formatWaiting } from "../utils/format";

const MAX_VISIBLE_ITEMS = 4;

export default function KitchenTableCard({ table, selected, now, onPress }) {
  const visibleItems = table.items.slice(0, MAX_VISIBLE_ITEMS);
  const hiddenCount = table.items.length - visibleItems.length;

  return (
    <Pressable
      accessibilityLabel={`โต๊ะ ${table.tableNo} ในครัว`}
      onPress={onPress}
      style={[styles.card, selected && styles.cardSelected]}
    >
      <View style={styles.left}>
        <View style={styles.tableChip}>
          <Text style={styles.tableChipText}>โต๊ะ {table.tableNo}</Text>
        </View>
        <Text style={styles.meta}>สั่งเมื่อ {formatTime(table.firstOrderedAt)}</Text>
        <View style={styles.metaRow}>
          <Ionicons name="person" size={14} color={colors.inkSoft} />
          <Text style={styles.meta}>{table.guestCount} คน</Text>
        </View>
      </View>

      <MenuPhoto image={table.items[0].image} style={styles.photo} />

      <View style={styles.items}>
        <Text style={styles.itemsTitle}>รายการอาหาร ({table.items.length} รายการ)</Text>
        {visibleItems.map((item, index) => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={styles.itemName}>
              {index + 1}. {item.name}
              {item.quantity > 1 ? ` ×${item.quantity}` : ""}
            </Text>
            <StatusBadge status={item.status} size="small" />
          </View>
        ))}
        {hiddenCount > 0 && <Text style={styles.more}>และอีก {hiddenCount} รายการ</Text>}
      </View>

      <View style={styles.right}>
        <StatusBadge status={table.status} />
        <View style={styles.metaRow}>
          <Ionicons name="timer-outline" size={14} color={colors.inkSoft} />
          <Text style={styles.meta}>{formatWaiting(table.firstOrderedAt, now)}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color={colors.inkSoft} />
    </Pressable>
  );
}
