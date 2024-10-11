import { View, Text, ScrollView, Button, TouchableOpacity } from "react-native";
import useGetAllHabits from "@/db/useGetAllHabits";
import { Card, FAB } from "@rneui/themed";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import HabitCard from "@/components/molecules/HabitCard";
import CategorySelector from "@/components/molecules/CategorySelector";
import { useState, useEffect } from "react";
import { Habit } from "@/interfaces/Journal";

const Habits = () => {
  const { data: habits } = useGetAllHabits();
  const [filteredHabits, setFilteredHabits] = useState<Habit[]>(habits || []);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (categoryId) {
      setFilteredHabits(habits?.filter((habit) => habit.categoryId === categoryId) || []);
    } else {
      setFilteredHabits(habits || []);
    }
  }, [categoryId, habits]);

  return (
    <View>
      <View style={{ margin: 10 }}>
        <CategorySelector categoryId={categoryId} setCategoryId={setCategoryId} />
      </View>
      <ScrollView style={{ height: "100%" }}>
        {filteredHabits?.map((habit) => (
          <HabitCard key={habit.id} habit={habit} />
        ))}
      <FAB
        style={{ margin: 10 }}
        icon={{ name: "add", color: "white" }}
        title="Add Habit"
        color="black"
        onPress={() => router.push("/addHabit")}
        />
      </ScrollView>
    </View>
  );
};

export default Habits;
