import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { common } from "../styles/commonStyles";
import { styles } from "../styles/cancelReasonModalStyles";
import { colors } from "../styles/theme";

// หน้าต่างกรอกเหตุผลยกเลิกรายการ (ข3) ใช้ร่วมกันทั้งฝั่งลูกค้าและฝั่งครัว
// ต้องมีเหตุผลก่อนจึงกดยืนยันได้ มีปุ่มลัดให้เลือก
export default function CancelReasonModal({
  visible,
  itemLabel,
  quickReasons,
  onClose,
  onSubmit,
}) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (visible) {
      setReason("");
    }
  }, [visible]);

  const canSubmit = reason.trim().length > 0;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.backdrop}
      >
        <View style={styles.panel}>
          <View>
            <Text style={styles.title}>ยกเลิกรายการ</Text>
            <Text style={styles.itemName}>{itemLabel}</Text>
          </View>

          <View style={styles.chipRow}>
            {quickReasons.map((quick) => (
              <Pressable
                key={quick}
                accessibilityLabel={quick}
                onPress={() => setReason(quick)}
                style={[common.chip, reason === quick && common.chipActive]}
              >
                <Text style={[common.chipText, reason === quick && common.chipTextActive]}>
                  {quick}
                </Text>
              </Pressable>
            ))}
          </View>

          <View>
            <Text style={common.label}>เหตุผล</Text>
            <TextInput
              value={reason}
              onChangeText={setReason}
              placeholder="พิมพ์เหตุผลที่ยกเลิก"
              placeholderTextColor={colors.slate}
              style={common.input}
            />
          </View>

          <View style={styles.actions}>
            <Pressable
              accessibilityLabel="ไม่ยกเลิก"
              onPress={onClose}
              style={[common.button, common.buttonOutline, styles.action]}
            >
              <Text style={[common.buttonText, common.buttonOutlineText]}>ไม่ยกเลิก</Text>
            </Pressable>
            <Pressable
              accessibilityLabel="ยืนยันยกเลิก"
              disabled={!canSubmit}
              onPress={() => onSubmit(reason.trim())}
              style={[common.button, styles.action, !canSubmit && common.buttonDisabled]}
            >
              <Text style={[common.buttonText, !canSubmit && common.buttonDisabledText]}>
                ยืนยันยกเลิก
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
