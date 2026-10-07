import { Pressable, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "../styles/kitchenFilterTabsStyles";
import { colors } from "../styles/theme";
import { KITCHEN_FILTER } from "../utils/kitchen";

const TABS = [
  {
    key: KITCHEN_FILTER.all,
    label: "ทั้งหมด",
    icon: "room-service-outline",
    family: "mci",
    color: colors.ink,
  },
  {
    key: KITCHEN_FILTER.cooking,
    label: "กำลังทำ",
    icon: "flame",
    color: colors.chili,
  },
  {
    key: KITCHEN_FILTER.ready,
    label: "พร้อมเสิร์ฟ",
    icon: "checkmark-circle-outline",
    color: colors.jade,
  },
  {
    key: KITCHEN_FILTER.pending,
    label: "รอทำ",
    icon: "time-outline",
    color: colors.inkSoft,
  },
];

export default function KitchenFilterTabs({ value, counts, onChange }) {
  return (
    <View style={styles.row}>
      {TABS.map((tab) => {
        const active = value === tab.key;
        const iconColor = active ? colors.surface : tab.color;
        const Icon = tab.family === "mci" ? MaterialCommunityIcons : Ionicons;
        return (
          <Pressable
            key={tab.key}
            accessibilityLabel={`ตัวกรอง ${tab.label}`}
            onPress={() => onChange(tab.key)}
            style={[styles.tab, active && styles.tabActive]}
          >
            <Icon name={tab.icon} size={22} color={iconColor} />
            <Text style={[styles.label, active && styles.labelActive]}>
              {tab.label}
            </Text>
            <View style={[styles.count, active && styles.countActive]}>
              <Text style={styles.countText}>{counts[tab.key]}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
