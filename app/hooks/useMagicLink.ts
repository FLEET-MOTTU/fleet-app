import * as Linking from "expo-linking";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../routes/navigation";

export function useMagicLink() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const handleDeepLink = async (event: Linking.EventType) => {
      const url = event.url;
      const { queryParams } = Linking.parse(url);

      if (queryParams?.token) {
        // Salva token
        await AsyncStorage.setItem("token", queryParams.token as string);

        // Vai direto para HomeFuncionario
        navigation.reset({
          index: 0,
          routes: [{ name: "HomeFuncionario" }],
        });
      }
    };

    // Quando app já está aberto
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Quando app é aberto diretamente pelo link
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => subscription.remove();
  }, []);
}
