import { Image, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/menuPhotoStyles";
import { colors } from "../styles/theme";
import { getMenuImage } from "../utils/menuImages";

// รูปเมนูจากไฟล์ที่แพ็กมากับแอป (โฟลเดอร์ lip/) จึงแสดงได้แม้ไม่มีอินเทอร์เน็ต
// image = ชื่อไฟล์ที่เก็บใน menu_items.image ถ้าไม่มี หรือไม่พบไฟล์ แสดงกรอบแทนรูป
//
// ขนาด (style) ใส่ที่ View ครอบ แล้วให้ Image เต็มกรอบ เพราะรูปที่ require() มีขนาดพิกเซลจริงติดมา
// ถ้า style ไม่ได้กำหนด height (เช่นใช้ aspectRatio) Image จะใช้ความสูงจริงของไฟล์ รูปจึงยืดล้นการ์ด
export default function MenuPhoto({ image, style, iconSize = 26 }) {
  const source = getMenuImage(image);

  if (!source) {
    return (
      <View style={[style, styles.placeholder]}>
        <Ionicons name="restaurant-outline" size={iconSize} color={colors.slate} />
      </View>
    );
  }

  return (
    <View style={[style, styles.frame]}>
      <Image source={source} style={styles.fill} resizeMode="cover" />
    </View>
  );
}
