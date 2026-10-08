import { Pressable, Text, View } from "react-native";
import MenuPhoto from "./MenuPhoto";
import { styles } from "../styles/menuGridCardStyles";
import { formatBaht } from "../utils/format";

// การ์ดเมนูแบบตาราง (จอกว้าง): รูปด้านบน ชื่อ และราคา
export default function MenuGridCard({ item, onPress }) {
  const available = item.is_available === 1;

  return (
    <Pressable
      accessibilityLabel={item.name}
      disabled={!available}
      onPress={() => onPress(item)}
      style={[styles.card, !available && styles.cardSoldOut]}
    >
      <MenuPhoto image={item.image} style={styles.photo} iconSize={36} />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.price}>{formatBaht(item.price)}</Text>
        {!available && <Text style={styles.soldOut}>ปิดการขายชั่วคราว</Text>}
      </View>
    </Pressable>
  );
}
