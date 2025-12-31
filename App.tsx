import "./global.css";
import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "./src/store";
import { useAppDispatch, useAppSelector } from "./src/store/hooks";
import { initializeAuth, setSession } from "./src/store/slices/authSlice";
import RootNavigator from "./src/navigation/RootNavigator";
import { supabase } from "./src/lib/supabase";

const AppContent = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAuth());

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session));
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return <RootNavigator />;
};

const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
