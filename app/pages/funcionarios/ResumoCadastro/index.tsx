import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppHeader from "../../../components/AppHeader";
import SafeAreaWrapper from "../../../utils/safeAreaWrapper";

export default function ResumoCadastro({ navigation }: any) {
  const [motos, setMotos] = useState<any[]>([]);

  const carregar = async () => {
    const dados = await AsyncStorage.getItem("motosFuncionario");
    setMotos(dados ? JSON.parse(dados) : []);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", carregar);
    return unsubscribe;
  }, [navigation]);

  const finalizar = async () => {
    Alert.alert("Sucesso", "Cadastro finalizado 🚀");
    await AsyncStorage.removeItem("motosFuncionario");
    navigation.navigate("HomeFuncionario");
  };

  return (
    <SafeAreaWrapper>
      <AppHeader title="Resumo de Motos" showBack />

      <View className="flex-1 mt-2">
        <FlatList
          data={motos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="p-4 mb-3 rounded-xl bg-gray-100 dark:bg-gray-800">
              <Text className="font-semibold text-gray-900 dark:text-white">
                Placa: {item.placa.replace(/\D/g, "")}
              </Text>
              <Text className="text-black dark:text-white">
                Estado: {item.estado}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text className="text-gray-500 dark:text-gray-400">
              Nenhuma moto cadastrada.
            </Text>
          }
        />

        <TouchableOpacity
          onPress={finalizar}
          className="bg-blue-600 py-4 rounded-xl mt-6"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Finalizar Cadastro
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaWrapper>
  );
}
