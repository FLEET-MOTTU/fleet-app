import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import SafeAreaWrapper from "../../utils/safeAreaWrapper";
import HeaderMenu from "../../components/common/HeaderMenu";

export default function HomeAdmScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaWrapper>
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3">
        <Text className="text-2xl font-bold dark:text-white">Início</Text>
        <HeaderMenu />
      </View>

      {/* Conteúdo da Home */}
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg dark:text-white">Bem-vindo ao painel ADM</Text>
      </View>
    </SafeAreaWrapper>
  );
}
