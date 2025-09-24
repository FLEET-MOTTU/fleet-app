import { NavigationContainer } from "@react-navigation/native";
import { AppNavigator } from "./app/routes/AppNavigator";
import "./global.css";

const linking = {
  prefixes: ["exp://192.168.15.20:8081", "fleetapp://"],
  config: {
    screens: {
      LoginFuncionario: "login-success",
      FuncionarioTabs: "funcionario",
    },
  },
};

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <AppNavigator />
    </NavigationContainer>
  );
}
