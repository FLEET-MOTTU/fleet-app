import * as Linking from "expo-linking";
import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import apiJava from "../services/apiJava";
import { RootStackParamList } from "../routes/navigation";

export function useMagicLink() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    console.log("Hook useMagicLink ativo, aguardando deep links...");

    const handleDeepLink = async (event: Linking.EventType) => {
      try {
        const url = event.url;
        const { queryParams } = Linking.parse(url);
        const code = queryParams?.code as string | undefined;

        console.log("URL recebida:", url);
        console.log("Código capturado:", code);

        if (!code) return;

        // troca o code pelos tokens válidos
        const { data } = await apiJava.post("/auth/exchange-token", { code });
        const { accessToken, refreshToken } = data;

        if (!accessToken || !refreshToken) {
          console.warn("Resposta inválida: tokens ausentes.");
          return;
        }

        await SecureStore.setItemAsync("accessToken", accessToken);
        await SecureStore.setItemAsync("refreshToken", refreshToken);

        console.log("Tokens salvos, login automático feito.");

        navigation.reset({
          index: 0,
          routes: [{ name: "FuncionarioTabs" }],
        });
      } catch (err: any) {
        console.log(
          "Erro no fluxo do Magic Link:",
          err.response?.data || err.message
        );
      }
    };

    // escutar deep links com app aberto
    const sub = Linking.addEventListener("url", handleDeepLink);

    // capturar caso o app tenha sido aberto diretamente pelo link
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => sub.remove();
  }, [navigation]);
}
