import React, { useState } from "react";
import { View, Alert } from "react-native";
import SafeAreaWrapper from "../../../utils/safeAreaWrapper";
import AppHeader from "../../../components/AppHeader";
import InputField from "../../../components/Input";
import Button from "../../../components/Button";
import AccountService from "../ChangePassword/services/accountService";
import { useTranslation } from "react-i18next";
import { Text } from "react-native";

export default function ForgotPassword() {
  const { t } = useTranslation("changePassword");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleSubmit() {
    if (!currentPassword || !newPassword || !confirm) {
      Alert.alert(t("title"), t("password_form_required"));
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert(t("title"), t("password_min_length"));
      return;
    }
    if (newPassword !== confirm) {
      Alert.alert(t("title"), t("password_mismatch"));
      return;
    }

    try {
      setLoading(true);
      await AccountService.changePassword({
        currentPassword,
        newPassword,
      });
      Alert.alert(t("title"), t("password_changed_success"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? t("password_changed_error");
      Alert.alert(t("title"), msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaWrapper>
      <AppHeader title="" showBack />

      <View className="px-4 py-4">
        <View className="mb-4">
          <Text className="text-3xl font-bold mt-6 dark:text-white">
            {t("forgot_password")}
          </Text>
          <Text className="text-lg text-black50 dark:text-gray-300 mt-2">
            {t("forgot_password_description")}
          </Text>
        </View>
        <InputField
          label={t("current_password_label")}
          placeholder={t("current_password_placeholder")}
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry={!showCurrent}
          rightIcon={showCurrent ? "eye-outline" : "eye-off-outline"}
          onIconPress={() => setShowCurrent(!showCurrent)}
        />

        <InputField
          label={t("new_password_label")}
          placeholder={t("new_password_placeholder")}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!showNew}
          rightIcon={showNew ? "eye-outline" : "eye-off-outline"}
          onIconPress={() => setShowNew(!showNew)}
        />

        <InputField
          label={t("confirm_password_label")}
          placeholder={t("confirm_password_placeholder")}
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry={!showConfirm}
          rightIcon={showCurrent ? "eye-outline" : "eye-off-outline"}
          onIconPress={() => setShowConfirm(!showConfirm)}
        />

        <View className="mt-6">
          <Button
            label={loading ? t("loading") : t("reset_password")}
            onPress={handleSubmit}
            disabled={loading}
            textColor="text-white"
          />
        </View>
      </View>
    </SafeAreaWrapper>
  );
}
