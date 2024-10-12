import React from "react";
import { Habit } from "@/interfaces/Journal";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useGetAllCategories } from "@/db/useGetAllCategories";
import { Icon, LinearProgress } from "@rneui/themed";

const HabitCard = ({ habit }: { habit: Habit }) => {
  const router = useRouter();
  const { data: categories } = useGetAllCategories();
  const category = categories?.find((c) => c.id === habit.categoryId);


  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/habitPage?id=${habit.id}`)}
    >
      <View style={styles.cardContent}>
        <Icon
          name={habit.icon as any}
          type="ionicon"
          color={habit.color}
          size={24}
        />
        <View style={styles.textContainer}>
          <Text style={{...styles.habitName, color: habit.color}}>{habit.name}</Text>
          <Text style={styles.categoryName}>{category?.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 15,
    flex: 1,
  },
  habitName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  categoryName: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
});

export default HabitCard;
