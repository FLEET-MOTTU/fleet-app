import React from "react";
import { View, Text } from "react-native";
import { useMagicLink } from "../../../hooks/useMagicLink";

export default function LoginFuncionarioScreen() {
  // Aqui o hook fica escutando o deep link
  useMagicLink();

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg font-bold">
        Aguardando Magic Link para entrar...
      </Text>
    </View>
  );
}
