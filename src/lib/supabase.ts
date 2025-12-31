import "react-native-url-polyfill/auto";
import * as SecureStore from "expo-secure-store";
import { createClient } from "@supabase/supabase-js";

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl =
  process?.env?.EXPO_PUBLIC_SUPABASE_URL ??
  "https://xepmsfeqjksnvclljsjq.supabase.co";
const supabaseAnonKey =
  process?.env?.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlcG1zZmVxamtzbnZjbGxqc2pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMjYyOTgsImV4cCI6MjA4MjYwMjI5OH0.wVW2Dd3UDqDXJKdg5FZhln4-CDbkzJCzw07Dxtd74Z4";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase environment variables! Check your .env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
