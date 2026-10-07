import { Pressable, Text } from "react-native";
import { common } from "../styles/commonStyles";

export default function HeaderTextButton({
  label,
  accessibilityLabel,
  onPress,
}) {
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
