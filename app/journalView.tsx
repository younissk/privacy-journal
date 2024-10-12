import React, { useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import useGetSingleJournal from "@/db/useGetSingleJournal";
import { deleteJournal } from "@/db/database";
import { useQueryClient } from "@tanstack/react-query";

const JournalView = () => {
  const { id } = useLocalSearchParams();
  const { data: journal } = useGetSingleJournal(parseInt(id as string));
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  // Format the date
  const formattedDate = journal
    ? new Date(journal.dateCreated).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: formattedDate,
      headerRight: () => (
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="trash"
            size={24}
            color="black"
            onPress={async () => {
              await deleteJournal(journal?.id!);
              await queryClient.invalidateQueries({ queryKey: ["journals"] });
              await queryClient.invalidateQueries({ queryKey: ["journal", id] });
              router.back();
            }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  if (!journal) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.titleText}>{journal.title}</Text>
        <Text style={styles.contentText}>{journal.content}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 80,
  },
  dateText: {
    fontSize: 16,
    color: "#888",
    marginBottom: 10,
    textAlign: "center",
  },
  titleText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  contentText: {
    fontSize: 18,
    color: "#444",
    lineHeight: 28,
    textAlign: "justify",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  loadingText: {
    fontSize: 18,
    color: "#888",
  },
});

export default JournalView;
