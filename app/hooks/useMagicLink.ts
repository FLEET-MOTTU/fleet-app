import * as Linking from "expo-linking";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import apiJava from "../services/apiJava";
import { RootStackParamList } from "../routes/navigation";

export function useMagicLink() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const handleDeepLink = async (event: Linking.EventType) => {
      try {
        const url = event.url;
        const { queryParams } = Linking.parse(url);
        const code = queryParams?.code as string | undefined;

        console.log("[MAGIC LINK] URL recebida:", url);
        console.log("[MAGIC LINK] Código extraído:", code);

        if (!code) return;

        const { data } = await apiJava.post("/auth/exchange-token", { code });
        const { accessToken, refreshToken } = data;

        console.log("[MAGIC LINK] Resposta backend:", data);

        if (!accessToken || !refreshToken) {
          console.warn("[MAGIC LINK] Nenhum token retornado do backend.");
          return;
        }

        await SecureStore.setItemAsync("accessToken", accessToken);
        await SecureStore.setItemAsync("refreshToken", refreshToken);
        await AsyncStorage.setItem("token", accessToken);
        await AsyncStorage.setItem("userRole", "funcionario");

        // Confirma se foi persistido
        let tokenConfirm = null;
        for (let i = 0; i < 10; i++) {
          tokenConfirm = await AsyncStorage.getItem("token");
          if (tokenConfirm) break;
          console.log(
            `[MAGIC LINK] Tentando confirmar token... tentativa ${i + 1}`
          );
          await new Promise<void>((resolve) => setTimeout(resolve, 200));
        }

        if (tokenConfirm) {
          console.log(
            "[MAGIC LINK] ✅ Token confirmado:",
            tokenConfirm.slice(0, 50),
            "..."
          );
          navigation.reset({ index: 0, routes: [{ name: "FuncionarioTabs" }] });
        } else {
          console.warn(
            "[MAGIC LINK] ❌ Token não confirmado após 10 tentativas."
          );
        }
      } catch (err: any) {
        console.log("Erro no Magic Link:", err?.response?.data || err?.message);
      }
    };

    // ✅ Adiciona listener corretamente
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // ✅ Detecta URL inicial se o app foi aberto por link
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log("[MAGIC LINK] URL inicial detectada:", url);
        handleDeepLink({ url });
      } else {
        console.warn("[MAGIC LINK] Nenhuma URL inicial detectada.");
      }
    });

    // ✅ Remove listener no cleanup
    return () => {
      subscription.remove();
    };
  }, [navigation]);
}
