import { Pressable, ScrollView, Text } from "react-native";
import MenuPhoto from "./MenuPhoto";
import { styles } from "../styles/menuImagePickerStyles";
import { MENU_IMAGE_NAMES } from "../utils/menuImages";

export default function MenuImagePicker({ value, onChange }) {
  if (MENU_IMAGE_NAMES.length === 0) {
    return (
      <Text style={styles.empty}>
        ยังไม่มีรูปในแอป วางไฟล์รูปในโฟลเดอร์ lip/ แล้วรัน npm run images
      </Text>
    );
  }

  const choices = [null, ...MENU_IMAGE_NAMES];
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {choices.map((name) => {
        const active = value === name;
        const label = name ?? "ไม่มีรูป";
        return (
          <Pressable
            key={label}
            accessibilityLabel={`รูป ${label}`}
            onPress={() => onChange(name)}
            style={[styles.option, active && styles.optionActive]}
          >
            <MenuPhoto image={name} style={styles.thumb} />
            <Text style={styles.name} numberOfLines={1}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
