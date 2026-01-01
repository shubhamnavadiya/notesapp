import React, { useState } from "react";
import { View, TouchableOpacity, Alert, Platform } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "../../components/common/Typography";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { ThemeToggle } from "../../components/common/ThemeToggle";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { signIn } from "../../store/slices/authSlice";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Auth"
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  async function signInWithEmail() {
    let hasError = false;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required";
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Please enter a valid email address";
        hasError = true;
      }
    }

    if (!password) {
      newErrors.password = "Password is required";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      await dispatch(signIn({ email, password })).unwrap();
    } catch (err: any) {
      const errorMessage = err.message || err.toString();
      if (errorMessage.includes("Network request failed") || errorMessage.includes("connection") || errorMessage.includes("offline")) {
        Alert.alert("Offline", "You seem to be offline. Check your internet connection.");
      } else {
        // Redux auth slice already handles displaying most auth errors, but we can add a fallback here if needed
        // or just let the user see the visual error state if we had one.
        // For now, let's keep it consistent with other screens if it's a critical failure not handled by UI state.
      }
    }
  }

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (errors.email) setErrors({ ...errors, email: "" });
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (errors.password) setErrors({ ...errors, password: "" });
  };

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={
          isDark ? ["#1f2937", "#111827"] : ["#e0e7ff", "#f3e8ff", "#ffffff"]
        }
        className="absolute top-0 left-0 right-0 bottom-0"
      />
      <View className="flex-1">
        <View className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </View>
        <KeyboardAwareScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 24,
          }}
          enableOnAndroid={true}
          extraScrollHeight={20}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center mb-10">
            <LinearGradient
              colors={["#4F46E5", "#7C3AED"]}
              className="w-20 h-20 rounded-2xl items-center justify-center mb-6 shadow-lg shadow-indigo-300 dark:shadow-none"
            >
              <FontAwesome name="sticky-note" size={40} color="white" />
            </LinearGradient>
            <Typography variant="h1" className="text-gray-900 dark:text-white">
              Welcome Back
            </Typography>
            <Typography
              variant="body"
              className="text-gray-600 dark:text-gray-400"
            >
              Sign in to continue to your notes
            </Typography>
          </View>

          <View className="bg-white/90 dark:bg-gray-800/90 p-6 rounded-3xl shadow-xl shadow-indigo-100 dark:shadow-none border border-white/50 dark:border-gray-700">
            <Input
              label="Email"
              icon="envelope"
              placeholder="hello@example.com"
              value={email}
              onChangeText={handleEmailChange}
              error={errors.email}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Input
              label="Password"
              icon="lock"
              placeholder="••••••••"
              value={password}
              onChangeText={handlePasswordChange}
              error={errors.password}
              secureTextEntry={!showPassword}
              rightIcon={!showPassword ? "eye" : "eye-slash"}
              onRightIconPress={() => setShowPassword(!showPassword)}
              autoCapitalize="none"
            />
            <Button
              title="Sign In"
              onPress={signInWithEmail}
              loading={loading}
              variant="gradient"
            />

            <View className="flex-row items-center justify-center mt-6">
              <Typography
                variant="body"
                className="mr-1 text-gray-500 dark:text-gray-400"
              >
                Don't have an account?
              </Typography>
              <TouchableOpacity onPress={() => navigation.replace("Signup")}>
                <Typography
                  variant="body"
                  className="text-indigo-600 dark:text-indigo-400 font-bold"
                >
                  Sign Up
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
}
