import { useTranslation } from "react-i18next";
import SafeAreaWrapper from "../../../../utils/safeAreaWrapper";
import { useColorScheme } from "nativewind";

import { Text } from "react-native";
import { View } from "react-native";

import Logo from "../../../../../assets/LogoFleet.svg";
import LogoWhite from "../../../../../assets/LogoWhite.svg";
import Button from "../../../../components/Button";
import { useNavigation } from "@react-navigation/native";

export default function Warning() {
  const { t } = useTranslation("login");
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const navigation = useNavigation<any>();

  return (
    <SafeAreaWrapper>
      <View className="flex-1 items-center justify-center">
        <View className="w-full px-6 shadow-2xl elevation-8 items-center">
          <View className="flex items-center mb-14">
            {isDarkMode ? <LogoWhite width={300} /> : <Logo width={300} />}
          </View>
          <View className="items-center justify-center w-full mb-11">
            <Text className="text-4xl text-darkBlue dark:text-white text-extrabold text-center">
              {t("contact_support")}
            </Text>
          </View>
          <View className="mb-11">
            <Text className="text-lg text-center text-black50 dark:text-white">
              {t("support_password")}
            </Text>
          </View>
          <Button
            label={t("menu_back")}
            size="lg"
            onPress={() => {
              navigation.navigate("LoginAdm");
            }}
            className="w-full"
          />
        </View>
      </View>
    </SafeAreaWrapper>
  );
}
