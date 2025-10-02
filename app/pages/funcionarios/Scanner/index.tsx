import { useEffect } from "react";
import { View, Text, ActivityIndicator, Image } from "react-native";

export default function Scanner({ navigation }: any) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("RegistroMoto");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold mb-4">Scanner Tag</Text>
      <Text className="text-gray-500 mb-6">
        Aproxime seu dispositivo próximo a uma moto
      </Text>
      <Image
        source={require("./assets/tagBLE.png")}
        style={{ width: 220, height: 220 }}
      />
      <Text className="mt-6 text-gray-600">Scaneando código...</Text>
      <ActivityIndicator size="large" color="#000" className="mt-4" />
    </View>
  );
}
