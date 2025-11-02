import React from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InputFieldProps {
  label: string;
  value?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  icon?: string;
  secureTextEntry?: boolean;
  onIconPress?: () => void;
  editable?: boolean;
  children?: React.ReactNode; // <–– novo!
}

export default function InputField({
  label,
  value,
  placeholder,
  onChangeText,
  icon,
  secureTextEntry = false,
  onIconPress,
  editable = true,
  children,
}: InputFieldProps) {
  return (
    <View className="w-full mb-4">
      <Text className="text-black dark:text-white font-medium mb-1">
        {label}
      </Text>
      <View className="flex-row items-center justify-between border border-[#E5E7EB] dark:border-zinc-500 rounded-lg bg-white dark:bg-inputDark px-3 h-[48px]">
        <View className="flex-row items-center flex-1">
          {icon && (
            <Ionicons
              name={icon as any}
              size={20}
              color="#9CA3AF"
              style={{ marginRight: 8 }}
            />
          )}
          <TextInput
            className="flex-1 text-gray-900 text-[15px]"
            placeholder={placeholder}
            placeholderTextColor="#6B7280"
            value={value}
            editable={editable}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
          />
        </View>
        {/* renderiza children (ex: Switch ou ícone) */}
        {children && children}
        {!children && onIconPress && (
          <TouchableOpacity onPress={onIconPress}>
            <Ionicons
              name="chevron-forward-outline"
              size={18}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
