import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import { Alert } from "react-native";

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  session: null,
  user: null,
  loading: false,
  error: null,
  isInitialized: false,
};

export const initializeAuth = createAsyncThunk("auth/initialize", async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
});

export const signIn = createAsyncThunk(
  "auth/signIn",
  async ({ email, password }: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error.message;
    return data.session;
  }
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async ({ email, password }: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error.message;
    return data.session;
  }
);

export const signOut = createAsyncThunk("auth/signOut", async () => {
  await supabase.auth.signOut();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload;
      state.user = action.payload?.user ?? null;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {})
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.session = action.payload;
        state.user = action.payload?.user ?? null;
        state.isInitialized = true;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isInitialized = true;
      });

    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.session = action.payload;
        state.user = action.payload?.user ?? null;
        state.loading = false;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
        Alert.alert("Login Error", state.error);
      });

    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.session = action.payload;
        state.user = action.payload?.user ?? null;
        state.loading = false;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Signup failed";
        Alert.alert("Signup Error", state.error);
      });

    builder.addCase(signOut.fulfilled, (state) => {
      state.session = null;
      state.user = null;
    });
  },
});

export const { setSession, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
