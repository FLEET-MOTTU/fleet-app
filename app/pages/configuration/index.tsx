import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ConfiguracoesAdm from "./admin";
import ConfiguracoesFuncionario from "./funcionario";

export default function Configuracoes() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const savedRole = await AsyncStorage.getItem("userRole");
        console.log("Role carregada do AsyncStorage:", savedRole);

        // normaliza o valor pra evitar diferença de maiúsculas/minúsculas
        if (savedRole) setRole(savedRole.toUpperCase());
      } catch (err) {
        console.log("Erro ao buscar role:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (role === "ADMIN") {
    console.log("Renderizando tela ADM");
    return <ConfiguracoesAdm />;
  }

  if (role === "FUNCIONARIO") {
    console.log("Renderizando tela FUNCIONARIO");
    return <ConfiguracoesFuncionario />;
  }

  console.log("Nenhum role definido, mostrando fallback");

  return (
    <View className="flex-1 justify-center items-center bg-white dark:bg-black">
      <Text className="text-black dark:text-white text-center px-4">
        Nenhum tipo de usuário identificado. Faça login novamente.
      </Text>
    </View>
  );
}
