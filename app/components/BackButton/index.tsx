import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useColorScheme } from "nativewind";
import { RootStackParamList } from "../../routes/navigation";

export default function BackButton({ onPress }: { onPress?: () => void }) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colorScheme } = useColorScheme();

  return (
    <TouchableOpacity onPress={onPress ? onPress : () => navigation.goBack()}>
      <View className="bg-[#EAEAF3] dark:bg-darkBlue rounded-lg p-2 mr-2">
        <Ionicons
          name="chevron-back"
          size={22}
          color={colorScheme === "dark" ? "#fff" : "#000"}
        />
      </View>
    </TouchableOpacity>
  );
}
