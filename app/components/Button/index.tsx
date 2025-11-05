import { Text, TouchableOpacity, ActivityIndicator, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AppButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  bgColor?: string; // cor de fundo customizável
  textColor?: string; // cor do texto
  icon?: keyof typeof Ionicons.glyphMap; // ícone opcional
  iconPosition?: "left" | "right"; // posição do ícone
  size?: "sm" | "md" | "lg"; // tamanhos predefinidos
}

export default function Button({
  label,
  onPress,
  disabled = false,
  loading = false,
  className = "",
  bgColor = "bg-darkBlue", // cor padrão Fleet
  textColor = "text-white",
  icon,
  iconPosition = "left",
  size = "md",
}: AppButtonProps) {
  const sizeClasses =
    size === "sm" ? "h-[40px]" : size === "lg" ? "h-[56px]" : "h-[48px]"; // md padrão

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`
        flex-row items-center justify-center rounded-xl active:opacity-90
        ${bgColor} ${sizeClasses}
        ${disabled || loading ? "opacity-60" : ""}
        ${className}
      `}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <View className="flex-row items-center justify-center gap-2">
          {icon && iconPosition === "left" && (
            <Ionicons name={icon} size={20} color="#fff" />
          )}
          <Text className={`${textColor} font-semibold text-xl`}>{label}</Text>
          {icon && iconPosition === "right" && (
            <Ionicons name={icon} size={20} color="#fff" />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}
