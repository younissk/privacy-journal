import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Platform,
  Animated,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { addJournal } from "../db/database";
import { useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "@/theme/useThemeState";

const AddJournal = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const router = useRouter();
  const { theme } = useThemeStore();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const currentDate = new Date();

  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const hour = currentDate.getHours();
  let timeOfDay = "";
  if (hour < 12) {
    timeOfDay = "morning";
  } else if (hour < 17) {
    timeOfDay = "afternoon";
  } else if (hour < 20) {
    timeOfDay = "evening";
  } else {
    timeOfDay = "night";
  }

  const handleSave = async () => {
    await addJournal({
      title: title,
      content: content,
      dateCreated: new Date().toISOString(),
    });
    queryClient.invalidateQueries({ queryKey: ["journals"] });
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.innerContainer}>
            <Text style={[styles.dateText, { color: theme.colors.text }]}>
              {formattedDate} {timeOfDay && `- ${timeOfDay}`}
            </Text>
            <TextInput
              placeholder="Enter your title here..."
              style={[styles.titleInput, { color: theme.colors.text }]}
              placeholderTextColor={theme.colors.text}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              placeholder="Enter your content here..."
              style={[styles.contentInput, { color: theme.colors.text }]}
              placeholderTextColor={theme.colors.text}
              value={content}
              onChangeText={setContent}
              multiline
            />
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Text style={styles.charCount}>
                  {content.length} characters
                </Text>

                <Ionicons
                  name="arrow-forward-circle"
                  type="ionicon"
                  color="black"
                  size={28}
                  onPress={handleSave}
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // White background for a clean look
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 20,
  },
  dateText: {
    fontSize: 14, // Smaller font size
    color: "#888888", // Lighter color for subtlety
    marginBottom: 10,
  },
  titleInput: {
    fontSize: 32, // Large font size for the title
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
    borderWidth: 0,
    backgroundColor: "transparent",
    padding: 0,
    lineHeight: 38,
  },
  contentInput: {
    flex: 1,
    fontSize: 18,
    color: "#333333",
    borderWidth: 0,
    backgroundColor: "transparent",
    padding: 0,
    textAlignVertical: "top",
    lineHeight: 26,
  },
  charCount: {
    textAlign: "right",
    color: "#888888",
    fontSize: 14,
    marginTop: 5,
  },
  fabContainer: {
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  fab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  fabText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 8,
    fontWeight: "bold",
  },
});

export default AddJournal;
