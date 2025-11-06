import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity } from "react-native";

export default function ActivityItem({
  icon,
  plate,
  desc,
  time,
  color,
  actions = [],
}: any) {
  return (
    <View className="flex-row justify-between items-center bg-white dark:bg-lightBlack rounded-xl p-4 mb-3 shadow-sm">
      <View className="flex-row items-center gap-3 flex-1">
        <Ionicons name={icon} size={22} color={color} />
        <View className="flex-1">
          <Text className="text-sm font-semibold dark:text-white">{plate}</Text>
          <Text className="text-xs text-gray-500 dark:text-lightText">
            {desc}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        {actions?.map((a: any, i: number) => (
          <TouchableOpacity
            key={i}
            onPress={a.onPress}
            activeOpacity={0.8}
            style={{
              backgroundColor: a.backgroundColor || "#E5E7EB",
              padding: 6,
              borderRadius: 10,
            }}
          >
            <Ionicons name={a.icon as any} size={16} color="#fff" />
          </TouchableOpacity>
        ))}

        {time ? (
          <Text className="text-xs text-gray-400 dark:text-lightText ml-1">
            {time}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
