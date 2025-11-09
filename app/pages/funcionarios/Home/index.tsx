import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SafeAreaWrapper from "../../../utils/safeAreaWrapper";
import { useNavigation } from "@react-navigation/native";
import { useColorScheme } from "nativewind";
import QuickActionCard from "../../../components/QuickCard";
import ActivityItem from "../../../components/ActiveItem";
import { setMockFuncionario } from "../../../services/loginMock";
import { useTranslation } from "react-i18next";

export default function HomeFuncionarioScreen() {
  const { t } = useTranslation("homeFunc");
  const navigation = useNavigation<any>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [nome, setNome] = useState("Funcionário");

  useEffect(() => {
    setMockFuncionario("FUNC-001", "Udyr");
  }, []);

  useEffect(() => {
    (async () => {
      const n =
        (await AsyncStorage.getItem("nomeFuncionario")) || "Funcionario";
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
            <Text className="text-black dark:text-white text-xl">
              {t("greeting")}
            </Text>
            <Text className="text-2xl font-bold dark:text-white">{nome}</Text>
          </View>

          <View className="flex-row items-center gap-3">
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
          </View>
        </View>

        {/* Métricas */}
        <View className="flex-row justify-between mb-8">
          <MetricCard
            icon="add-circle-outline"
            title={t("metrics_collected_today")}
            value="12"
            color="#2563EB"
          />
          <MetricCard
            icon="checkmark-done-outline"
            title={t("metrics_delivered")}
            value="8"
            color="#22C55E"
          />
        </View>

        {/* Ações Principais */}
        <Text className="text-lg font-bold mb-3 dark:text-white">
          {t("main_actions")}
        </Text>

        <PrimaryActionCard
          title={t("register_bike_title")}
          subtitle={t("register_bike_subtitle")}
          cta={t("register_bike_cta")}
          onPress={() => navigation.navigate("Scanner")}
        />

        {/* Atalhos */}
        <View className="flex-row justify-between mb-8 gap-2">
          <QuickActionCard
            icon="list"
            title={t("shortcuts_view_bikes_title")}
            subtitle={t("shortcuts_view_bikes_subtitle")}
            onPress={() => navigation.navigate("MotosDoFuncionario")}
            variant={isDark ? "outlined" : "filled"}
          />

          <QuickActionCard
            icon="map"
            title={t("shortcuts_map_title")}
            subtitle={t("shortcuts_map_subtitle")}
            onPress={() => navigation.navigate("MapaPateo")}
            variant="outlined"
          />
        </View>

        {/* Atividade Recente */}
        <View className="mb-16">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-bold dark:text-white">
              {t("recent_activity")}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("HistoricoAtividades")}
            >
              <Text className="text-sm text-blue-600 dark:text-blue-400">
                {t("view_all")}
              </Text>
            </TouchableOpacity>
          </View>

          <ActivityItem
            icon="add-circle-outline"
            plate={t("activity_collected", { plate: "ABC-1234" })}
            desc={t("activity_collected_desc")}
            time=""
            color="#22C55E"
          />
          <ActivityItem
            icon="arrow-forward-outline"
            plate={t("activity_moved", { plate: "XYZ-5678" })}
            desc={t("activity_moved_desc")}
            time=""
            color="#2563EB"
          />
          <ActivityItem
            icon="checkmark-circle-outline"
            plate={t("activity_finished", { plate: "DEF-9012" })}
            desc={t("activity_finished_desc")}
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
