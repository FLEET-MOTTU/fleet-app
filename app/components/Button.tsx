import { Text, TouchableOpacity } from "react-native";

interface AppButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export default function Button({
  label,
  onPress,
  disabled = false,
  loading = false,
  className = "",
}: AppButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`bg-darkBlue rounded-2xl py-4 mb-6 shadow-lg active:opacity-90 cursor-pointer
        ${disabled || loading ? "opacity-60" : ""} ${className}`}
    >
      <Text className="text-white text-center font-semibold text-xl">
        {loading ? "Entrando..." : label}
      </Text>
    </TouchableOpacity>
  );
}
