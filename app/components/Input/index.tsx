import React from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

interface InputFieldProps {
  label: string;
  value?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  icon?: string;
  secureTextEntry?: boolean;
  onIconPress?: () => void;
  editable?: boolean;
  children?: React.ReactNode;
  rightIcon?: string;
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
  rightIcon,
  children,
}: InputFieldProps) {
  const { colorScheme } = useColorScheme();
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
            className="flex-1 text-black dark:text-white text-[15px]"
            placeholder={placeholder}
            placeholderTextColor={
              colorScheme === "dark" ? "#FFFFFF" : "#000000"
            }
            value={value}
            editable={editable}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
          />
        </View>
        {/* renderiza children (ex: Switch ou ícone) */}
        {!children && onIconPress && (
          <TouchableOpacity onPress={onIconPress} className="p-2">
            <Ionicons
              name={(rightIcon ?? "chevron-forward-outline") as any}
              size={18}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
