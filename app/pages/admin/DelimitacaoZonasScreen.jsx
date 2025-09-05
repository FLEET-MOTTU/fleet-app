import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import Svg, { Circle, Polygon } from "react-native-svg";
import { ChevronDown, MapPin, Plus, Trash2, Eye } from "lucide-react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = 400;

const tiposZona = [
  { label: "Pendência", value: "pendencia" },
  { label: "Reparos Simples", value: "reparos_simples" },
  { label: "Danos Estruturais Graves", value: "danos_graves" },
  { label: "Motor Defeituoso", value: "motor_defeituoso" },
  { label: "Agendada para Manutenção", value: "agendada_manutencao" },
  { label: "Pronta para Aluguel", value: "pronta_aluguel" },
  { label: "Sem Placa", value: "sem_placa" },
  { label: "Minha Mottu", value: "minha_mottu" },
];

const coresZona = {
  pendencia: { fill: "rgba(255, 193, 7, 0.3)", stroke: "#FFC107" },
  reparos_simples: { fill: "rgba(33, 150, 243, 0.3)", stroke: "#2196F3" },
  danos_graves: { fill: "rgba(244, 67, 54, 0.3)", stroke: "#F44336" },
  motor_defeituoso: { fill: "rgba(255, 87, 34, 0.3)", stroke: "#FF5722" },
  agendada_manutencao: { fill: "rgba(156, 39, 176, 0.3)", stroke: "#9C27B0" },
  pronta_aluguel: { fill: "rgba(76, 175, 80, 0.3)", stroke: "#4CAF50" },
  sem_placa: { fill: "rgba(158, 158, 158, 0.3)", stroke: "#9E9E9E" },
  minha_mottu: { fill: "rgba(0, 188, 212, 0.3)", stroke: "#00BCD4" },
};

