import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useNotices } from "../context/NoticeContext";
import { ROUTES } from "./routes";
import BillScreen from "../screens/BillScreen";
import CartScreen from "../screens/CartScreen";
import KitchenScreen from "../screens/KitchenScreen";
import MenuFormScreen from "../screens/MenuFormScreen";
import MenuManageScreen from "../screens/MenuManageScreen";
import MenuScreen from "../screens/MenuScreen";
import OpenTableScreen from "../screens/OpenTableScreen";
import StoreHomeScreen from "../screens/StoreHomeScreen";
import TableSelectScreen from "../screens/TableSelectScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import { styles } from "../styles/navigationStyles";
import { colors } from "../styles/theme";

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const CustomerStack = createNativeStackNavigator();
const StoreStack = createNativeStackNavigator();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.paper,
    card: colors.paper,
    text: colors.ink,
    border: colors.line,
    primary: colors.chili,
  },
};

const stackOptions = {
  headerStyle: styles.header,
  headerTitleStyle: styles.headerTitle,
  headerTintColor: colors.chili,
  headerShadowVisible: false,
};

function CustomerStackScreen() {
  return (
    <CustomerStack.Navigator screenOptions={stackOptions}>
      <CustomerStack.Screen
        name={ROUTES.tableSelect}
        component={TableSelectScreen}
        options={{ title: "เลือกโต๊ะ", headerShown: false }}
      />
      <CustomerStack.Screen
        name={ROUTES.openTable}
        component={OpenTableScreen}
        options={{
          presentation: "transparentModal",
          animation: "fade",
          headerShown: false,
        }}
      />
      <CustomerStack.Screen
        name={ROUTES.menu}
        component={MenuScreen}
        options={{ title: "เมนู" }}
      />
      <CustomerStack.Screen
        name={ROUTES.cart}
        component={CartScreen}
        options={{ title: "ตะกร้า" }}
      />
      <CustomerStack.Screen
        name={ROUTES.bill}
        component={BillScreen}
        options={{ title: "สรุปบิล" }}
      />
    </CustomerStack.Navigator>
  );
}

function StoreStackScreen() {
  return (
    <StoreStack.Navigator screenOptions={stackOptions}>
      <StoreStack.Screen
        name={ROUTES.storeHome}
        component={StoreHomeScreen}
        options={{ title: "ร้าน" }}
      />
      <StoreStack.Screen
        name={ROUTES.bill}
        component={BillScreen}
        options={{ title: "บิลย้อนหลัง" }}
      />
      <StoreStack.Screen
        name={ROUTES.menuManage}
        component={MenuManageScreen}
        options={{ title: "จัดการเมนู" }}
      />
      <StoreStack.Screen
        name={ROUTES.menuForm}
        component={MenuFormScreen}
        options={{ title: "เมนู" }}
      />
    </StoreStack.Navigator>
  );
}

function tabIcon(name) {
  return ({ color, size }) => (
    <Ionicons name={name} size={size} color={color} />
  );
}

function MainTabs() {
  const { kitchenNoticeCount, refreshKitchenNotices } = useNotices();

  return (
    <Tab.Navigator
      screenListeners={{ focus: () => refreshKitchenNotices() }}
      screenOptions={{
        tabBarActiveTintColor: colors.chili,
        tabBarInactiveTintColor: colors.slate,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerShadowVisible: false,
      }}
    >
      <Tab.Screen
        name={ROUTES.customerTab}
        component={CustomerStackScreen}
        options={{
          title: "ลูกค้า",
          headerShown: false,
          tabBarIcon: tabIcon("restaurant-outline"),
        }}
      />
      <Tab.Screen
        name={ROUTES.kitchenTab}
        component={KitchenScreen}
        options={{
          title: "ครัว",
          headerShown: false,
          tabBarIcon: tabIcon("flame-outline"),
          tabBarBadge: kitchenNoticeCount > 0 ? kitchenNoticeCount : undefined,
          tabBarBadgeStyle: styles.tabBadge,
        }}
      />
      <Tab.Screen
        name={ROUTES.storeTab}
        component={StoreStackScreen}
        options={{
          title: "ร้าน",
          headerShown: false,
          tabBarIcon: tabIcon("storefront-outline"),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name={ROUTES.welcome} component={WelcomeScreen} />
        <RootStack.Screen name={ROUTES.main} component={MainTabs} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
