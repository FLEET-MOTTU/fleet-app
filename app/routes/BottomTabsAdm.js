import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";

import HomeAdmScreen from "../pages/admin/Home";
import ListagemFuncionariosScreen from "../pages/admin/ListagemFuncionariosScreen";
import DelimitacaoZonasScreen from "../pages/admin/Zonas/DelimitacaoZonasScreen";
import ListagemFuncionarios from "../pages/admin/CadastroFuncionario";

const Tab = createBottomTabNavigator();

export default function BottomTabsAdm() {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme(); // retorna "light" ou "dark"

  const isDark = scheme === "dark";

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#65A3E0C2", // azul mais claro no dark
        tabBarInactiveTintColor: isDark ? "#9CA3AF" : "#94A3B8",
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: {
          backgroundColor: "#130F26", // fundo da tab
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 5,
          paddingTop: 5,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case "HomeAdm":
              iconName = "home-outline";
              break;
            case "ListagemFuncionarios":
              iconName = "people-outline";
              break;
            case "DelimitacaoZonas":
              iconName = "map-outline";
              break;
            default:
              iconName = "ellipse-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeAdm"
        component={HomeAdmScreen}
        options={{ title: "Início" }}
      />
      <Tab.Screen
        name="ListagemFuncionarios"
        component={ListagemFuncionarios}
        options={{ title: "Funcionários" }}
      />
      <Tab.Screen
        name="DelimitacaoZonas"
        component={DelimitacaoZonasScreen}
        options={{ title: "Zonas" }}
      />
    </Tab.Navigator>
  );
}
