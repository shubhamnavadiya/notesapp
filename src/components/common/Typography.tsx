import React from "react";
import { Text as RNText, TextProps } from "react-native";

interface Props extends TextProps {
  variant?: "h1" | "h2" | "h3" | "body" | "caption" | "label";
  color?: string;
  className?: string;
}

export const Typography = ({
  variant = "body",
  color,
  className,
  style,
  ...props
}: Props) => {
  let baseStyle = "text-gray-900 dark:text-white";

  switch (variant) {
    case "h1":
      baseStyle = "text-3xl font-bold mb-2 text-gray-900 dark:text-white";
      break;
    case "h2":
      baseStyle = "text-2xl font-bold mb-2 text-gray-900 dark:text-white";
      break;
    case "h3":
      baseStyle = "text-xl font-semibold mb-1 text-gray-900 dark:text-white";
      break;
    case "body":
      baseStyle = "text-base text-gray-600 dark:text-gray-300";
      break;
    case "label":
      baseStyle = "text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1";
      break;
    case "caption":
      baseStyle = "text-xs text-gray-400 dark:text-gray-500";
      break;
  }
  const finalClass = `${baseStyle} ${color || ""} ${className || ""}`;

  return <RNText className={finalClass} style={style} {...props} />;
};
