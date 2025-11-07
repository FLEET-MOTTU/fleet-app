import * as ImagePicker from "expo-image-picker";
import { atualizarFotoFuncionario } from "../../services/funcionarioService";
import { Alert } from "react-native";

async function pickAndUploadPhoto(funcionarioId: string, onDone: () => void) {
  // pede permissão
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permissão negada", "Precisamos de acesso às fotos.");
    return;
  }

  // abre galeria
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled) return;

  const asset = result.assets[0];

  // monta objeto esperado pelo service
  const foto = {
    uri: asset.uri,
    type: asset.mimeType || "image/jpeg",
    fileName: asset.fileName || "foto.jpg",
  };

  try {
    await atualizarFotoFuncionario(funcionarioId, foto);
    onDone(); // recarrega lista
    Alert.alert("Pronto!", "Foto atualizada com sucesso.");
  } catch (e) {
    Alert.alert("Erro", "Não foi possível enviar a foto.");
  }
}
