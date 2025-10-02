import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";

import HomeFuncionarioScreen from "../pages/funcionarios/Home";
import CadastroMotoStack from "./CadastroMotoStack";

const Tab = createBottomTabNavigator();

export default function BottomTabsFuncionario() {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();

  const isDark = scheme === "dark";
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#65A3E0C2",
        tabBarInactiveTintColor: isDark ? "#9CA3AF" : "#94A3B8",
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: {
          backgroundColor: "#130F26",
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 5,
          paddingTop: 5,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case "HomeFuncionario":
              iconName = "home-outline";
              break;
            case "CadastroMoto":
              iconName = "bicycle-outline";
              break;
            case "ListagemMotos":
              iconName = "list-outline";
              break;
            default:
              iconName = "ellipse-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeFuncionario"
        component={HomeFuncionarioScreen}
        options={{ title: "Início" }}
      />
      <Tab.Screen
        name="CadastroMoto"
        component={CadastroMotoStack}
        options={{ title: "Cadastrar Moto" }}
      />
    </Tab.Navigator>
  );
}
