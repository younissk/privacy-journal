import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FAB } from "@rneui/themed";
import { addJournal } from "../db/database";
import { Journal } from "@/interfaces/Journal";
import { useQueryClient } from "@tanstack/react-query";

const AddJournal = () => {
  const queryClient = useQueryClient(); 
  const navigation = useNavigation();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior="padding">
          <View style={styles.innerContainer}>
            <Text style={styles.headerText}>Add Journal</Text>
            <TextInput
              placeholder="Title"
              style={styles.titleInput}
              placeholderTextColor="#888"
              value={title}
              onChangeText={(text) => setTitle(text)}
            />
            <TextInput
              placeholder="Content"
              multiline={true}
              style={styles.contentInput}
              placeholderTextColor="#888"
              value={content}
              onChangeText={(text) => setContent(text)}
            />
          </View>
          <FAB
            icon={{ name: "arrow-right", color: "white" }}
            color="#6200EE"
            style={styles.fab}
            onPress={async () => {
              await addJournal({
                title: title,
                content: content,
                dateCreated: new Date().toISOString(),
              });
              queryClient.invalidateQueries({ queryKey: ["journals"] });
              router.back();
            }}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    backgroundColor: "#f5f5f5",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  titleInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  contentInput: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
  fab: {
    alignSelf: "flex-end",
    marginTop: 20,
  },
});

export default AddJournal;
