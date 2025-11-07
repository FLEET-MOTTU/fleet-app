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
import { useTranslation } from "react-i18next";

type Props = {
  funcionario: FuncionarioResponse | null;
  funcionariosExistentes: FuncionarioResponse[];
  onClose: () => void;
};

export default function FuncionarioForm({ funcionario, onClose }: Props) {
  const { t } = useTranslation("operadores");
  const editing = !!funcionario?.id;

  const [nome, setNome] = useState(funcionario?.nome ?? "");
  const [email, setEmail] = useState(funcionario?.email ?? "");
  const [telefone, setTelefone] = useState(funcionario?.telefone ?? "");
  const [cargo, setCargo] = useState<CargoFuncionario>(
    (funcionario?.cargo as CargoFuncionario) ?? "OPERACIONAL"
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
    () => (editing ? t("form_title_edit") : t("form_title_new")),
    [editing, t]
  );

  async function pickPhoto() {
    const { status: perm } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm !== "granted") {
      Alert.alert(t("attention_title"), t("photo_permission_denied"));
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
    if (!nome.trim()) return Alert.alert(t("attention_title"), t("val_name"));
    if (!telefone.trim())
      return Alert.alert(t("attention_title"), t("val_phone"));
    if (!email.trim()) return Alert.alert(t("attention_title"), t("val_email"));
    if (!cargo) return Alert.alert(t("attention_title"), t("val_role"));

    const telefoneLimpo = telefone.replace(/\D/g, "");

    try {
      setSaving(true);

      if (editing && funcionario) {
        await atualizarFuncionario(funcionario.id, {
          nome: nome.trim(),
          email: email.trim() || undefined,
          telefone: telefoneLimpo,
          cargo,
          status, // alterna ATIVO <-> SUSPENSO
        });

        if (localPhoto) {
          await atualizarFotoFuncionario(funcionario.id, {
            uri: localPhoto.uri,
            type: localPhoto.mimeType || "image/jpeg",
            fileName: localPhoto.fileName || "foto.jpg",
          } as any);
        }
      } else {
        await cadastrarFuncionario(
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
      Alert.alert(t("error_title"), t("error_save"));
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
        <TouchableOpacity
          onPress={onClose}
          className="p-2"
          accessibilityLabel={t("a11y_close_modal")}
        >
          <Ionicons name="close" size={22} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Foto */}
      <Text className="text-xs text-gray-500 dark:text-white mb-2">
        {t("photo_label")}
      </Text>
      <View className="flex-row items-center gap-3 mb-4">
        <View className="w-16 h-16 rounded-full bg-darkBlue/30 dark:bg-zinc-800 overflow-hidden">
          {localPhoto ? (
            <Image
              source={{ uri: localPhoto.uri }}
              className="w-16 h-16"
              accessibilityLabel={t("a11y_employee_photo")}
            />
          ) : funcionario?.fotoUrl ? (
            <Image
              source={{ uri: funcionario.fotoUrl }}
              className="w-16 h-16"
              accessibilityLabel={t("a11y_employee_photo")}
            />
          ) : null}
        </View>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={pickPhoto}
            className="flex-row items-center gap-2 rounded-2xl px-3 py-2 bg-white border border-gray-200 dark:bg-[#0F0F0F] dark:border-zinc-700"
            accessibilityLabel={t("a11y_pick_photo")}
          >
            <Ionicons name="image-outline" size={18} color="#666" />
            <Text className="text-gray-700 dark:text-white">
              {t("photo_pick")}
            </Text>
          </TouchableOpacity>
          {localPhoto && (
            <TouchableOpacity
              onPress={() => setLocalPhoto(null)}
              className="flex-row items-center gap-2 rounded-2xl px-3 py-2 bg-white border border-gray-200 dark:bg-[#0F0F0F] dark:border-zinc-700"
              accessibilityLabel={t("a11y_remove_photo")}
            >
              <Ionicons name="close-circle-outline" size={18} color="#666" />
              <Text className="text-gray-700 dark:text-white">
                {t("photo_remove")}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Nome */}
      <Text className="text-xs text-gray-500 dark:text-white mb-2">
        {t("name_label")}
      </Text>
      <TextInput
        value={nome}
        onChangeText={setNome}
        placeholder={t("name_placeholder")}
        className="rounded-2xl px-4 py-3 mb-4 border bg-white border-gray-200 dark:bg-[#0F0F0F] dark:border-zinc-800 dark:text-white"
        placeholderTextColor="#9CA3AF"
        accessibilityLabel={t("a11y_name_input")}
      />

      {/* E-mail */}
      <Text className="text-xs text-gray-500 dark:text-white mb-2">
        {t("email_label")}
      </Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder={t("email_placeholder")}
        keyboardType="email-address"
        autoCapitalize="none"
        className="rounded-2xl px-4 py-3 mb-4 border bg-white border-gray-200 dark:bg-[#0F0F0F] dark:border-zinc-800 dark:text-white"
        placeholderTextColor="#9CA3AF"
        accessibilityLabel={t("a11y_email_input")}
      />

      {/* Telefone */}
      <Text className="text-xs text-gray-500 dark:text-white mb-2">
        {t("phone_label")}
      </Text>
      <TextInput
        value={telefone}
        onChangeText={setTelefone}
        placeholder={t("phone_placeholder")}
        keyboardType="phone-pad"
        className="rounded-2xl px-4 py-3 mb-4 border bg-white border-gray-200 dark:bg-[#0F0F0F] dark:border-zinc-800 dark:text-white"
        placeholderTextColor="#9CA3AF"
        accessibilityLabel={t("a11y_phone_input")}
      />

      {/* Cargo */}
      <Text className="text-xs text-gray-500 dark:text-white mb-2">
        {t("role_label")}
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
              accessibilityLabel={t("a11y_role_chip", { role: c })}
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
      <Text className="text-xs text-gray-500 dark:text-white mb-2">
        {t("status_label")}
      </Text>
      <View className="flex-row gap-2 mb-6">
        {(["ATIVO", "SUSPENSO"] as StatusFuncionario[]).map((s) => {
          const active = status === s;
          const label =
            s === "ATIVO" ? t("status_active") : t("status_suspended");
          return (
            <TouchableOpacity
              key={s}
              onPress={() => setStatus(s)}
              className={`px-3 py-2 rounded-2xl border ${
                active
                  ? "bg-[#130F26] border-[#130F26]"
                  : "bg-white border-gray-300 dark:bg-[#0F0F0F] dark:border-zinc-700"
              }`}
              accessibilityLabel={t("a11y_status_chip", { status: label })}
            >
              <Text
                className={`${
                  active ? "text-white" : "text-gray-700 dark:text-white"
                }`}
              >
                {label}
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
        accessibilityLabel={t("a11y_save_button")}
      >
        <Text className="text-white font-semibold">
          {saving ? t("saving") : t("save")}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
