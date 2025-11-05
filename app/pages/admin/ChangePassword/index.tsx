import React, { useState } from "react";
import { View, Alert } from "react-native";
import SafeAreaWrapper from "../../../utils/safeAreaWrapper";
import AppHeader from "../../../components/AppHeader";
import InputField from "../../../components/Input";
import Button from "../../../components/Button";
import AccountService from "./services/accountService";
import { useTranslation } from "react-i18next";

export default function ChangePassword() {
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
      <AppHeader title={t("title")} showBack />
      <View className="px-4 py-4">
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
            label={loading ? t("loading") : t("save_changes")}
            onPress={handleSubmit}
            disabled={loading}
            textColor="text-white"
          />
        </View>
      </View>
    </SafeAreaWrapper>
  );
}
