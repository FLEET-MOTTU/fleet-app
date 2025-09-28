import { NavigationContainer } from "@react-navigation/native";
import { AppNavigator } from "./app/routes/AppNavigator";
import "./global.css";
import { useFonts } from "expo-font";
import {
  Manrope_200ExtraLight,
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from "@expo-google-fonts/manrope";
import { StatusBar } from "expo-status-bar";

const linking = {
  prefixes: ["exp://192.168.15.19:8081", "fleetapp://"],
  config: {
    screens: {
      HomeFuncionario: {
        path: "login-success",
        parse: {
          token: (token: string) => token,
        },
      },
    },
  },
};

export default function App() {
  let [fontsLoaded] = useFonts({
    Manrope_200ExtraLight,
    Manrope_300Light,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null; // ou um componente de loading
  }

  return (
    <NavigationContainer linking={linking}>
      <AppNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
