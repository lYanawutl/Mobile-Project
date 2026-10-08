import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MenuPhoto from "./MenuPhoto";
import OrderProgress from "./OrderProgress";
import StatusBadge from "./StatusBadge";
import { common } from "../styles/commonStyles";
import { styles } from "../styles/kitchenTableDetailStyles";
import { colors } from "../styles/theme";
import { formatBaht, formatTime } from "../utils/format";
import { ITEM_ACTION_LABEL, primaryActionOf } from "../utils/kitchen";
import { ORDER_STATUS } from "../utils/status";

export default function KitchenTableDetail({ table, onAdvanceItem, onItemMenu, onPrimaryAction }) {
  const primary = primaryActionOf(table.items);

  return (
    <View style={styles.panel}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>โต๊ะ {table.tableNo}</Text>
            <View style={styles.metaRow}>
              <Ionicons name="person" size={14} color={colors.inkSoft} />
              <Text style={styles.meta}>{table.guestCount} คน</Text>
              <Ionicons name="timer-outline" size={14} color={colors.inkSoft} />
              <Text style={styles.meta}>สั่งเมื่อ {formatTime(table.firstOrderedAt)}</Text>
            </View>
          </View>
          <StatusBadge status={table.status} />
        </View>

        <OrderProgress status={table.status} orderedAt={table.firstOrderedAt} />

        <View style={styles.itemsCard}>
          <Text style={styles.sectionTitle}>รายการอาหาร ({table.items.length} รายการ)</Text>
          {table.items.map((item) => (
            <View key={item.id} style={styles.row}>
              <MenuPhoto image={item.image} style={styles.rowPhoto} />
              <View style={styles.rowBody}>
                <Text style={styles.rowName}>{item.name}</Text>
                <Text style={styles.rowMeta}>
                  ×{item.quantity} · รอบที่ {item.round_no} · {formatTime(item.ordered_at)}
                </Text>
                {item.options_text !== "" && <Text style={styles.rowMeta}>{item.options_text}</Text>}
                {item.note !== "" && <Text style={styles.rowNote}>หมายเหตุ: {item.note}</Text>}
                <StatusBadge status={item.status} size="small" />
              </View>
              <View style={styles.rowSide}>
                <Text style={styles.rowPrice}>{formatBaht(item.line_total)}</Text>
                <Pressable
                  accessibilityLabel={`${ITEM_ACTION_LABEL[item.status]} ${item.name}`}
                  onPress={() => onAdvanceItem(item)}
                  style={styles.rowAction}
                >
                  <Text style={styles.rowActionText}>{ITEM_ACTION_LABEL[item.status]}</Text>
                </Pressable>
              </View>
              <View style={styles.menuButton}>
                {item.status === ORDER_STATUS.pending && (
                  <Pressable accessibilityLabel={`ตัวเลือก ${item.name}`} onPress={() => onItemMenu(item)}>
                    <Ionicons name="ellipsis-vertical" size={20} color={colors.inkSoft} />
                  </Pressable>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {primary && (
        <View style={styles.footer}>
          <Pressable
            accessibilityLabel={primary.label}
            onPress={() => onPrimaryAction(primary)}
            style={[common.button, common.buttonSuccess]}
          >
            <View style={styles.primaryContent}>
              <Ionicons name="checkmark-circle" size={22} color={colors.surface} />
              <Text style={common.buttonText}>{primary.label}</Text>
            </View>
          </Pressable>
        </View>
      )}
    </View>
  );
}
