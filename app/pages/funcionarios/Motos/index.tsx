import { useCallback, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import SafeAreaWrapper from "../../../utils/safeAreaWrapper";
import AppHeader from "../../../components/AppHeader";
import { listarMotos, Moto } from "../../../services/motoMockService";
import { useTranslation } from "react-i18next";

export default function MotosDoFuncionario() {
  const { t } = useTranslation("homeFunc");
  const [motos, setMotos] = useState<Moto[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setLoading(true);
        const data = await listarMotos();
        setMotos(data);
        setLoading(false);
      })();
    }, [])
  );

  return (
    <SafeAreaWrapper>
      <AppHeader title={t("header_title")} showBack={true} />
      <View className="px-4 mt-3 flex-1">
        {loading ? (
          <Text className="text-gray-500 dark:text-gray-300">
            {t("loading")}
          </Text>
        ) : motos.length === 0 ? (
          <Text className="text-gray-500 dark:text-gray-300">{t("empty")}</Text>
        ) : (
          <FlatList
            data={motos}
            keyExtractor={(i) => i.id}
            ItemSeparatorComponent={() => <View className="h-3" />}
            renderItem={({ item }) => (
              <View className="bg-white dark:bg-[#1f1f1f] rounded-2xl p-4 shadow-sm">
                <Text className="font-bold text-lg dark:text-white">
                  {item.modelo}
                </Text>
                <Text className="text-gray-600 dark:text-gray-400">
                  {t("plate_label")}: {item.placa}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaWrapper>
  );
}
