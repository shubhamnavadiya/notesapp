import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  StatusBar,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { RootStackParamList, Note } from "../../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { FontAwesome } from "@expo/vector-icons";
import { ThemeToggle } from "../../components/common/ThemeToggle";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchNotes, deleteNote } from "../../store/slices/notesSlice";
import { signOut } from "../../store/slices/authSlice";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const {
    items: notes,
    loading,
    error,
  } = useAppSelector((state) => state.notes);
  const { session } = useAppSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  useFocusEffect(
    useCallback(() => {
      if (session?.user.id) {
        dispatch(fetchNotes(session.user.id));
      }
    }, [dispatch, session?.user.id])
  );

  useEffect(() => {
    if (searchQuery) {
      const filtered = notes.filter((note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(notes);
    }
  }, [notes, searchQuery]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const confirmDelete = (id: string) => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => dispatch(deleteNote(id)),
      },
    ]);
  };

  const renderItem = ({ item }: { item: Note }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("EditNote", { note: item })}
      className="bg-white/80 dark:bg-gray-800/80 p-5 rounded-2xl mb-4 shadow-sm border border-white/50 dark:border-gray-700 flex-row justify-between items-start active:bg-white/90 dark:active:bg-gray-700"
    >
      <View className="flex-1 mr-4">
        <Text
          className="text-lg font-bold text-gray-900 dark:text-white mb-2"
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text
          className="text-gray-600 dark:text-gray-300 text-sm leading-5"
          numberOfLines={3}
        >
          {item.content}
        </Text>
        <Text className="text-gray-400 dark:text-gray-500 text-xs mt-3">
          {new Date(item.updated_at).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => confirmDelete(item.id)}
        className="p-2 rounded-full bg-red-50 dark:bg-red-900/30 active:bg-red-100 dark:active:bg-red-900/50 items-center justify-center w-8 h-8"
      >
        <FontAwesome name="trash" size={14} color="#EF4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1">
      <LinearGradient
        colors={
          isDark ? ["#1f2937", "#111827"] : ["#e0e7ff", "#f3e8ff", "#ffffff"]
        }
        className="absolute top-0 left-0 right-0 bottom-0"
      />
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

        {/* Header */}
        <View className="px-6 py-4 flex-row justify-between items-center">
          <View className="flex-row items-center">
            <LinearGradient
              colors={["#4F46E5", "#7C3AED"]}
              className="w-10 h-10 rounded-xl items-center justify-center mr-3 shadow-md shadow-indigo-300 dark:shadow-none"
            >
              <FontAwesome name="sticky-note" size={20} color="white" />
            </LinearGradient>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              My Notes
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <ThemeToggle />
            <TouchableOpacity
              onPress={() => dispatch(signOut())}
              className="w-10 h-10 bg-white/50 dark:bg-gray-800/50 rounded-full items-center justify-center shadow-sm border border-white/20 dark:border-gray-700"
            >
              <FontAwesome name="sign-out" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View className="px-6 py-4">
          <View className="flex-row items-center bg-white/80 dark:bg-gray-800/80 px-4 h-12 rounded-xl shadow-sm border border-white/50 dark:border-gray-700">
            <FontAwesome
              name="search"
              size={18}
              color="#9CA3AF"
              style={{ marginRight: 10 }}
            />
            <TextInput
              placeholder="Search notes..."
              placeholderTextColor="#9CA3AF"
              onChangeText={(text) => handleSearch(text)}
              value={searchQuery}
              className="flex-1 text-base text-gray-900 dark:text-white"
            />
          </View>
        </View>

        {/* Error State */}
        {error ? (
          <View className="flex-1 justify-center items-center px-6">
            <View className="w-20 h-20 bg-red-50 dark:bg-red-900/30 rounded-full items-center justify-center mb-4">
              <FontAwesome
                name="exclamation-triangle"
                size={40}
                color="#EF4444"
              />
            </View>
            <Text className="text-gray-900 dark:text-white text-xl font-bold mb-2">
              Something went wrong
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-center mb-6">
              {error === "Network request failed"
                ? "You seem to be offline. Check your internet connection."
                : error}
            </Text>
            <TouchableOpacity
              onPress={() =>
                session?.user.id && dispatch(fetchNotes(session.user.id))
              }
              className="bg-indigo-600 px-6 py-3 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              <Text className="text-white font-bold">Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : loading && notes.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#4F46E5" />
          </View>
        ) : (
          <FlatList
            data={filteredNotes}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 24, paddingTop: 0 }}
            ListEmptyComponent={
              <View className="items-center justify-center mt-20">
                <View className="w-20 h-20 bg-white/50 dark:bg-gray-800/50 rounded-full items-center justify-center mb-4">
                  <FontAwesome name="file-text-o" size={40} color="#9CA3AF" />
                </View>
                <Text className="text-gray-500 text-lg font-medium">
                  No notes yet
                </Text>
                <Text className="text-gray-400 text-sm text-center mt-2 px-10">
                  Tap the + button to create your first note.
                </Text>
              </View>
            }
          />
        )}

        {/* Floating Action Button */}
        <TouchableOpacity
          className="absolute bottom-10 right-6 z-50 rounded-full shadow-lg"
          style={{ elevation: 5 }}
          onPress={() => navigation.navigate("CreateNote")}
        >
          <LinearGradient
            colors={["#4F46E5", "#7C3AED"]}
            className="w-14 h-14 rounded-full items-center justify-center"
          >
            <FontAwesome name="plus" size={24} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
