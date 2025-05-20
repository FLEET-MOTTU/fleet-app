import { NavigationContainer } from "@react-navigation/native";
import { AppNavigator } from "./app/routes/AppNavigator";
import "./global.css";

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
