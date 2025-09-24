import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginAdmScreen from "../pages/admin/LoginAdmScreen";
import BottomTabsAdm from "./BottomTabsAdm";
import BottomTabsFuncionario from "./BottomTabsFuncionario";
import LoginFuncionarioScreen from "../pages/funcionarios/LoginMagicLink";

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  return (
    //Administrador
    <Stack.Navigator
      initialRouteName="LoginAdm"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="LoginAdm" component={LoginAdmScreen} />
      <Stack.Screen name="AdminTabs" component={BottomTabsAdm} />
      <Stack.Screen name="FuncionarioTabs" component={BottomTabsFuncionario} />
      <Stack.Screen
        name="LoginFuncionario"
        component={LoginFuncionarioScreen}
      />
    </Stack.Navigator>
  );
}
