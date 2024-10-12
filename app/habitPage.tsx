import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import useGetSingleHabit from "@/db/useGetSingleHabit";
import { Ionicons } from "@expo/vector-icons";
import { addHabitLog, deleteHabit } from "@/db/database";
import { useQueryClient } from "@tanstack/react-query";
import { Button, FAB, Icon } from "@rneui/themed";
import HabitLogList from "@/components/organisms/HabitLogList";
import HabitChart from "@/components/molecules/HabitChart";
import HabitContributionChart from "@/components/molecules/HabitContributionGraph";

const HabitPage = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const { data: habit } = useGetSingleHabit(parseInt(id as string));
  const [numericValue, setNumericValue] = useState<string>("");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (habit) {
      navigation.setOptions({
        title: habit.name,
        headerStyle: { backgroundColor: "#6200EE" },
        headerTintColor: "#fff",
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => router.push(`/addHabit?id=${habit.id}`)}
            >
              <Ionicons name="pencil" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteHabit(habit.id!)}
              style={styles.deleteButton}
            >
              <Ionicons name="trash" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        ),
      });
    }
  }, [habit]);

  const handleAddEntry = async () => {
    if (habit?.type === "numeric" && numericValue === "") {
      Alert.alert("Please enter a numeric value.");
      return;
    }

    await addHabitLog(
      habit?.id!,
      new Date().toISOString(),
      habit?.type === "numeric" ? parseFloat(numericValue) : 1
    );
    queryClient.invalidateQueries({ queryKey: ["habitLogs", habit?.id] });
    setNumericValue("");
  };

  const handleDeleteHabit = (habitId: number) => {
    Alert.alert(
      "Delete Habit",
      "Are you sure you want to delete this habit?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteHabit(habitId);
            queryClient.invalidateQueries({ queryKey: ["habits"] });
            router.back();
          },
        },
      ]
    );
  };

  if (!habit) return <Text style={styles.loadingText}>Loading...</Text>;

  return (
    <SafeAreaView style={styles.container}>
      {habit.type === "numeric" ? (
        <HabitChart habitId={habit.id!} />
      ) : (
        <HabitContributionChart habitId={habit.id!} />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.inputContainer}
      >
        {habit.type === "numeric" && (
          <TextInput
            style={styles.numericInput}
            placeholder="Enter value"
            keyboardType="numeric"
            value={numericValue}
            onChangeText={setNumericValue}
            placeholderTextColor="#aaa"
          />
        )}
        <Button
          title="Add Entry"
          buttonStyle={styles.addButton}
          onPress={handleAddEntry}
          icon={<Icon name="plus" type="feather" color="#fff" />}
        />
      </KeyboardAvoidingView>

      <HabitLogList
        habitId={habit.id!}
        unit={habit.unit || ""}
        isNumeric={habit.type === "numeric"}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    marginLeft: 15,
  },
  loadingText: {
    flex: 1,
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
    color: "#666",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 15,
  },
  numericInput: {
    flex: 1,
    height: 50,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    marginRight: 10,
    color: "#333",
  },
  addButton: {
    backgroundColor: "#6200EE",
    borderRadius: 10,
    paddingHorizontal: 20,
    height: 50,
  },
});

export default HabitPage;
