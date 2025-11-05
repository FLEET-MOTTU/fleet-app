import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./navigation";

import LoginAdmScreen from "../pages/admin/Login";
import BottomTabsAdm from "./BottomTabsAdm";
import BottomTabsFuncionario from "./BottomTabsFuncionario";
import LoginFuncionarioScreen from "../pages/funcionarios/LoginMagicLink";
import ChangePassword from "../pages/admin/ChangePassword";
import Configuracoes from "../pages/configuration";
import Warning from "../pages/admin/ForgotPassword/Warning";
import ListagemFuncionarios from "../pages/admin/CadastroFuncionario";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginAdm" component={LoginAdmScreen} />
      <Stack.Screen name="AdminTabs" component={BottomTabsAdm} />
      <Stack.Screen name="FuncionarioTabs" component={BottomTabsFuncionario} />
      <Stack.Screen
        name="CadastrarFuncionario"
        component={ListagemFuncionarios}
      />
      <Stack.Screen
        name="LoginFuncionario"
        component={LoginFuncionarioScreen}
      />
      <Stack.Screen name="Configuration" component={Configuracoes} />

      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="Warning" component={Warning} />
    </Stack.Navigator>
  );
}
