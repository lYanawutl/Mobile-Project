import { Image, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/menuPhotoStyles";
import { colors } from "../styles/theme";
import { getMenuImage } from "../utils/menuImages";

export default function MenuPhoto({ image, style, iconSize = 26 }) {
  const source = getMenuImage(image);

  if (!source) {
    return (
      <View style={[style, styles.placeholder]}>
        <Ionicons
          name="restaurant-outline"
          size={iconSize}
          color={colors.slate}
        />
      </View>
    );
  }

  return (
    <View style={[style, styles.frame]}>
      <Image source={source} style={styles.fill} resizeMode="cover" />
    </View>
  );
}
