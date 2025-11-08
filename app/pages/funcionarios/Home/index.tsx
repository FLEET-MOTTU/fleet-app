import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SafeAreaWrapper from "../../../utils/safeAreaWrapper";
import { useNavigation } from "@react-navigation/native";
import { useColorScheme } from "nativewind";
import QuickActionCard from "../../../components/QuickCard";
import ActivityItem from "../../../components/ActiveItem";
import { setMockFuncionario } from "../../../services/loginMock";

export default function HomeFuncionarioScreen() {
  const navigation = useNavigation<any>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [nome, setNome] = useState("Funcionário");

  useEffect(() => {
    setMockFuncionario("FUNC-001", "Udyr");
  }, []);

  useEffect(() => {
    (async () => {
      const n = (await AsyncStorage.getItem("nomeFuncionario")) || "Amanda";
      setNome(n);
    })();
  }, []);

  return (
    <SafeAreaWrapper>
      <ScrollView
        className="flex-1 px-4 pt-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-black dark:text-white text-xl">Olá,</Text>
            <Text className="text-2xl font-bold dark:text-white">{nome}</Text>
          </View>

          <View className="flex-row items-center gap-3">
            <TouchableOpacity className="bg-lightGray dark:bg-darkBlue p-2 rounded-full">
              <Ionicons
                name="notifications-outline"
                size={22}
                color={isDark ? "#FFF" : "#555"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-lightGray dark:bg-darkBlue p-2 rounded-full"
              onPress={() => navigation.navigate("Configuration")}
            >
              <Ionicons
                name="settings-outline"
                size={22}
                color={isDark ? "#FFF" : "#555"}
              />
            </TouchableOpacity>

            {/* <Image
              source={{ uri: "https://i.pravatar.cc/100?img=15" }}
              className="w-10 h-10 rounded-full"
            /> */}
          </View>
        </View>

        {/* Métricas (cards pequenos) */}
        <View className="flex-row justify-between mb-8">
          <MetricCard
            icon="add-circle-outline"
            title="Coletadas Hoje"
            value="12"
            color="#2563EB"
          />
          <MetricCard
            icon="checkmark-done-outline"
            title="Entregues"
            value="8"
            color="#22C55E"
          />
        </View>

        {/* Ações Principais */}
        <Text className="text-lg font-bold mb-3 dark:text-white">
          Ações Principais
        </Text>

        <PrimaryActionCard
          title="Cadastrar Nova Moto"
          subtitle="Escaneie a tag BLE da moto"
          cta="Iniciar Scanner"
          onPress={() => navigation.navigate("Scanner")}
        />

        {/* Atalhos */}
        <View className="flex-row justify-between mb-8 gap-2">
          <QuickActionCard
            icon="list"
            title="Ver Motos"
            subtitle="Lista coletadas"
            onPress={() => navigation.navigate("MotosDoFuncionario")}
            variant={isDark ? "outlined" : "filled"}
          />

          <QuickActionCard
            icon="map"
            title="Mapa Pátio"
            subtitle="Localização"
            onPress={() => navigation.navigate("MapaPatioFunc")}
            variant="outlined"
          />
        </View>

        {/* Atividade recente */}
        <View className="mb-16">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-bold dark:text-white">
              Atividade Recente
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("HistoricoAtividades")}
            >
              <Text className="text-sm text-blue-600 dark:text-blue-400">
                Ver todas
              </Text>
            </TouchableOpacity>
          </View>

          <ActivityItem
            icon="add-circle-outline"
            plate="Moto ABC-1234 coletada"
            desc="Zona: Reparo Rápido • 13:45"
            time=""
            color="#22C55E"
          />
          <ActivityItem
            icon="arrow-forward-outline"
            plate="Moto XYZ-5678 movida"
            desc="Para: Manutenção Pesada • 13:20"
            time=""
            color="#2563EB"
          />
          <ActivityItem
            icon="checkmark-circle-outline"
            plate="Moto DEF-9012 finalizada"
            desc="Pronta para aluguel • 12:55"
            time=""
            color="#EA580C"
          />
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

/* ===== Components locais ===== */

function MetricCard({
  icon,
  title,
  value,
  color,
}: {
  icon: any;
  title: string;
  value: string | number;
  color: string;
}) {
  return (
    <View className="bg-white dark:bg-lightBlack rounded-2xl flex-1 items-center justify-center py-3 mx-1 shadow-md">
      <Ionicons name={icon} size={22} color={color} />
      <Text className="text-lg font-bold mt-2 dark:text-white">{value}</Text>
      <Text className="text-xs text-gray-500 dark:text-white">{title}</Text>
    </View>
  );
}

function PrimaryActionCard({
  title,
  subtitle,
  cta,
  onPress,
}: {
  title: string;
  subtitle: string;
  cta: string;
  onPress: () => void;
}) {
  return (
    <View className="mb-6">
      <View className="bg-[#171329] dark:bg-[#171329] rounded-2xl p-5 mb-3 shadow-md">
        <View className="flex-row justify-between items-start">
          <View className="flex-1 pr-4">
            <Text className="text-white text-base font-bold mb-1">{title}</Text>
            <Text className="text-white/80 text-sm">{subtitle}</Text>
          </View>
          <View className="bg-white/10 rounded-xl p-2">
            <Ionicons name="qr-code-outline" size={18} color="#fff" />
          </View>
        </View>

        <TouchableOpacity
          onPress={onPress}
          className="mt-4 bg-white/15 rounded-xl py-3 items-center"
        >
          <Text className="text-white font-semibold">{cta}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
