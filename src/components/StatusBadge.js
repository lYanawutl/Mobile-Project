import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/statusBadgeStyles";
import { colors } from "../styles/theme";
import { ORDER_STATUS, STATUS_LABEL } from "../utils/status";

const VARIANT = {
  [ORDER_STATUS.pending]: [
    styles.pending,
    styles.pendingText,
    "time-outline",
    colors.inkSoft,
  ],
  [ORDER_STATUS.cooking]: [
    styles.cooking,
    styles.cookingText,
    "flame",
    colors.chili,
  ],
  [ORDER_STATUS.ready]: [
    styles.ready,
    styles.readyText,
    "checkmark-circle",
    colors.jade,
  ],
  [ORDER_STATUS.served]: [
    styles.served,
    styles.servedText,
    "checkmark-done",
    colors.surface,
  ],
  [ORDER_STATUS.cancelled]: [
    styles.cancelled,
    styles.cancelledText,
    "close-circle-outline",
    colors.slate,
  ],
};

export default function StatusBadge({ status, size }) {
  const [badgeStyle, textStyle, icon, iconColor] = VARIANT[status];
  const small = size === "small";
  return (
    <View style={[styles.badge, small && styles.badgeSmall, badgeStyle]}>
      <Ionicons name={icon} size={small ? 12 : 14} color={iconColor} />
      <Text style={[styles.text, small && styles.textSmall, textStyle]}>
        {STATUS_LABEL[status]}
      </Text>
    </View>
  );
}
