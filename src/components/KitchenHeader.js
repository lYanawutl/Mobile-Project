import { Pressable, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "../styles/kitchenHeaderStyles";
import { colors } from "../styles/theme";

export default function KitchenHeader({ noticeCount, onPressBell }) {
  return (
    <View style={styles.header}>
      <View style={styles.brand}>
        <MaterialCommunityIcons name="chef-hat" size={40} color={colors.ink} />
        <View>
          <Text style={styles.title}>ครัว</Text>
          <Text style={styles.subtitle}>
            จัดการออเดอร์ / เตรียมอาหาร / เสิร์ฟ
          </Text>
        </View>
      </View>
      <Pressable
        accessibilityLabel="การแจ้งเตือน"
        onPress={onPressBell}
        style={styles.bell}
      >
        <Ionicons name="notifications-outline" size={26} color={colors.ink} />
        {noticeCount > 0 && (
          <View style={styles.bellBadge}>
            <Text style={styles.bellBadgeText}>{noticeCount}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}
