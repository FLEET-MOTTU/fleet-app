// app/Funcionario/ZonaDestinada/index.tsx
import { View, Text, TouchableOpacity, Image } from "react-native";
import SafeAreaWrapper from "../../../utils/safeAreaWrapper";
import AppHeader from "../../../components/AppHeader";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function ZonaDestinada() {
  const navigation = useNavigation<any>();
  const { params } = useRoute<any>();
  const { zonaId, zonaNome, placa, modeloLabel } = params || {};

  return (
    <SafeAreaWrapper>
      <AppHeader title="Zona destinada" showBack />
      <View className="px-4 mt-4">
        <Image
          source={{
            uri: "https://www.belgo.com.br/wp-content/uploads/2024/06/225933-pisos-de-subsolo-de-edificios-como-planejar-e-executar.jpg",
          }}
          style={{ width: "100%", height: 180, borderRadius: 16 }}
        />
        <View className="items-center -mt-6 mb-4">
          <View className="w-12 h-12 rounded-full bg-[#130F26] items-center justify-center">
            <Text className="text-white"></Text>
          </View>
        </View>

        <Text className="text-2xl font-bold text-[#111827] dark:text-white">
          {zonaNome}
        </Text>
        <Text className="text-gray-500 dark:text-gray-300 mb-4">
          pátio do funcionário
        </Text>

        <View className="flex-row gap-2 mb-6">
          <View className="px-3 py-2 rounded-lg bg-[#130F26]">
            <Text className="text-white">{modeloLabel}</Text>
          </View>
          <View className="px-3 py-2 rounded-lg bg-[#130F26]">
            <Text className="text-white">{placa}</Text>
          </View>
        </View>

        <Text className="text-lg font-semibold mb-2 dark:text-white">
          Informações
        </Text>
        <Text className="text-gray-600 dark:text-gray-300 mb-8">
          Leve a moto para a zona indicada. Ao chegar, confirme a entrega.
        </Text>

        <TouchableOpacity
          className="bg-[#130F26] py-4 rounded-xl"
          onPress={() =>
            navigation.navigate("MotosDoFuncionario", { zonaId, zonaNome })
          }
        >
          <Text className="text-white text-center font-semibold">
            Motos entregues
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaWrapper>
  );
}
