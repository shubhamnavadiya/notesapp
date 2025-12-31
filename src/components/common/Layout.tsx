import React from "react";
import { View, ViewProps, StatusBar } from "react-native";
import { useColorScheme } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props extends ViewProps {
  children: React.ReactNode;
  variant?: "default" | "centered";
  noPadding?: boolean;
}

export const Layout = ({
  children,
  variant = "default",
  noPadding = false,
  className,
  ...props
}: Props) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const baseStyle = "flex-1 bg-gray-50 dark:bg-gray-900";
  let containerStyle = baseStyle;

  if (variant === "centered") {
    containerStyle += " justify-center items-center";
  }

  return (
    <SafeAreaView className={containerStyle} edges={["top", "left", "right"]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#111827" : "#F9FAFB"}
      />
      <View
        className={`flex-1 ${variant === "centered" ? "w-full max-w-sm" : ""} ${
          className || ""
        }`}
        {...props}
      >
        {children}
      </View>
    </SafeAreaView>
  );
};
