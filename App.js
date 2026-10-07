import { SQLiteProvider } from "expo-sqlite";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { CartProvider } from "./src/context/CartContext";
import { NoticeProvider } from "./src/context/NoticeContext";
import { DATABASE_NAME, initDB } from "./src/db/database";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <SQLiteProvider databaseName={DATABASE_NAME} onInit={initDB}>
      <SafeAreaProvider>
        <CartProvider>
          <NoticeProvider>
            <StatusBar style="dark" />
            <AppNavigator />
          </NoticeProvider>
        </CartProvider>
      </SafeAreaProvider>
    </SQLiteProvider>
  );
}
