import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SafeAreaWrapper from "../../../utils/safeAreaWrapper";
import AppHeader from "../../../components/AppHeader";
import { useColorScheme } from "nativewind";
import { APP_NAME, APP_VERSION, COMMIT_HASH, COMMIT_RESUMIDO } from "@env";

export default function SobreAppScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <SafeAreaWrapper>
      <AppHeader title="Sobre o App" showBack />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 24 }}
        showsVerticalScrollIndicator={false}
        className="bg-white dark:bg-[#0f0f0f]"
      >
        {/* Ícone e título */}
        <View className="items-center mb-6">
          <Ionicons
            name="information-circle-outline"
            size={64}
            color={isDark ? "#FFF" : "#130F26"}
          />
          <Text className="text-2xl font-bold mt-2 dark:text-white">
            {APP_NAME || "Fleet"}
          </Text>
        </View>

        {/* Informações */}
        <View className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-[#1a1a1a] mb-6">
          <Text className="text-base dark:text-white mb-1">
            <Text className="font-semibold">Versão:</Text>{" "}
            {APP_VERSION || "1.0.0"}
          </Text>

          <Text className="text-base dark:text-white">
            <Text className="font-semibold">Commit:</Text>{" "}
            <Text selectable className="font-mono">
              {COMMIT_HASH || "N/A"}
            </Text>
          </Text>
          <Text className="text-base dark:text-white">
            <Text className="font-semibold">Hash resumido:</Text>{" "}
            <Text selectable className="font-mono">
              {COMMIT_RESUMIDO || "N/A"}
            </Text>
          </Text>
        </View>

        {/* Descrição */}
        <Text className="text-gray-700 dark:text-white mb-6 leading-6">
          Este aplicativo foi desenvolvido como parte da solução FLEET para
          gerenciamento e operação de frotas. O hash do commit indica a
          referência exata do código-fonte utilizado nesta versão.
        </Text>
      </ScrollView>
    </SafeAreaWrapper>
  );
}
