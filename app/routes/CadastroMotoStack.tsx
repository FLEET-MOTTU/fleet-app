import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Scanner from "../pages/funcionarios/Scanner";
import RegistroMoto from "../pages/funcionarios/Registro";
import ResumoCadastro from "../pages/funcionarios/ResumoCadastro";

const Stack = createNativeStackNavigator();

export default function CadastroMotoStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Scanner" component={Scanner} />
      <Stack.Screen name="RegistroMoto" component={RegistroMoto} />
      <Stack.Screen name="ResumoCadastro" component={ResumoCadastro} />
    </Stack.Navigator>
  );
}
