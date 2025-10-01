import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./navigation";

import LoginAdmScreen from "../pages/admin/Login";
import BottomTabsAdm from "./BottomTabsAdm";
import BottomTabsFuncionario from "./BottomTabsFuncionario";
import LoginFuncionarioScreen from "../pages/funcionarios/LoginMagicLink";
import HomeFuncionarioScreen from "../pages/funcionarios/Home";
import { useMagicLink } from "../hooks/useMagicLink";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  useMagicLink();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginAdm" component={LoginAdmScreen} />
      <Stack.Screen name="AdminTabs" component={BottomTabsAdm} />
      <Stack.Screen name="FuncionarioTabs" component={BottomTabsFuncionario} />
      <Stack.Screen
        name="LoginFuncionario"
        component={LoginFuncionarioScreen}
      />
      {/* se já tiver HomeFuncionario, pode adicionar também */}
      <Stack.Screen name="HomeFuncionario" component={HomeFuncionarioScreen} />
    </Stack.Navigator>
  );
}
