import { Pressable, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ROUTES } from "../navigation/routes";
import { common } from "../styles/commonStyles";
import { colors, layout } from "../styles/theme";
import { styles } from "../styles/welcomeStyles";

const SHOP_NAME = "ครัวตามสั่ง";

export default function WelcomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWide = width >= layout.wideBreakpoint;

  function startOrdering() {
    navigation.navigate(ROUTES.main, { screen: ROUTES.customerTab });
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={[styles.content, isWide && styles.contentWide]}>
        <View style={[styles.plate, isWide && styles.plateWide]}>
          <View style={[styles.plateInner, isWide && styles.plateInnerWide]}>
            <Ionicons
              name="restaurant"
              size={isWide ? 96 : 72}
              color={colors.chili}
            />
          </View>
        </View>

        <View style={[styles.textBlock, isWide && styles.textBlockWide]}>
          <Text style={styles.eyebrow}>ยินดีต้อนรับสู่</Text>
          <Text style={styles.title}>{SHOP_NAME}</Text>
          <Text style={[styles.subtitle, isWide && styles.subtitleWide]}>
            เลือกเมนูจากโต๊ะ ส่งเข้าครัวได้ทันที และสั่งเพิ่มได้ตลอดมื้อ
          </Text>

          <View style={styles.actions}>
            <Pressable
              accessibilityLabel="เริ่มสั่งอาหาร"
              onPress={startOrdering}
              style={[common.button, styles.primaryButton]}
            >
              <Text style={[common.buttonText, styles.primaryText]}>
                เริ่มสั่งอาหาร
              </Text>
            </Pressable>
          </View>

          <View style={styles.footnote}>
            <Ionicons
              name="cloud-offline-outline"
              size={16}
              color={colors.slate}
            />
            <Text style={styles.footnoteText}>
              ใช้งานได้แม้ไม่มีอินเทอร์เน็ต
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
