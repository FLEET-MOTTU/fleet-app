import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Image, Alert } from "react-native";
import {
  bleAvailable,
  bleManager,
  ensureBlePermissions,
} from "../../../BLE/ble";

export default function Scanner({ navigation }: any) {
  const [status, setStatus] = useState(
    bleAvailable
      ? "Preparando scanner..."
      : "BLE não disponível no Expo Go — usando simulação"
  );

  useEffect(() => {
    let stopScan = () => {};
    let timer: any;

    async function run() {
      if (!bleAvailable) {
        // Fallback de desenvolvimento no Expo Go
        timer = setTimeout(() => {
          navigation.navigate("RegistroMoto", { tagCodigo: "FAKE-TAG-ABC123" });
        }, 1500);
        return;
      }

      const ok = await ensureBlePermissions();
      if (!ok) {
        Alert.alert(
          "Permissão",
          "Habilite o Bluetooth/permissões para continuar."
        );
        return;
      }

      setStatus("Escaneando...");
      // Inlined scan logic and removed duplicate nested component declaration
      setStatus("Escaneando...");
      (bleManager as any)?.startDeviceScan?.(
        null,
        { allowDuplicates: false },
        (error: Error | null, device?: any) => {
          if (error) {
            setStatus("Erro no scan");
            return;
          }
          // sua lógica de extração de código da tag
          const adv = device?.advertisementData || {};
          const codigo: string | undefined = adv?.localName?.startsWith?.(
            "MOTTU_TAG_"
          )
            ? adv.localName.replace("MOTTU_TAG_", "")
            : device?.id;

          if (codigo) {
            setStatus("Tag encontrada!");
            (bleManager as any)?.stopDeviceScan?.();
            navigation.navigate("RegistroMoto", { tagCodigo: codigo });
          }
        }
      );

      stopScan = () => bleManager?.stopDeviceScan();
    }

    run();
    return () => {
      stopScan();
      if (timer) clearTimeout(timer);
    };
  }, [navigation]);

  return (
    <View className="flex-1 justify-center items-center bg-white dark:bg-black">
      <Text className="text-2xl font-bold mb-4">Scanner Tag</Text>
      <Text className="text-gray-500 mb-6 text-center">{status}</Text>
      <Image
        source={require("./assets/tagBLE.png")}
        style={{ width: 220, height: 220 }}
      />
      <ActivityIndicator size="large" className="mt-4" />
    </View>
  );
}
