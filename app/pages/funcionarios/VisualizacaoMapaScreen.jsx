import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function VisualizacaoMapaScreen() {
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarZonas = async () => {
    try {
      const dados = await AsyncStorage.getItem("zonas");
      if (dados) {
        setZonas(JSON.parse(dados));
      } else {
        Alert.alert("Atenção", "Nenhuma zona foi cadastrada ainda.");
      }
    } catch (error) {
      console.error("Erro ao carregar zonas:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarZonas();
  }, []);

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-10">
      <Text className="text-2xl font-bold text-gray-800 mb-6">
        Mapa de Zonas
      </Text>

      <Image
        source={require("../../../assets/MAP.jpg")}
        className="w-full h-56 rounded-xl mb-6"
        resizeMode="contain"
      />

      <Text className="text-xl font-bold text-gray-800 mb-4">Zonas:</Text>

      {loading ? (
        <Text className="text-gray-500">Carregando...</Text>
      ) : zonas.length === 0 ? (
        <Text className="text-gray-500">Nenhuma zona cadastrada.</Text>
      ) : (
        zonas.map((zona) => (
          <View
            key={zona.id}
            className="border border-gray-300 rounded-lg px-4 py-3 mb-3"
          >
            <Text className="font-semibold">{zona.nome}</Text>
            <Text className="text-gray-600">Tipo: {zona.tipo}</Text>
          </View>
        ))
      )}

      <TouchableOpacity
        onPress={() =>
          Alert.alert("Entrega registrada", "Lembre-se de escanear o QR code.")
        }
        className="bg-green-600 py-3 rounded-xl mt-6"
      >
        <Text className="text-white text-center font-semibold text-base">
          Entreguei as motos
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
