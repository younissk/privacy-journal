import React from "react";
import { View, TextInput, StyleSheet } from "react-native";

const NumericHabitForm = ({
  unit,
  setUnit,
  goal,
  setGoal,
}: {
  unit: string;
  setUnit: (value: string) => void;
  goal: string;
  setGoal: (value: string) => void;
}) => {
  return (
    <View>
      <TextInput
        placeholder="Unit (e.g., km, reps)"
        style={styles.input}
        value={unit}
        onChangeText={setUnit}
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="Goal (e.g., 5)"
        style={styles.input}
        value={goal}
        onChangeText={setGoal}
        keyboardType="numeric"
        placeholderTextColor="#aaa"
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default NumericHabitForm;
