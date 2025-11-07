import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  FuncionarioResponse,
  FuncionarioPayload,
  cadastrarFuncionario,
  atualizarFuncionario,
  StatusFuncionario,
  atualizarFotoFuncionario,
  CargoFuncionario,
} from "../../services/funcionarioService";

type Props = {
  funcionario: FuncionarioResponse | null;
  funcionariosExistentes: FuncionarioResponse[];
  onClose: () => void;
};

export default function FuncionarioForm({ funcionario, onClose }: Props) {
  const editing = !!funcionario?.id;

  const [nome, setNome] = useState(funcionario?.nome ?? "");
  const [email, setEmail] = useState(funcionario?.email ?? "");
  const [telefone, setTelefone] = useState(funcionario?.telefone ?? "");
  const [cargo, setCargo] = useState<CargoFuncionario>(
    funcionario?.cargo ?? "OPERACIONAL"
  );

  // no form: só ATIVO/SUSPENSO; “REMOVIDO” não aparece
  const [status, setStatus] = useState<StatusFuncionario>(
    funcionario?.status === "SUSPENSO" ? "SUSPENSO" : "ATIVO"
  );

  const [localPhoto, setLocalPhoto] = useState<{
    uri: string;
    mimeType?: string | null;
    fileName?: string | null;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  const titulo = useMemo(
    () => (editing ? "Editar Funcionário" : "Novo Funcionário"),
    [editing]
  );

  async function pickPhoto() {
    const { status: perm } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm !== "granted") {
      Alert.alert("Permissão negada", "Precisamos do acesso às fotos.");
      return;
    }
    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (r.canceled) return;
    const a = r.assets[0];
    setLocalPhoto({ uri: a.uri, mimeType: a.mimeType, fileName: a.fileName });
  }

  async function handleSave() {
    if (!nome.trim()) return Alert.alert("Atenção", "Informe o nome.");
    if (!telefone.trim()) return Alert.alert("Atenção", "Informe o telefone.");
    if (!email.trim()) return Alert.alert("Atenção", "Informe o e-mail.");
    if (!cargo) return Alert.alert("Atenção", "Informe o cargo.");

    const telefoneLimpo = telefone.replace(/\D/g, "");

    try {
      setSaving(true);

      if (editing && funcionario) {
        await atualizarFuncionario(funcionario.id, {
          nome: nome.trim(),
          email: email.trim() || undefined,
          telefone: telefoneLimpo,
          cargo,
          status, // pode alternar ATIVO <-> SUSPENSO aqui
        });

        if (localPhoto) {
          await atualizarFotoFuncionario(funcionario.id, {
            uri: localPhoto.uri,
            type: localPhoto.mimeType || "image/jpeg",
            fileName: localPhoto.fileName || "foto.jpg",
          } as any);
        }
      } else {
        // create: nasce ATIVO por padrão
        const created = await cadastrarFuncionario(
          {
            nome: nome.trim(),
            telefone: telefoneLimpo,
            cargo,
            email: email.trim() || undefined,
            status: "ATIVO",
          },
          localPhoto
            ? {
                uri: localPhoto.uri,
                type: localPhoto.mimeType || "image/jpeg",
                fileName: localPhoto.fileName || "foto.jpg",
              }
            : undefined
        );
      }

      onClose();
    } catch (e: any) {
      console.log("ERRO CADASTRAR/ATUALIZAR FUNCIONARIO:", {
        message: e?.message,
        code: e?.code,
        url: e?.config?.baseURL + e?.config?.url,
        method: e?.config?.method,
        status: e?.response?.status,
        data: e?.response?.data,
      });
      Alert.alert(
        `Erro ${e?.response?.status ?? ""}`.trim(),
        typeof e?.response?.data === "string"
          ? e.response.data
          : e?.response?.data?.message ||
              JSON.stringify(e?.response?.data) ||
              "Falha ao salvar."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-[#111111]"
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-xl font-bold dark:text-white">{titulo}</Text>
        <TouchableOpacity onPress={onClose} className="p-2">
          <Ionicons name="close" size={22} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Foto */}
      <Text className="text-xs text-gray-500 dark:text-gray-300 mb-2">
        Foto do funcionário
      </Text>
      <View className="flex-row items-center gap-3 mb-4">
        <View className="w-16 h-16 rounded-full bg-darkBlue/30 dark:bg-zinc-800 overflow-hidden">
          {localPhoto ? (
            <Image source={{ uri: localPhoto.uri }} className="w-16 h-16" />
          ) : funcionario?.fotoUrl ? (
            <Image
              source={{ uri: funcionario.fotoUrl }}
              className="w-16 h-16"
            />
          ) : null}
        </View>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={pickPhoto}
            className="flex-row items-center gap-2 rounded-2xl px-3 py-2 bg-white border border-gray-200 dark:bg-[#0F0F0F] dark:border-zinc-700"
          >
            <Ionicons name="image-outline" size={18} color="#666" />
            <Text className="text-gray-700 dark:text-white">Escolher foto</Text>
          </TouchableOpacity>
          {localPhoto && (
            <TouchableOpacity
              onPress={() => setLocalPhoto(null)}
              className="flex-row items-center gap-2 rounded-2xl px-3 py-2 bg-white border border-gray-200 dark:bg-[#0F0F0F] dark:border-zinc-700"
            >
              <Ionicons name="close-circle-outline" size={18} color="#666" />
              <Text className="text-gray-700 dark:text-white">Remover</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Nome */}
      <Text className="text-xs text-gray-500 dark:text-gray-300 mb-2">
        Nome
      </Text>
      <TextInput
        value={nome}
        onChangeText={setNome}
        placeholder="Nome completo"
        className="rounded-2xl px-4 py-3 mb-4 border bg-white border-gray-200 dark:bg-[#0F0F0F] dark:border-zinc-800 dark:text-white"
        placeholderTextColor="#9CA3AF"
      />

      {/* E-mail */}
      <Text className="text-xs text-gray-500 dark:text-gray-300 mb-2">
        E-mail
      </Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="email@exemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
        className="rounded-2xl px-4 py-3 mb-4 border bg-white border-gray-200 dark:bg-[#0F0F0F] dark:border-zinc-800 dark:text-white"
        placeholderTextColor="#9CA3AF"
      />

      {/* Telefone */}
      <Text className="text-xs text-gray-500 dark:text-gray-300 mb-2">
        Telefone
      </Text>
      <TextInput
        value={telefone}
        onChangeText={setTelefone}
        placeholder="(11) 99999-9999"
        keyboardType="phone-pad"
        className="rounded-2xl px-4 py-3 mb-4 border bg-white border-gray-200 dark:bg-[#0F0F0F] dark:border-zinc-800 dark:text-white"
        placeholderTextColor="#9CA3AF"
      />

      {/* Cargo */}
      <Text className="text-xs text-gray-500 dark:text-gray-300 mb-2">
        Cargo
      </Text>
      <View className="flex-row gap-2 mb-4">
        {(
          ["OPERACIONAL", "ADMINISTRATIVO", "TEMPORARIO"] as CargoFuncionario[]
        ).map((c) => {
          const active = cargo === c;
          return (
            <TouchableOpacity
              key={c}
              onPress={() => setCargo(c)}
              className={`px-3 py-2 rounded-2xl border ${
                active
                  ? "bg-[#130F26] border-[#130F26]"
                  : "bg-white border-gray-300 dark:bg-[#0F0F0F] dark:border-zinc-700"
              }`}
            >
              <Text
                className={`${
                  active ? "text-white" : "text-gray-700 dark:text-white"
                }`}
              >
                {c}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Status (somente ATIVO / SUSPENSO) */}
      <Text className="text-xs text-gray-500 dark:text-gray-300 mb-2">
        Status
      </Text>
      <View className="flex-row gap-2 mb-6">
        {(["ATIVO", "SUSPENSO"] as StatusFuncionario[]).map((s) => {
          const active = status === s;
          return (
            <TouchableOpacity
              key={s}
              onPress={() => setStatus(s)}
              className={`px-3 py-2 rounded-2xl border ${
                active
                  ? "bg-[#130F26] border-[#130F26]"
                  : "bg-white border-gray-300 dark:bg-[#0F0F0F] dark:border-zinc-700"
              }`}
            >
              <Text
                className={`${
                  active ? "text-white" : "text-gray-700 dark:text-white"
                }`}
              >
                {s}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        disabled={saving}
        onPress={handleSave}
        className={`rounded-2xl py-3 items-center ${
          saving ? "opacity-60" : ""
        } bg-[#130F26]`}
      >
        <Text className="text-white font-semibold">
          {saving ? "Salvando..." : "Salvar"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
