import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { useRouter, useLocalSearchParams } from "expo-router";
import {
  addJournalFlow,
  updateJournalFlow,
  getJournalFlowById,
  addFlowStep,
  getFlowStepsByFlowId,
  updateFlowStep,
  deleteFlowStep,
  getHabits, // Importing getHabits to fetch the list of habits
} from "@/db/database";
import { useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { FlowStep, Habit } from "@/interfaces/Journal";
import { useThemeStore } from "@/theme/useThemeState";
import { useNavigation } from "@react-navigation/native";
const AddJournalFlow = () => {
  const navigation = useNavigation();
  const { theme } = useThemeStore();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<FlowStep[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(
    null
  );
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitModalVisible, setHabitModalVisible] = useState(false);

  useEffect(() => {
    if (id) {
      // Fetch existing flow data
      (async () => {
        const flow = await getJournalFlowById(parseInt(id as string));
        setName(flow.name);
        setDescription(flow.description);
        const flowSteps = await getFlowStepsByFlowId(flow.id!);
        setSteps(flowSteps);
      })();
    }
    fetchHabits();
  }, [id]);

  const fetchHabits = async () => {
    const habitList = await getHabits();
    setHabits(habitList);
  };

  const handleSave = async () => {
    if (name.trim() === "") {
      alert("Please enter a name for the flow.");
      return;
    }

    let flowId: number;

    if (id) {
      await updateJournalFlow({
        id: parseInt(id as string),
        name,
        description,
      });
      flowId = parseInt(id as string);
    } else {
      flowId = await addJournalFlow({ name, description });
    }

    // Save steps
    for (const step of steps) {
      if (step.id) {
        await updateFlowStep(step);
      } else {
        await addFlowStep({ ...step, flowId });
      }
    }

    queryClient.invalidateQueries(["journalFlows"]);
    router.back();
  };

  const addStep = () => {
    setSteps([
      ...steps,
      {
        flowId: 0,
        stepType: "quote",
        content: "",
      },
    ]);
  };

  const updateStep = (index: number, updatedStep: FlowStep) => {
    const newSteps = [...steps];
    newSteps[index] = updatedStep;
    setSteps(newSteps);
  };

  const removeStep = async (index: number) => {
    const step = steps[index];
    if (step.id) {
      await deleteFlowStep(step.id);
    }
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
  };

  const openStepTypePicker = (index: number) => {
    setSelectedStepIndex(index);
    setModalVisible(true);
  };

  const stepTypeOptions = [
    { label: "Quote", value: "quote" },
    { label: "Prompt", value: "prompt" },
    { label: "Habit Check-in", value: "habit_checkin" },
    { label: "Empty Journal", value: "empty_journal" },
  ];

  const openHabitPicker = () => {
    setHabitModalVisible(true);
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={addStep}>
          <Text>Add Step</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={handleSave}>
          <Text>Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [steps]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          placeholder="Flow Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Description"
          style={styles.input}
          value={description}
          onChangeText={setDescription}
        />
        <ScrollView>
          {steps.map((item, index) => (
            <View key={index.toString()} style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>Step {index + 1}</Text>
              <TouchableOpacity onPress={() => removeStep(index)}>
                <Ionicons name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
            {/* Step Type Selector */}
            <TouchableOpacity
              style={styles.typeSelector}
              onPress={() => openStepTypePicker(index)}
            >
              <Text style={styles.typeSelectorText}>
                {stepTypeOptions.find((opt) => opt.value === item.stepType)
                  ?.label || "Select Step Type"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#888" />
            </TouchableOpacity>
            {/* Content Input */}
            {item.stepType === "habit_checkin" ? (
              <TouchableOpacity
                style={styles.typeSelector}
                onPress={openHabitPicker}
              >
                <Text style={styles.typeSelectorText}>
                  {habits.find((h) => h.id?.toString() === item.content)
                    ?.name || "Select Habit"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#888" />
              </TouchableOpacity>
            ) : item.stepType === "empty_journal" ? (
              <Text style={styles.infoText}>
                This will open an empty journal entry.
              </Text>
            ) : (
              <TextInput
                placeholder={
                  item.stepType === "quote"
                    ? "Enter Quote"
                    : item.stepType === "prompt"
                    ? "Enter Prompt"
                    : ""
                }
                style={styles.input}
                value={item.content}
                onChangeText={(text) =>
                  updateStep(index, { ...item, content: text })
                }
              />
            )}
            </View>
          ))}
        </ScrollView>

        {/* Step Type Picker Modal */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Step Type</Text>
              {stepTypeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.modalOption}
                  onPress={() => {
                    if (selectedStepIndex !== null) {
                      updateStep(selectedStepIndex, {
                        ...steps[selectedStepIndex],
                        stepType: option.value as any,
                        content: "",
                      });
                    }
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </SafeAreaView>
        </Modal>

        {/* Habit Picker Modal */}
        <Modal
          visible={habitModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setHabitModalVisible(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalContentLarge}>
              <Text style={styles.modalTitle}>Select Habit</Text>
              <ScrollView>
                {habits.map((habit) => (
                  <TouchableOpacity
                    key={habit.id}
                    style={styles.modalOption}
                    onPress={() => {
                      if (selectedStepIndex !== null) {
                        updateStep(selectedStepIndex, {
                          ...steps[selectedStepIndex],
                          content: habit.id!.toString(),
                        });
                      }
                      setHabitModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalOptionText}>{habit.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setHabitModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    padding: 20,
    backgroundColor: "#F5F7FA",
  },
  input: {
    height: 50,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
    marginBottom: 15,
  },
  stepContainer: {
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
  },
  stepHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  typeSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  typeSelectorText: {
    fontSize: 16,
    color: "#333",
  },
  addStepButton: {
    backgroundColor: "#6200EE",
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 15,
  },
  addStepButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#6200EE",
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#333",
  },
  modalCancel: {
    marginTop: 10,
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 16,
    color: "#6200EE",
  },
  infoText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  modalContentLarge: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
});

export default AddJournalFlow;
