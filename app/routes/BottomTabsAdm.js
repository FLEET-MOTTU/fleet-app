import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HomeAdmScreen from "../pages/admin/HomeAdmScreen";
import ListagemFuncionariosScreen from "../pages/admin/ListagemFuncionariosScreen";
import DelimitacaoZonasScreen from "../pages/admin/DelimitacaoZonasScreen";
import ListagemFuncionarios from "../pages/admin/CadastroFuncionario/pages/ListagemFuncionario";

const Tab = createBottomTabNavigator();

export default function BottomTabsAdm() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: {
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
