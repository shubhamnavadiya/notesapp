import React from "react";
import { TouchableOpacity } from "react-native";
import { useColorScheme } from "nativewind";
import { FontAwesome } from "@expo/vector-icons";

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <TouchableOpacity
      onPress={toggleColorScheme}
      className="p-2 rounded-full bg-surface border border-gray-200 dark:border-gray-700 items-center justify-center shadow-sm"
    >
      <FontAwesome
        name={colorScheme === "dark" ? "sun-o" : "moon-o"}
        size={20}
        color={colorScheme === "dark" ? "#FBBF24" : "#6B7280"}
      />
    </TouchableOpacity>
  );
}
