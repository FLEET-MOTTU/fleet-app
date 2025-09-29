import React from "react";
import { View, Text } from "react-native";
import BackButton from "../BackButton";

export default function AppHeader({
  title,
  showBack = false,
}: {
  title: string;
  showBack?: boolean;
}) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      <View style={{ width: 44 }}>{showBack ? <BackButton /> : null}</View>

      {/* Centro */}
      <View className="flex-1 items-center">
        <Text className="text-xl font-bold dark:text-white">{title}</Text>
      </View>

      {/* Direita - espaço para balancear */}
      <View style={{ width: 44 }} />
    </View>
  );
}
