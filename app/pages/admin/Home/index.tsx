import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SafeAreaWrapper from "../../../utils/safeAreaWrapper";
import { getAdminFromToken } from "../../../services/auth/session";
import { useNavigation } from "@react-navigation/native";
import QuickActionCard from "../../../components/QuickCard";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "nativewind";
import ActivityItem from "../../../components/ActiveItem";

export default function HomeAdmScreen() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation("homeAdm");
  const [adminName, setAdminName] = useState("Administrador");
  const [loading, setLoading] = useState(true);
  const { colorScheme } = useColorScheme();

  const isDarkMode = colorScheme === "dark";

  useEffect(() => {
    (async () => {
      const admin = await getAdminFromToken();
      if (admin?.nome) setAdminName(admin.nome);
      setLoading(false);
    })();
  }, []);

  return (
    <SafeAreaWrapper>
      <ScrollView
        className="flex-1 px-4 pt-6 "
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-black dark:text-white text-xl">
              {t("hello")}
            </Text>
            <Text className="text-2xl font-bold dark:text-white">
              {adminName}
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              className="bg-lightGray dark:bg-darkBlue p-2 rounded-full"
              onPress={() => {
                navigation.navigate("Configuration");
              }}
            >
              <Ionicons
                name="settings-outline"
                size={22}
                color={isDarkMode ? "#FFF" : "#555"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Métricas principais */}
        <View className="flex-row justify-between mb-8">
          <MetricCard
            icon="bicycle"
            title={t("colected")}
            value="24"
            color="#10B981"
          />
          <MetricCard
            icon="build-outline"
            title={t("in_maintenance")}
            value="12"
            color="#3B82F6"
          />
          <MetricCard
            icon="checkmark-circle-outline"
            title={t("finished")}
            value="8"
            color="#22C55E"
          />
        </View>

        {/* Ações rápidas */}
        <Text className="text-lg font-bold mb-3 dark:text-white">
          {t("quick_actions")}
        </Text>
        <View className="flex-row justify-between mb-8 gap-2">
          <QuickActionCard
            icon="person"
            title={t("employees")}
            subtitle={t("registerNew")}
            onPress={() => navigation.navigate("CadastrarFuncionario")}
            variant="filled"
          />

          <QuickActionCard
            icon="map"
            title={t("see_patio")}
            subtitle="Localizar motos"
            onPress={() => navigation.navigate("MapaPateo")}
            variant="outlined"
          />
        </View>

        {/* Atividades recentes */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-bold dark:text-white">
              {t("recent_activities")}
            </Text>
            <Text className="text-sm text-blue-600 dark:text-blue-400">
              {t("see_all")}
            </Text>
          </View>

          <ActivityItem
            icon="add-circle-outline"
            plate="ABC-1234"
            desc={t("registered_motor_defective")}
            time="2min"
            color="#22C55E"
          />
          <ActivityItem
            icon="arrow-forward-outline"
            plate="XYZ-5678"
            desc={t("moved_to_maintenance_zone")}
            time="8min"
            color="#3B82F6"
          />
          <ActivityItem
            icon="checkmark-circle-outline"
            plate="DEF-9012"
            desc={t("registered_motor_defective")}
            time="15min"
            color="#22C55E"
          />
        </View>

        {/* Estatísticas */}
        <View className="mb-16">
          <Text className="text-lg font-bold mb-3 dark:text-white">
            {t("daily_statistics")}
          </Text>
          <View className="bg-darkBlue rounded-2xl p-5">
            <Text className="text-white text-lg mb-2 font-semibold">
              {t("patio_efficiency")}
            </Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-white">{t("ready_bikes")}</Text>
              <Text className="text-white font-bold">74</Text>
            </View>
            <View className="flex-row justify-between mb-4">
              <Text className="text-white">{t("bikes_in_patio")}</Text>
              <Text className="text-white font-bold">80</Text>
            </View>
            <View className="w-full bg-white/20 h-2 rounded-full">
              <View
                className="bg-green-400 h-2 rounded-full"
                style={{ width: "90%" }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const MetricCard = ({ icon, title, value, color }: any) => (
  <View className="bg-white dark:bg-lightBlack rounded-2xl flex-1 items-center justify-center py-3 mx-1 shadow-md">
    <Ionicons name={icon} size={24} color={color} />
    <Text className="text-lg font-bold mt-2 dark:text-white">{value}</Text>
    <Text className="text-xs text-gray-500 dark:text-white">{title}</Text>
  </View>
);
