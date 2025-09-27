import * as Linking from "expo-linking";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../routes/navigation";

export function useMagicLink() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const { queryParams } = Linking.parse(event.url);

      if (queryParams?.token) {
        await AsyncStorage.setItem("token", queryParams.token as string);

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
  }, [navigation]);
}
