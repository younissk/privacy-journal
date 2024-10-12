import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Text,
} from "react-native";
import useGetAllHabits from "@/db/useGetAllHabits";
import { useRouter } from "expo-router";
import HabitCard from "@/components/molecules/HabitCard";
import CategorySelector from "@/components/molecules/CategorySelector";
import { Habit } from "@/interfaces/Journal";
import PageWithFAB from "@/components/templates/PageWithFAB";
import { useThemeStore } from "@/theme/useThemeState";

const Habits = () => {
  const { data: habits } = useGetAllHabits();
  const [filteredHabits, setFilteredHabits] = useState<Habit[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const router = useRouter();
  const { theme } = useThemeStore();

  useEffect(() => {
    if (categoryId) {
      setFilteredHabits(
        habits?.filter((habit) => habit.categoryId === categoryId) || []
      );
    } else {
      setFilteredHabits(habits || []);
    }
  }, [categoryId, habits]);

  return (
    <PageWithFAB onFabPress={() => router.push("/addHabit")}>
      <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>My Habits</Text>
        <CategorySelector
          categoryId={categoryId}
          setCategoryId={setCategoryId}
        />
      </View>
      <FlatList
        data={filteredHabits}
        keyExtractor={(item) => item?.id?.toString() || ""}
        renderItem={({ item }) => <HabitCard habit={item} />}
        contentContainerStyle={[styles.listContent, { backgroundColor: theme.colors.background }]}
      />
    </PageWithFAB>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 80,
  },
});

export default Habits;
