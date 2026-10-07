import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MenuPhoto from "./MenuPhoto";
import QuantityStepper from "./QuantityStepper";
import { common } from "../styles/commonStyles";
import { styles } from "../styles/menuItemSheetStyles";
import { colors } from "../styles/theme";
import { formatBaht } from "../utils/format";

export default function MenuItemSheet({
  visible,
  item,
  options,
  onClose,
  onAdd,
}) {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (visible) {
      setQuantity(1);
      setNote("");
      setSelectedIds([]);
    }
  }, [visible, item?.id]);

  if (!item) {
    return null;
  }

  function toggleOption(optionId) {
    setSelectedIds((current) =>
      current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId],
    );
  }

  function handleAdd() {
    onAdd({
      menuItemId: item.id,
      quantity,
      note: note.trim(),
      optionIds: selectedIds,
    });
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.backdrop}
      >
        <Pressable
          accessibilityLabel="ปิด"
          style={styles.backdrop}
          onPress={onClose}
        />
        <View style={styles.sheet}>
          <ScrollView
            contentContainerStyle={styles.sheetContent}
            keyboardShouldPersistTaps="handled"
          >
            {item.image && (
              <MenuPhoto
                image={item.image}
                style={styles.photo}
                iconSize={40}
              />
            )}
            <View>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.price}>{formatBaht(item.price)}</Text>
            </View>

            {options.length > 0 && (
              <View>
                <Text style={styles.sectionLabel}>เพิ่มเติม</Text>
                {options.map((option) => {
                  const checked = selectedIds.includes(option.id);
                  return (
                    <Pressable
                      key={option.id}
                      accessibilityLabel={option.name}
                      onPress={() => toggleOption(option.id)}
                      style={styles.optionRow}
                    >
                      <Ionicons
                        name={checked ? "checkbox" : "square-outline"}
                        size={24}
                        color={checked ? colors.chili : colors.slate}
                      />
                      <Text style={styles.optionName}>{option.name}</Text>
                      <Text style={styles.optionPrice}>
                        +{formatBaht(option.price_delta)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}

            <View>
              <Text style={common.label}>หมายเหตุถึงครัว</Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="เช่น ไม่ใส่ผักชี เผ็ดน้อย"
                placeholderTextColor={colors.slate}
                style={common.input}
              />
            </View>

            <View style={styles.footer}>
              <QuantityStepper value={quantity} onChange={setQuantity} />
              <Pressable
                accessibilityLabel="ใส่ตะกร้า"
                onPress={handleAdd}
                style={[common.button, styles.addButton]}
              >
                <Text style={common.buttonText}>ใส่ตะกร้า</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
