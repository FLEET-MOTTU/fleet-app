import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CadastroFuncionarioScreen from "../pages/admin/CadastroFuncionarioScreen";
import DelimitacaoZonasScreen from "../pages/admin/DelimitacaoZonasScreen";
import HomeAdmScreen from "../pages/admin/HomeAdmScreen";
import ListagemFuncionariosScreen from "../pages/admin/ListagemFuncionariosScreen";
import LoginAdmScreen from "../pages/admin/LoginAdmScreen";

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="HomeAdm"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="LoginAdm" component={LoginAdmScreen} />
      <Stack.Screen name="HomeAdm" component={HomeAdmScreen} />
      <Stack.Screen
        name="CadastroFuncionario"
        component={CadastroFuncionarioScreen}
      />
      <Stack.Screen
        name="ListagemFuncionarios"
        component={ListagemFuncionariosScreen}
      />
      <Stack.Screen
        name="DelimitacaoZonas"
        component={DelimitacaoZonasScreen}
      />
    </Stack.Navigator>
  );
}
