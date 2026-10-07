import { Pressable, Text } from "react-native";
import { common } from "../styles/commonStyles";

// ปุ่มข้อความสำหรับ headerRight ของแถบหัว เช่น "บิล" "เพิ่มเมนู"
export default function HeaderTextButton({ label, accessibilityLabel, onPress }) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={common.headerButton}
    >
      <Text style={common.headerButtonText}>{label}</Text>
    </Pressable>
  );
}
