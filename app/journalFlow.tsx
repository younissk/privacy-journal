import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import {
  getJournalFlowById,
  getFlowStepsByFlowId,
  addJournal,
  addHabitLog,
  getHabitById,
} from "@/db/database";
import { FlowStep, Habit } from "@/interfaces/Journal";
import { Ionicons } from "@expo/vector-icons";
import ConfettiCannon from "react-native-confetti-cannon";
import { useRef } from "react";

const JournalFlowPage = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const [steps, setSteps] = useState<FlowStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [journalContent, setJournalContent] = useState('');
  const [habit, setHabit] = useState<Habit | null>(null);
  const [flowCompleted, setFlowCompleted] = useState(false);
  const confettiRef = useRef<ConfettiCannon | null>(null);

  useEffect(() => {
    (async () => {
      const flow = await getJournalFlowById(parseInt(id as string));
      navigation.setOptions({ title: flow.name });

      const flowSteps = await getFlowStepsByFlowId(flow.id!);
      setSteps(flowSteps);
    })();
  }, [id]);

  useEffect(() => {
    const currentStep = steps[currentStepIndex];
    if (currentStep && currentStep.stepType === 'habit_checkin') {
      (async () => {
        const habitId = parseInt(currentStep.content);
        const habitData = await getHabitById(habitId);
        setHabit(habitData);
      })();
    } else {
      setHabit(null);
    }
  }, [currentStepIndex, steps]);

  const currentStep = steps[currentStepIndex];

  const handleNext = async () => {
    if (currentStep.stepType === 'prompt' || currentStep.stepType === 'empty_journal') {
      // Save journal entry
      await addJournal({
        title:
          currentStep.stepType === 'prompt'
            ? currentStep.content
            : 'Journal Entry',
        content: journalContent,
        dateCreated: new Date().toISOString(),
      });
      setJournalContent('');
    } else if (currentStep.stepType === 'habit_checkin') {
      // Add habit log
      await addHabitLog(
        parseInt(currentStep.content), // Assuming content is habitId
        new Date().toISOString(),
        1
      );
    }

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Flow completed
      setFlowCompleted(true);
    }
  };

  if (!currentStep && !flowCompleted) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.messageText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (flowCompleted) {
    return (
      <SafeAreaView style={styles.container}>
        <ConfettiCannon
          count={200}
          origin={{ x: -10, y: 0 }}
          fadeOut
        />
        <View style={styles.contentContainer}>
          <Text style={styles.congratsText}>Congratulations!</Text>
          <Text style={styles.congratsMessage}>
            You have completed the journal flow.
          </Text>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {currentStep.stepType === "quote" && (
            <View style={styles.contentContainer}>
              <Text style={styles.quoteText}>{currentStep.content}</Text>
              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          )}

          {(currentStep.stepType === "prompt" ||
            currentStep.stepType === "empty_journal") && (
            <View style={styles.contentContainer}>
              {currentStep.stepType === "prompt" && (
                <Text style={styles.promptText}>{currentStep.content}</Text>
              )}
              <TextInput
                style={styles.input}
                placeholder="Write your response..."
                value={journalContent}
                onChangeText={setJournalContent}
                multiline
              />
              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          )}

          {currentStep.stepType === "habit_checkin" && (
            <View style={styles.contentContainer}>
              <Text style={styles.promptText}>Check-in for your habit:</Text>
              {habit && (
                <View style={styles.habitContainer}>
                  <Ionicons
                    name={habit.icon as any}
                    size={40}
                    color={habit.color || "#6200EE"}
                  />
                  <Text style={styles.habitName}>{habit.name}</Text>
                </View>
              )}
              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>Mark as Done</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  contentContainer: {
    alignItems: "center",
  },
  quoteText: {
    fontSize: 24,
    fontStyle: "italic",
    textAlign: "center",
    color: "#333",
    marginBottom: 50,
  },
  promptText: {
    fontSize: 20,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 200,
    width: "100%",
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
    textAlignVertical: "top",
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: "#6200EE",
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
    width: "100%",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  messageText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginTop: 50,
  },
  habitContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  habitName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  congratsText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6200EE',
    textAlign: 'center',
    marginBottom: 20,
  },
  congratsMessage: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  doneButton: {
    backgroundColor: '#6200EE',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    width: '100%',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default JournalFlowPage;
