import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import HomeFuncionarioScreen from "../pages/funcionarios/Home";
import ListagemMotosScreen from "../pages/funcionarios/ListagemMotosScreen";
import Scanner from "../pages/funcionarios/Scanner";
import RegistroMoto from "../pages/funcionarios/Registro";
import ResumoCadastro from "../pages/funcionarios/ResumoCadastro";

const Tab = createBottomTabNavigator();
const CadastroStack = createNativeStackNavigator();

function CadastroMotoStack() {
  return (
    <CadastroStack.Navigator screenOptions={{ headerShown: false }}>
      <CadastroStack.Screen name="Scanner" component={Scanner} />
      <CadastroStack.Screen name="RegistroMoto" component={RegistroMoto} />
      <CadastroStack.Screen name="ResumoCadastro" component={ResumoCadastro} />
    </CadastroStack.Navigator>
  );
}

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
        component={Scanner}
        options={{ title: "Cadastrar Moto" }}
      />
      <Tab.Screen
        name="ListagemMotos"
        component={ListagemMotosScreen}
        options={{ title: "Minhas Motos" }}
      />
    </Tab.Navigator>
  );
}
