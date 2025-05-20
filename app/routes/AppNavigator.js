import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeAdmScreen from "../pages/admin/HomeAdmScreen";
import LoginAdmScreen from "../pages/admin/LoginAdmScreen";

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="LoginAdm"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="LoginAdm" component={LoginAdmScreen} />
      <Stack.Screen name="HomeAdm" component={HomeAdmScreen} />
    </Stack.Navigator>
  );
}
