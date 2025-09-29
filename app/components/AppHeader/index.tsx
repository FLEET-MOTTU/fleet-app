import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import BackButton from "../BackButton";

export default function AppHeader({
  title,
  showBack = false,
}: {
  title: string;
  showBack?: boolean;
}) {
  const { colorScheme, setColorScheme } = useColorScheme();

  return (
    <View className="flex-row justify-between items-center px-4 py-3">
      {showBack ? <BackButton /> : <View style={{ width: 44 }} />}
      <Text className="text-xl font-bold dark:text-white">{title}</Text>
    </View>
  );
}
