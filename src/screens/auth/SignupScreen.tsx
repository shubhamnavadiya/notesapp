import React, { useState } from "react";
import { View, TouchableOpacity, Alert, Platform } from "react-native";
import { useColorScheme } from "nativewind";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "../../components/common/Typography";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { ThemeToggle } from "../../components/common/ThemeToggle";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { signUp } from "../../store/slices/authSlice";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { LinearGradient } from "expo-linear-gradient";

type SignupScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Signup"
>;

interface Props {
  navigation: SignupScreenNavigationProp;
}

export default function SignupScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  async function signUpWithEmail() {
    let hasError = false;
    const newErrors = { email: "", password: "", confirmPassword: "" };

    if (!email) {
      newErrors.email = "Email is required";
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Invalid email address";
        hasError = true;
      }
    }

    if (!password) {
      newErrors.password = "Password is required";
      hasError = true;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      hasError = true;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
      hasError = true;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      await dispatch(signUp({ email, password })).unwrap();
    } catch (err: any) { }
  }

  const handleChange = (field: keyof typeof errors, value: string) => {
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
    if (field === "confirmPassword") setConfirmPassword(value);

    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
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
              <FontAwesome name="user-plus" size={40} color="white" />
            </LinearGradient>
            <Typography variant="h1" className="text-gray-900 dark:text-white">
              Create Account
            </Typography>
            <Typography
              variant="body"
              className="text-gray-600 dark:text-gray-400"
            >
              Start your journey with us
            </Typography>
          </View>

          <View className="bg-white/90 dark:bg-gray-800/90 p-6 rounded-3xl shadow-xl shadow-indigo-100 dark:shadow-none border border-white/50 dark:border-gray-700">
            <Input
              label="Email"
              icon="envelope"
              placeholder="hello@example.com"
              value={email}
              onChangeText={(text) => handleChange("email", text)}
              error={errors.email}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Input
              label="Password"
              icon="lock"
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => handleChange("password", text)}
              error={errors.password}
              secureTextEntry={!showPassword}
              rightIcon={!showPassword ? "eye" : "eye-slash"}
              onRightIconPress={() => setShowPassword(!showPassword)}
              autoCapitalize="none"
            />

            <Input
              label="Confirm Password"
              icon="lock"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={(text) => handleChange("confirmPassword", text)}
              error={errors.confirmPassword}
              secureTextEntry={!showConfirmPassword}
              rightIcon={!showConfirmPassword ? "eye" : "eye-slash"}
              onRightIconPress={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              autoCapitalize="none"
              containerClassName="mb-8"
            />

            <Button
              title="Sign Up"
              onPress={signUpWithEmail}
              loading={loading}
              variant="gradient"
            />

            <View className="flex-row items-center justify-center mt-6">
              <Typography
                variant="body"
                className="mr-1 text-gray-500 dark:text-gray-400"
              >
                Already have an account?
              </Typography>
              <TouchableOpacity onPress={() => navigation.replace("Auth")}>
                <Typography
                  variant="body"
                  className="text-indigo-600 dark:text-indigo-400 font-bold"
                >
                  Sign In
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
}
