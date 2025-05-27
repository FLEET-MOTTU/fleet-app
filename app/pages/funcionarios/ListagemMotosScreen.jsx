import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, View } from "react-native";
import { listarMotos } from "../../services/motoService";

export default function ListagemMotosScreen() {
  const [motos, setMotos] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarMotos = async () => {
    setLoading(true);
    try {
      const response = await listarMotos();
      setMotos(response.data);
    } catch (error) {
      console.error("Erro ao buscar motos:", error);
      Alert.alert("Erro", "Não foi possível carregar as motos.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarMotos();
    }, [])
  );

  return (
    <View className="flex-1 bg-white px-6 pt-10">
      <Text className="text-2xl font-bold mb-6 text-gray-800">
        Motos no Pátio
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={motos}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text className="text-gray-500">Nenhuma moto encontrada.</Text>
          }
          renderItem={({ item }) => (
            <View className="mb-4 p-4 bg-gray-100 rounded-xl shadow-sm">
              <Text className="font-bold text-lg text-gray-800">
                {item.modelo}
              </Text>
              <Text className="text-gray-700">
                Placa: {item.placa ?? "Sem Placa"}
              </Text>
              <Text className="text-gray-700">Status: {item.statusMoto}</Text>
              {item.tag?.codigoUnicoTag && (
                <Text className="text-gray-600 text-sm">
                  Tag: {item.tag.codigoUnicoTag}
                </Text>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}
