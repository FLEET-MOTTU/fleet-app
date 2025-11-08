// app/Funcionario/Scanner/index.tsx
import { useEffect, useRef } from "react";
import { View, Text, ActivityIndicator, Image } from "react-native";

function gerarTagAleatoria() {
  // Ex.: TAG_MOTTU_ + 6 bytes hex (12 chars) → TAG_MOTTU_3FA12C9B77E0
  const bytes = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0")
  )
    .join("")
    .toUpperCase();
  return `TAG_MOTTU_${bytes}`;
}

export default function Scanner({ navigation }: any) {
  const navegou = useRef(false);

  useEffect(() => {
    const rnd = Math.random().toString(16).slice(2, 8).toUpperCase();
    const tag = `TAG_MOTTU_${rnd}`;
    const t = setTimeout(
      () => navigation.navigate("RegistroMoto", { tagCodigo: tag }),
      1500
    );
    return () => clearTimeout(t);
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-white dark:bg-black">
      <Text className="text-2xl font-bold mb-4">Scanner Tag</Text>
      <Text className="text-gray-500 mb-6 text-center">
        Aproxime o dispositivo da moto
      </Text>
      <Image
        source={require("./assets/tagBLE.png")}
        style={{ width: 220, height: 220 }}
      />
      <Text className="mt-6 text-gray-600">Scaneando código...</Text>
      <ActivityIndicator size="large" className="mt-4" />
    </View>
  );
}
