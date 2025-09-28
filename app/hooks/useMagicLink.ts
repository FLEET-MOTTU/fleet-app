import * as Linking from "expo-linking";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../routes/navigation";
import { jwtDecode } from "jwt-decode";

type FuncionarioTokenPayload = {
  idFuncionario: string;
  nome: string;
  pateoId: string;
  exp: number;
};

export function useMagicLink() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const handleDeepLink = async (event: Linking.EventType) => {
      const url = event.url;
      const { queryParams } = Linking.parse(url);

      if (queryParams?.token) {
        let token = queryParams.token as string;

        // Limpa caso venha no formato "valor=xxx"
        if (token.includes("valor=")) {
          token = token.split("valor=")[1];
        }

        console.log("URL recebida:", url);
        console.log("Query Params:", queryParams);
        console.log("Token bruto:", queryParams.token);
        console.log("Token limpo:", token);

        await AsyncStorage.setItem("token", token);

        // 🔹 Se o token tiver os 3 pedaços (JWT), tenta decodificar
        if (token.split(".").length === 3) {
          try {
            const payload = jwtDecode<FuncionarioTokenPayload>(token);
            console.log("Payload decodificado:", payload);

            if (payload?.nome) {
              await AsyncStorage.setItem("nomeFuncionario", payload.nome);
            }
            if (payload?.idFuncionario) {
              await AsyncStorage.setItem(
                "idFuncionario",
                payload.idFuncionario
              );
            }
            if (payload?.pateoId) {
              await AsyncStorage.setItem("pateoId", payload.pateoId);
            }
          } catch (err) {
            console.error("Erro ao decodificar JWT:", err);
          }
        } else {
          console.warn("Token não é JWT, parece um UUID:", token);
        }

        navigation.reset({
          index: 0,
          routes: [{ name: "HomeFuncionario" }],
        });
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => subscription.remove();
  }, []);
}