export default function DelimitacaoZonasScreen() {
  const [nomeZona, setNomeZona] = useState("");
  const [tipoZona, setTipoZona] = useState("");
  const [zonas, setZonas] = useState([]);
  const [pontosZonaAtual, setPontosZonaAtual] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [modoVisualizacao, setModoVisualizacao] = useState(true);

  const carregarZonas = async () => {
    try {
      const dados = await AsyncStorage.getItem("zonas");
      if (dados) setZonas(JSON.parse(dados));
    } catch (error) {
      console.error("Erro ao carregar zonas:", error);
    }
  };

  const salvarZonas = async (lista = []) => {
    try {
      await AsyncStorage.setItem("zonas", JSON.stringify(lista));
    } catch (error) {
      console.error("Erro ao salvar zonas:", error);
    }
  };

  useEffect(() => {
    carregarZonas();
  }, []);

  const handleSalvar = async () => {
    if (!nomeZona.trim() || !tipoZona || pontosZonaAtual.length < 3) {
      Alert.alert(
        "Dados Incompletos",
        "Por favor, preencha todos os campos e desenhe pelo menos 3 pontos na zona."
      );
      return;
    }

    const novaZona = {
      id: Date.now().toString(),
      nome: nomeZona.trim(),
      tipo: tipoZona,
      tipoLabel: tiposZona.find((t) => t.value === tipoZona)?.label || tipoZona,
      pontos: pontosZonaAtual.map((p) => `${p.x},${p.y}`).join(" "),
      criadaEm: new Date().toLocaleString("pt-BR"),
    };

    const novaLista = [...zonas, novaZona];
    setZonas(novaLista);
    await salvarZonas(novaLista);

    setNomeZona("");
    setTipoZona("");
    setPontosZonaAtual([]);

    Alert.alert(
      "Zona Criada!",
      `A zona "${novaZona.nome}" foi delimitada com sucesso.`
    );
  };

  const excluirZona = async (id, nome) => {
    Alert.alert("Confirmar Exclusão", `Excluir a zona "${nome}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          const novaLista = zonas.filter((zona) => zona.id !== id);
          setZonas(novaLista);
          await salvarZonas(novaLista);
        },
      },
    ]);
  };

  const handlePressImage = (event) => {
    if (!modoVisualizacao) {
      const { locationX, locationY } = event.nativeEvent;
      const novoPonto = { x: locationX, y: locationY };
      setPontosZonaAtual((prev) => [...prev, novoPonto]);
    }
  };

  const limparDesenho = () => {
    setPontosZonaAtual([]);
  };

  const obterLabelTipo = (value) => {
    return tiposZona.find((tipo) => tipo.value === value)?.label || value;
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#79a4cf" />

      {/* Header */}
      <View className="pt-12 pb-5 px-6 bg-white border-b border-slate-200 shadow">
        <Text className="text-2xl font-bold text-slate-800 mb-2">
          Delimitação de Zonas
        </Text>
        <Text className="text-base text-slate-500">
          Defina e gerencie zonas no mapa
        </Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Controles do Mapa */}
        <View className="bg-white mx-5 mt-5 rounded-2xl p-5 shadow">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-slate-800">
              Mapa Interativo
            </Text>
            <TouchableOpacity
              onPress={() => setModoVisualizacao(!modoVisualizacao)}
              className={`flex-row items-center px-3 py-1.5 rounded-lg ${
                modoVisualizacao ? "bg-slate-200" : "bg-blue-500"
              }`}
            >
              <Eye size={16} color={modoVisualizacao ? "#64748b" : "#fff"} />
              <Text
                className={`ml-1 text-xs font-medium ${
                  modoVisualizacao ? "text-slate-500" : "text-white"
                }`}
              >
                {modoVisualizacao ? "Visualizar" : "Desenhar"}
              </Text>
            </TouchableOpacity>
          </View>

          <Pressable onPress={handlePressImage} className="rounded-xl overflow-hidden">
            <ImageBackground
              source={require("../../../assets/MAP.jpg")}
              style={{
                width: screenWidth - 80,
                height: screenHeight,
              }}
              imageStyle={{ borderRadius: 12 }}
            >
              <Svg height={screenHeight} width={screenWidth - 80}>
                {/* Zonas salvas */}
                {zonas.map((zona) => {
                  const cores =
                    coresZona[zona.tipo] || {
                      fill: "rgba(99, 102, 241, 0.3)",
                      stroke: "#6366f1",
                    };
                  return (
                    <Polygon
                      key={zona.id}
                      points={zona.pontos}
                      fill={cores.fill}
                      stroke={cores.stroke}
                      strokeWidth="2"
                    />
                  );
                })}

                {/* Zona sendo desenhada */}
                {pontosZonaAtual.length > 0 && (
                  <>
                    <Polygon
                      points={pontosZonaAtual
                        .map((p) => `${p.x},${p.y}`)
                        .join(" ")}
                      fill="rgba(34, 197, 94, 0.2)"
                      stroke="#22c55e"
                      strokeWidth="3"
                    />
                    {pontosZonaAtual.map((p, i) => (
                      <Circle key={i} cx={p.x} cy={p.y} r="6" fill="#22c55e" />
                    ))}
                  </>
                )}
              </Svg>
            </ImageBackground>
          </Pressable>

          {!modoVisualizacao && pontosZonaAtual.length > 0 && (
            <TouchableOpacity
              onPress={limparDesenho}
              className="mt-3 self-center bg-red-500 px-4 py-2 rounded-lg"
            >
              <Text className="text-white text-sm font-medium">
                Limpar Desenho
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Formulário */}
        {!modoVisualizacao && (
          <View className="bg-white mx-5 mt-5 rounded-2xl p-5 shadow">
            <Text className="text-lg font-semibold text-slate-800 mb-4">
              Dados da Zona
            </Text>

            <View className="mb-4">
              <Text className="text-sm font-medium text-slate-700 mb-1.5">
                Nome da Zona
              </Text>
              <TextInput
                placeholder="Digite o nome da zona..."
                value={nomeZona}
                onChangeText={setNomeZona}
                className="border border-gray-300 rounded-xl px-4 py-3 text-base bg-gray-50 text-slate-900"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View className="mb-5">
              <Text className="text-sm font-medium text-slate-700 mb-1.5">
                Tipo da Zona
              </Text>
              <TouchableOpacity
                onPress={() => setDropdownVisible(true)}
                className="border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 flex-row justify-between items-center"
              >
                <Text
                  className={`text-base ${
                    tipoZona ? "text-slate-900" : "text-gray-400"
                  }`}
                >
                  {tipoZona ? obterLabelTipo(tipoZona) : "Selecione o tipo..."}
                </Text>
                <ChevronDown size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleSalvar}
              className="bg-blue-500 py-4 rounded-xl flex-row items-center justify-center shadow"
            >
              <Plus size={20} color="#fff" />
              <Text className="text-white text-base font-semibold ml-2">
                Salvar Zona
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Lista de Zonas */}
        <View className="bg-white mx-5 mt-5 rounded-2xl p-5 shadow">
          <View className="flex-row items-center mb-4">
            <MapPin size={20} color="#3b82f6" />
            <Text className="text-lg font-semibold text-slate-800 ml-2">
              Zonas Cadastradas ({zonas.length})
            </Text>
          </View>

          {zonas.length === 0 ? (
            <View className="py-10 items-center">
              <Text className="text-base text-gray-400 text-center">
                Nenhuma zona cadastrada ainda.{"\n"}Desenhe no mapa e salve sua
                primeira zona!
              </Text>
            </View>
          ) : (
            zonas.map((zona) => {
              const cores = coresZona[zona.tipo] || { stroke: "#6366f1" };
              return (
                <View
                  key={zona.id}
                  className="border border-gray-200 rounded-xl p-4 mb-3 bg-white"
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-slate-900 mb-1">
                        {zona.nome}
                      </Text>
                      <View
                        className="px-2 py-1 rounded bg-opacity-10 self-start mb-1"
                        style={{ backgroundColor: cores.stroke + "15" }}
                      >
                        <Text
                          className="text-xs font-medium"
                          style={{ color: cores.stroke }}
                        >
                          {zona.tipoLabel}
                        </Text>
                      </View>
                      <Text className="text-xs text-gray-500">
                        Criada em: {zona.criadaEm}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => excluirZona(zona.id, zona.nome)}
                      className="bg-red-50 p-2 rounded-lg border border-red-200"
                    >
                      <Trash2 size={16} color="#dc2626" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Modal do Dropdown */}
      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center"
          onPress={() => setDropdownVisible(false)}
        >
          <View className="bg-white rounded-2xl py-5 mx-10 max-h-96 w-4/5 shadow-lg">
            <Text className="text-lg font-semibold text-gray-800 text-center mb-4 px-5">
              Selecionar Tipo de Zona
            </Text>

            <ScrollView className="max-h-72">
              {tiposZona.map((tipo) => (
                <TouchableOpacity
                  key={tipo.value}
                  onPress={() => {
                    setTipoZona(tipo.value);
                    setDropdownVisible(false);
                  }}
                  className={`py-3 px-5 border-b border-gray-100 ${
                    tipoZona === tipo.value ? "bg-blue-50" : ""
                  }`}
                >
                  <Text
                    className={`text-base ${
                      tipoZona === tipo.value
                        ? "text-blue-600 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {tipo.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
