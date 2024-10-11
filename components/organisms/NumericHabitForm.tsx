import { View, Text, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";

const NumericHabitForm = () => {
  const [unit, setUnit] = useState<string>("");
  const [goal, setGoal] = useState<number>(0);

  return (
    <View style={{ display: "flex", gap: 10 }}>
      <Text>Numeric Habit Form</Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text>Unit</Text>
        <TextInput
          placeholder="Unit (e.g. minutes, reps, etc.)"
          value={unit}
          onChangeText={setUnit}
          style={{
            borderWidth: 1,
            flex: 1,
            borderColor: "#ccc",
            borderRadius: 5,
            padding: 5,
            marginLeft: 10,
          }}
        />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text>Day Goal</Text>
        <TextInput
          keyboardType="numeric"
          value={goal.toString()}
          onChangeText={(text) => setGoal(parseInt(text))}
          style={{
            borderWidth: 1,
            flex: 1,
            borderColor: "#ccc",
            borderRadius: 5,
            padding: 5,
            marginLeft: 10,
          }}
        />
      </View>
    </View>
  );
};

export default NumericHabitForm;