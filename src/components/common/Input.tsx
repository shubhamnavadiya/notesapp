import React from "react";
import {
  View,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Typography } from "./Typography";

interface Props extends TextInputProps {
  label?: string;
  icon?: keyof typeof FontAwesome.glyphMap;
  rightIcon?: keyof typeof FontAwesome.glyphMap;
  onRightIconPress?: () => void;
  error?: string;
  containerClassName?: string;
}

export const Input = ({
  label,
  icon,
  rightIcon,
  onRightIconPress,
  error,
  containerClassName,
  className,
  ...props
}: Props) => {
  return (
    <View className={`mb-4 ${containerClassName || ""}`}>
      {label && (
        <Typography variant="label" className="ml-1">
          {label}
        </Typography>
      )}

      <View
        className={`flex-row items-center bg-gray-50 dark:bg-gray-800 border ${
          error ? "border-error" : "border-gray-200 dark:border-gray-700"
        } rounded-xl px-4 h-14`}
      >
        {icon && (
          <FontAwesome
            name={icon}
            size={20}
            color="#9CA3AF"
            style={{ marginRight: 12 }}
          />
        )}
        <TextInput
          className={`flex-1 text-gray-900 dark:text-white text-base ${
            className || ""
          }`}
          placeholderTextColor="#9CA3AF"
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} className="ml-2">
            <FontAwesome name={rightIcon} size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Typography variant="caption" className="text-error mt-1 ml-1">
          {error}
        </Typography>
      )}
    </View>
  );
};
