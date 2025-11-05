import { NavigationContainer } from "@react-navigation/native";
import { AppNavigator } from "./app/routes/AppNavigator";
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
import { View, Text } from "react-native";

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

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Carregando fontes...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      <AppNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
