import { Pressable, Text, View } from "react-native";
import MenuPhoto from "./MenuPhoto";
import { styles } from "../styles/menuItemCardStyles";
import { formatBaht } from "../utils/format";

export default function MenuItemCard({ item, onPress }) {
  const available = item.is_available === 1;

  return (
    <Pressable
      accessibilityLabel={item.name}
      disabled={!available}
      onPress={() => onPress(item)}
      style={[styles.card, !available && styles.cardSoldOut]}
    >
      <MenuPhoto image={item.image} style={styles.photo} />
      <View style={styles.body}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{formatBaht(item.price)}</Text>
        {!available && <Text style={styles.soldOut}>ปิดการขายชั่วคราว</Text>}
      </View>
    </Pressable>
  );
}
