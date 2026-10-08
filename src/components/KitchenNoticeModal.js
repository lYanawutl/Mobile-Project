import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import NoticeCard from "./NoticeCard";
import { common } from "../styles/commonStyles";
import { styles } from "../styles/kitchenNoticeModalStyles";
import { formatDateTime } from "../utils/format";

export default function KitchenNoticeModal({ visible, notices, onClose, onAcknowledge }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.panel}>
          <Text style={styles.title}>การแจ้งเตือน</Text>
          <ScrollView contentContainerStyle={styles.list}>
            {notices.length === 0 && <Text style={styles.empty}>ไม่มีการแจ้งเตือนใหม่</Text>}
            {notices.map((notice) => (
              <NoticeCard
                key={notice.id}
                title={`ลูกค้ายกเลิก · โต๊ะ ${notice.table_no} รอบ ${notice.round_no}`}
                lines={[`${notice.name} ×${notice.quantity}`]}
                note={`เหตุผล: ${notice.cancel_reason} · ${formatDateTime(notice.cancelled_at)}`}
                onAction={() => onAcknowledge(notice)}
              />
            ))}
          </ScrollView>
          <Pressable
            accessibilityLabel="ปิดการแจ้งเตือน"
            onPress={onClose}
            style={[common.button, common.buttonOutline]}
          >
            <Text style={[common.buttonText, common.buttonOutlineText]}>ปิด</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
