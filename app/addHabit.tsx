import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Switch,
} from "react-native";
import { addHabit, getHabitById, updateHabit } from "@/db/database";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import IconSelector from "@/components/molecules/IconSelector";
import ColorSelector from "@/components/molecules/ColorSelector";
import { useNavigation } from "@react-navigation/native";
import NumericHabitForm from "@/components/organisms/NumericHabitForm";
import { ScrollView } from "react-native";
import CategorySelector from "@/components/molecules/CategorySelector";
import { useGetAllCategories } from "@/db/useGetAllCategories";
import { useQueryClient } from "@tanstack/react-query";
const AddHabit = () => {
  const navigation = useNavigation();
  const client = useQueryClient();
  const { id } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]); // State for selected weekdays
  const [color, setColor] = useState("#000000");
  const [type, setType] = useState<"numeric" | "boolean">("boolean");
  const [unit, setUnit] = useState("");
  const [goal, setGoal] = useState(0);
  const [icon, setIcon] = useState("home");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [editMode, setEditMode] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function checkId() {
      if (id) {
        navigation.setOptions({
          headerTitle: "Edit Habit",
        });

        const habit = await getHabitById(parseInt(id as string));

        setName(habit.name);
        setSelectedDays(habit.frequency.split(","));
        setColor(habit.color || "#000000");
        setIcon(habit.icon || "home");
        setType(habit.type || "boolean");
        setUnit(habit.unit || "");
        setGoal(habit.goal || 0);
        setCategoryId(habit.categoryId || null);
      }
    }

    checkId();
  }, [id]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Save"
          onPress={async () => {
            if (name.length !== 0) {
              const habitData = {
                name,
                frequency: selectedDays.join(","),
                icon,
                type, // Ensure type is correctly set
                color,
                unit,
                goal,
                categoryId: categoryId || undefined,
                startDate: new Date().toISOString(),
              };

              if (!id) {
                await addHabit(habitData);
              } else {
                await updateHabit(habitData, parseInt(id as string));
              }
            }
            client.invalidateQueries({ queryKey: ["habits"] });
            client.invalidateQueries({ queryKey: ["habit", id] });
            router.back();
          }}
        />
      ),
      headerStyle: {
        backgroundColor: color,
        color:
          parseInt(color.replace("#", ""), 16) > 0xffffff / 2
            ? "#000000"
            : "#ffffff",
      },
    });
  }, [color, name, selectedDays, icon, type, unit, goal, categoryId]);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <IconSelector icon={icon} setIcon={setIcon} color={color} />
        <ColorSelector color={color} setColor={setColor} />
        <TextInput
          placeholder="Habit Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
          Select a Category
        </Text>
        <CategorySelector
          categoryId={categoryId}
          setCategoryId={setCategoryId}
        />
      </View>
      <View
        style={{
          marginTop: 20,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Text>Advanced Habit</Text>
        <Switch
          value={type === "numeric"}
          onValueChange={(value) => setType(value ? "numeric" : "boolean")}
        />
      </View>
      {type === "numeric" && <NumericHabitForm />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    flex: 1,
  },

  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default AddHabit;
