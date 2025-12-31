import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signOut } from "./authSlice";
import { supabase } from "../../lib/supabase";
import { Note } from "../../types";

interface NotesState {
  items: Note[];
  loading: boolean;
  error: string | null;
}

const initialState: NotesState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchNotes = createAsyncThunk(
  "notes/fetchNotes",
  async (userId: string) => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) throw error.message;
    return data as Note[];
  }
);

export const addNote = createAsyncThunk(
  "notes/addNote",
  async ({
    title,
    content,
    user_id,
  }: {
    title: string;
    content: string;
    user_id: string;
  }) => {
    const { data, error } = await supabase
      .from("notes")
      .insert([{ title, content, user_id }])
      .select()
      .single();

    if (error) throw error.message;
    return data as Note;
  }
);

export const updateNote = createAsyncThunk(
  "notes/updateNote",
  async ({
    id,
    title,
    content,
  }: {
    id: string;
    title: string;
    content: string;
  }) => {
    const { data, error } = await supabase
      .from("notes")
      .update({ title, content, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error.message;
    return data as Note;
  }
);

export const deleteNote = createAsyncThunk(
  "notes/deleteNote",
  async (id: string) => {
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) throw error.message;
    return id;
  }
);

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch notes";
      });

    builder.addCase(addNote.fulfilled, (state, action) => {
      state.items.unshift(action.payload);
    });

    builder.addCase(updateNote.fulfilled, (state, action) => {
      const index = state.items.findIndex((n) => n.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });

    builder.addCase(deleteNote.fulfilled, (state, action) => {
      state.items = state.items.filter((n) => n.id !== action.payload);
    });
    builder.addCase(signOut.fulfilled, (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    });
  },
});

export default notesSlice.reducer;
