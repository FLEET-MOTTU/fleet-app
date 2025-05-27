import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity } from "react-native";

export default function BotaoLogout() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userRole");
    navigation.reset({
      index: 0,
      routes: [{ name: "LoginAdm" }],
    });
  };

  return (
    <TouchableOpacity
      onPress={handleLogout}
      style={{
        marginTop: 24,
        backgroundColor: "#DC2626",
        paddingVertical: 12,
        borderRadius: 12,
      }}
    >
      <Text style={{ textAlign: "center", color: "#FFF", fontWeight: "600" }}>
        Sair
      </Text>
    </TouchableOpacity>
  );
}
