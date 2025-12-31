import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../types";
import { FontAwesome } from "@expo/vector-icons";
import { Typography } from "../../components/common/Typography";
import { ThemeToggle } from "../../components/common/ThemeToggle";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addNote, updateNote } from "../../store/slices/notesSlice";

type EditNoteScreenNavigationProp =
  | StackNavigationProp<RootStackParamList, "EditNote">
  | StackNavigationProp<RootStackParamList, "CreateNote">;
type EditNoteScreenRouteProp =
  | RouteProp<RootStackParamList, "EditNote">
  | RouteProp<RootStackParamList, "CreateNote">;

interface Props {
  navigation: EditNoteScreenNavigationProp;
  route: EditNoteScreenRouteProp;
}

export default function EditNoteScreen({ navigation, route }: Props) {
  const dispatch = useAppDispatch();
  const { session } = useAppSelector((state) => state.auth);
  const noteToEdit = route.params?.note;
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
      navigation.setOptions({ headerShown: false });
    } else {
      navigation.setOptions({ headerShown: false });
    }
  }, [noteToEdit, navigation]);

  const saveNote = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }

    const user_id = session?.user.id;

    if (!user_id) {
      Alert.alert("Error", "No user session found");
      return;
    }

    setLoading(true);

    try {
      if (noteToEdit) {
        await dispatch(
          updateNote({
            id: noteToEdit.id,
            title,
            content,
          })
        ).unwrap();
      } else {
        await dispatch(
          addNote({
            title,
            content,
            user_id,
          })
        ).unwrap();
      }
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={
          isDark ? ["#1f2937", "#111827"] : ["#e0e7ff", "#f3e8ff", "#ffffff"]
        }
        className="absolute top-0 left-0 right-0 bottom-0"
      />
      <SafeAreaView
        className="flex-1"
        edges={["top", "left", "right", "bottom"]}
      >
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

        {/* Header */}
        <View className="flex-row justify-between items-center px-6 py-4 border-b border-gray-100/20">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 rounded-full w-10 h-10 items-center justify-center bg-white/50 dark:bg-gray-800/50"
          >
            <FontAwesome
              name="arrow-left"
              size={20}
              color={isDark ? "white" : "#374151"}
            />
          </TouchableOpacity>

          <Typography
            variant="h3"
            className="text-gray-900 dark:text-white flex-1 text-center font-bold"
          >
            {noteToEdit ? "Edit Note" : "New Note"}
          </Typography>

          <View className="flex-row items-center gap-3">
            <ThemeToggle />
            <TouchableOpacity
              onPress={saveNote}
              disabled={loading}
              className="shadow-sm"
            >
              <LinearGradient
                colors={["#4F46E5", "#7C3AED"]}
                className="px-4 py-2 rounded-full items-center justify-center"
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Typography className="text-white font-bold text-sm">
                    Save
                  </Typography>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <ScrollView className="flex-1 p-6">
            <TextInput
              className="text-3xl font-bold text-gray-900 dark:text-white mb-6"
              placeholder="Note Title"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
              multiline
            />
            <View className="flex-1 bg-white/50 dark:bg-gray-800/30 rounded-3xl p-4 min-h-[500px]">
              <TextInput
                className="text-lg text-gray-700 dark:text-gray-300 leading-7 flex-1"
                placeholder="Start writing..."
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
                placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
