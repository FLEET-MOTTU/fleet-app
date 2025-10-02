import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeFuncionarioScreen from "../pages/funcionarios/Home";
import CadastroMotoStack from "./CadastroMotoStack"; // importa o stack

const Tab = createBottomTabNavigator();

export default function BottomTabsFuncionario() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { height: 60, paddingBottom: 5, paddingTop: 5 },
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
