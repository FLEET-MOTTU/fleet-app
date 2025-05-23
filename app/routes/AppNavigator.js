import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CadastroFuncionarioScreen from "../pages/admin/CadastroFuncionarioScreen";
import DelimitacaoZonasScreen from "../pages/admin/DelimitacaoZonasScreen";
import HomeAdmScreen from "../pages/admin/HomeAdmScreen";
import ListagemFuncionariosScreen from "../pages/admin/ListagemFuncionariosScreen";
import LoginAdmScreen from "../pages/admin/LoginAdmScreen";
import CadastroMotoScreen from "../pages/funcionarios/CadastroMotoScreen";
import HomeFuncionarioScreen from "../pages/funcionarios/HomeFuncionarioScreen";

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  return (
    //Administrador
    <Stack.Navigator
      initialRouteName="HomeFuncionario"
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
      {/*Funcionarios*/}
      <Stack.Screen name="HomeFuncionario" component={HomeFuncionarioScreen} />
      <Stack.Screen name="CadastroMoto" component={CadastroMotoScreen} />
    </Stack.Navigator>
  );
}
