import AsyncStorage from "@react-native-async-storage/async-storage";

const K_ID = "@mock.funcionario.id";
const K_NOME = "@mock.funcionario.nome";

export async function setMockFuncionario(id: string, nome: string) {
  await AsyncStorage.multiSet([
    [K_ID, id],
    [K_NOME, nome],
  ]);
}

export async function getMockFuncionario() {
  const [[, id], [, nome]] = await AsyncStorage.multiGet([K_ID, K_NOME]);
  return { id: id ?? "", nome: nome ?? "" };
}

export async function clearMockFuncionario() {
  await AsyncStorage.multiRemove([K_ID, K_NOME]);
}
