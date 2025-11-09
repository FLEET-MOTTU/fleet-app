import { NavigationContainer } from "@react-navigation/native";
import { AppNavigator } from "./app/routes/AppNavigator";
import * as Notifications from "expo-notifications";
import "./global.css";
import "./app/locales/i18n";

import {
  useFonts,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";

import { StatusBar } from "expo-status-bar";
import { View, Text, Alert, Platform } from "react-native";
import { useEffect } from "react";

// Configuração do deep link
const linking = {
  prefixes: ["fleetapp://", "exp://192.168.15.21:8081/--/"],
  config: {
    screens: {
      LoginFuncionario: {
        path: "login-success",
        parse: { code: (code: string) => code },
      },
    },
  },
};

// 🔔 Define o comportamento padrão das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  // ✅ Sempre no topo: useEffect global para configurar notificações
  useEffect(() => {
    let alreadyTriggered = false;

    const setupNotifications = async () => {
      if (alreadyTriggered) return;
      alreadyTriggered = true;

      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        const { status: newStatus } =
          await Notifications.requestPermissionsAsync();
        if (newStatus !== "granted") return;
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Notificações padrão",
          importance: Notifications.AndroidImportance.HIGH,
        });
      }
    };

    setupNotifications();
  }, []);

  // Exibe tela de loading enquanto fontes carregam
  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Carregando fontes...</Text>
      </View>
    );
  }

  // App principal
  return (
    <NavigationContainer linking={linking}>
      <AppNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
