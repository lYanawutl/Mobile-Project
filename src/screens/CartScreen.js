import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CartPanel from "../components/CartPanel";
import { ROUTES } from "../navigation/routes";
import { common } from "../styles/commonStyles";

export default function CartScreen({ navigation, route }) {
  const { billId } = route.params;
  const insets = useSafeAreaInsets();

  return (
    <View style={[common.screen, { paddingBottom: insets.bottom }]}>
      <CartPanel
        billId={billId}
        onSent={() => navigation.replace(ROUTES.bill, { billId })}
        onBrowseMenu={() => navigation.goBack()}
      />
    </View>
  );
}
