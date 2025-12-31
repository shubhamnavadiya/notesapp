import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAppSelector } from "../store/hooks";
import { ActivityIndicator, View } from "react-native";
import { RootStackParamList } from "../types";

import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";

import HomeScreen from "../screens/home/HomeScreen";
import EditNoteScreen from "../screens/notes/EditNoteScreen";

const Stack = createStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { session, isInitialized } = useAppSelector((state) => state.auth);

  if (!isInitialized) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {session ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EditNote"
              component={EditNoteScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CreateNote"
              component={EditNoteScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Auth"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
