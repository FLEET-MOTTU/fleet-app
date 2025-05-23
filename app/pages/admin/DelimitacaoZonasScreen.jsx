import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import API from "../../services/apiJava";

export default function DelimitacaoZonasScreen() {
  const [zonas, setZonas] = useState([]);
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");

  const buscarZonas = async () => {
    try {
      const response = await API.get("/api/zonas?page=0&size=5");
      setZonas(response.data.content || []);
    } catch (err) {
      console.error("Erro ao buscar zonas:", err);
      Alert.alert("Erro", "Não foi possível carregar as zonas.");
    }
  };

  const criarZona = async () => {
    if (!nome || !tipo) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      await API.post("/api/zonas", { nome, tipo });
      Alert.alert("Sucesso", "Zona criada com sucesso!");
      setNome("");
      setTipo("");
      buscarZonas(); // atualiza lista
    } catch (err) {
      console.error("Erro ao criar zona:", err);
      Alert.alert("Erro", "Não foi possível criar a zona.");
    }
  };

  useEffect(() => {
    buscarZonas();
  }, []);

  return (
    <View className="flex-1 px-6 pt-10 bg-white">
      <Text className="text-2xl font-bold text-gray-800 mb-4">
        Delimitação de Zona
      </Text>

      {/* Formulário de nova zona */}
      <Text className="text-lg font-semibold mb-2">Nova Zona</Text>
      <TextInput
        placeholder="Nome da zona"
        value={nome}
        onChangeText={setNome}
        className="border border-gray-300 rounded-xl px-4 py-3 mb-3"
      />
      <TextInput
        placeholder="Tipo da zona (ex: APTAS, REPROVADAS)"
        value={tipo}
        onChangeText={setTipo}
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
      />
      <TouchableOpacity
        onPress={criarZona}
        className="bg-blue-600 py-3 rounded-xl mb-6"
      >
        <Text className="text-white text-center font-semibold">Criar Zona</Text>
      </TouchableOpacity>

      {/* Lista de zonas existentes */}
      <Text className="text-lg font-semibold mb-3">Zonas Existentes</Text>
      <FlatList
        data={zonas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="mb-4 p-4 bg-gray-100 rounded-xl">
            <Text className="font-bold">{item.nome}</Text>
            <Text className="text-gray-600">Tipo: {item.tipo}</Text>
          </View>
        )}
      />
    </View>
  );
}
