import { TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

type QuickActionCardProps = {
  icon: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
  variant?: "filled" | "outlined";
};

export default function QuickActionCard({
  icon,
  title,
  subtitle,
  onPress,
  variant = "filled",
}: QuickActionCardProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const isFilled = variant === "filled";

  const bgColor = isFilled
    ? isDark
      ? "#1E1E2D"
      : "#130F26"
    : isDark
    ? "transparent"
    : "#FFFFFF";

  const borderColor = isFilled ? "transparent" : isDark ? "#FFFFFF" : "#130F26";

  const iconBg = isFilled
    ? isDark
      ? "#FFFFFF20"
      : "#1C1B35"
    : isDark
    ? "#2D2D2D"
    : "#F1F1F1";

  const iconColor = isFilled ? "#FFFFFF" : isDark ? "#FFFFFF" : "#130F26";

  const textColor = isFilled ? "#FFFFFF" : isDark ? "#FFFFFF" : "#130F26";

  const subtitleColor = isFilled ? "#E5E5E5" : isDark ? "#CCCCCC" : "#6B7280";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
        borderWidth: isFilled ? 0 : 2,
      }}
      className="flex-1 rounded-2xl p-5 mx-1 items-center justify-center"
    >
      <View
        style={{ backgroundColor: iconBg }}
        className="w-10 h-10 rounded-full items-center justify-center mb-3"
      >
        <Ionicons name={icon as any} size={22} color={iconColor} />
      </View>

      <Text
        style={{ color: textColor }}
        className="text-base font-semibold mb-1 text-center"
      >
        {title}
      </Text>

      <Text style={{ color: subtitleColor }} className="text-xs text-center">
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
}
