import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from "react-native";
import { addHabit, getHabitById, updateHabit } from "@/db/database";
import { useRouter, useLocalSearchParams } from "expo-router";
import IconSelector from "@/components/molecules/IconSelector";
import ColorSelector from "@/components/molecules/ColorSelector";
import NumericHabitForm from "@/components/organisms/NumericHabitForm";
import CategorySelector from "@/components/molecules/CategorySelector";
import { useQueryClient } from "@tanstack/react-query";
import { Switch } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "@/theme/useThemeState";

const AddHabit = () => {
  const { theme } = useThemeStore();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [color, setColor] = useState("#6200EE");
  const [type, setType] = useState<"numeric" | "boolean">("boolean");
  const [unit, setUnit] = useState("");
  const [goal, setGoal] = useState("");
  const [icon, setIcon] = useState("home");
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const router = useRouter();

  const handleSave = useCallback(async () => {
    if (name.trim() === "") {
      Alert.alert("Validation Error", "Please enter a habit name.");
      return;
    }

    const habitData = {
      name,
      icon,
      type,
      color,
      unit,
      frequency: "daily",
      goal: goal ? parseFloat(goal) : 0,
      categoryId: categoryId || undefined,
      startDate: new Date().toISOString(),
    };

    if (!id) {
      await addHabit(habitData);
    } else {
      await updateHabit(habitData, parseInt(id as string));
    }

    queryClient.invalidateQueries({ queryKey: ["habits"] });
    queryClient.invalidateQueries({ queryKey: ["habit", id] });
    router.back();
  }, [name, icon, type, color, unit, goal, categoryId, id]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSave}>
          <Ionicons name="save" size={24} color="#fff" />
        </TouchableOpacity>
      ),
      headerStyle: { backgroundColor: color },
      headerTintColor: "#fff",
    });
  }, [navigation, handleSave, color]);

  useEffect(() => {
    async function fetchHabit() {
      if (id) {
        navigation.setOptions({ title: "Edit Habit" });

        const habit = await getHabitById(parseInt(id as string));

        setName(habit.name);
        setColor(habit.color || "#6200EE");
        setIcon(habit.icon || "home");
        setType(habit.type || "boolean");
        setUnit(habit.unit || "");
        setGoal(habit.goal?.toString() || "");
        setCategoryId(habit.categoryId || null);
      } else {
        navigation.setOptions({ title: "Add Habit" });
      }
    }

    fetchHabit();
  }, [id, navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.inputGroup}>
            <IconSelector icon={icon} setIcon={setIcon} color={color} />
            <ColorSelector color={color} setColor={setColor} />
            <TextInput
              placeholder="Enter habit name"
              style={[styles.input, { color: theme.colors.text }]}
              value={name}
              onChangeText={setName}
              placeholderTextColor={theme.colors.text}
            />
          </View>

          <View style={styles.switchGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Advanced Habit</Text>
            <Switch
              value={type === "numeric"}
              onValueChange={(value) => setType(value ? "numeric" : "boolean")}
              color={theme.colors.primary}
            />
          </View>

          {type === "numeric" && (
            <View style={styles.numericForm}>
              <NumericHabitForm
                unit={unit}
                setUnit={setUnit}
                goal={goal}
                setGoal={setGoal}
              />
            </View>
          )}

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Category</Text>
          <CategorySelector
            categoryId={categoryId}
            setCategoryId={setCategoryId}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
    marginLeft: 10,
  },
  switchGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  numericForm: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
});

export default AddHabit;
