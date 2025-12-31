import React from "react";
import {
  TouchableOpacity,
  ActivityIndicator,
  TouchableOpacityProps,
  View,
} from "react-native";
import { Typography } from "./Typography";
import { LinearGradient } from "expo-linear-gradient";

interface Props extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gradient";
  className?: string;
}

export const Button = ({
  title,
  loading,
  variant = "primary",
  className,
  disabled,
  ...props
}: Props) => {
  let containerStyle = "h-14 rounded-xl flex-row items-center justify-center";
  let textStyle = "font-bold text-lg";
  let textColor = "";

  if (variant !== "gradient") {
    containerStyle += " px-6";
  }

  switch (variant) {
    case "primary":
      containerStyle +=
        " bg-indigo-600 dark:bg-indigo-500 shadow-lg shadow-indigo-200 dark:shadow-none";
      textColor = "text-white";
      break;
    case "secondary":
      containerStyle += " bg-emerald-500 shadow-sm";
      textColor = "text-white";
      break;
    case "outline":
      containerStyle +=
        " bg-transparent border border-indigo-600 dark:border-indigo-400";
      textColor = "text-indigo-600 dark:text-indigo-400";
      break;
    case "ghost":
      containerStyle += " bg-transparent shadow-none h-auto p-2";
      textColor = "text-indigo-600 dark:text-indigo-400";
      textStyle = "font-semibold text-base";
      break;
    case "gradient":
      containerStyle +=
        " shadow-lg shadow-indigo-300 dark:shadow-none p-0 overflow-hidden"; // p-0 to let gradient fill
      textColor = "text-white";
      break;
  }

  if (disabled) {
    containerStyle += " opacity-50";
  }

  const content = loading ? (
    <ActivityIndicator
      color={variant === "outline" || variant === "ghost" ? "#4F46E5" : "white"}
    />
  ) : (
    <Typography className={`${textStyle} ${textColor}`}>{title}</Typography>
  );

  if (variant === "gradient") {
    return (
      <TouchableOpacity
        className={`${containerStyle} ${className || ""}`}
        disabled={disabled || loading}
        activeOpacity={0.8}
        {...props}
      >
        <LinearGradient
          colors={["#4F46E5", "#d0b5ffff"]} // Indigo-600 to Violet-600
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          className="w-full h-full items-center justify-center px-6"
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      className={`${containerStyle} ${className || ""}`}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {content}
    </TouchableOpacity>
  );
};
