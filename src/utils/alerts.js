import { Alert } from "react-native";

export function showError(error) {
  console.warn(error);
  Alert.alert("เกิดข้อผิดพลาด", error?.message ?? String(error));
}

export function confirmAction({
  title,
  message,
  confirmText,
  onConfirm,
  destructive = false,
}) {
  Alert.alert(title, message, [
    { text: "ยกเลิก", style: "cancel" },
    {
      text: confirmText,
      style: destructive ? "destructive" : "default",
      onPress: onConfirm,
    },
  ]);
}
