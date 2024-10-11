import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import useGetSingleHabit from "@/db/useGetSingleHabit";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { addHabitLog, deleteHabit } from "@/db/database";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@rneui/themed";
import HabitLogList from "@/components/organisms/HabitLogList";
import HabitChart from "@/components/molecules/HabitChart";
import HabitContributionChart from "@/components/molecules/HabitContributionGraph";

const HabitPage = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const { data: habit } = useGetSingleHabit(parseInt(id as string));
  const [numericValue, setNumericValue] = useState<number | undefined>(
    undefined
  );
  const client = useQueryClient();

  useEffect(() => {
    navigation.setOptions({
      title: habit?.name,
      headerStyle: { backgroundColor: habit?.color },
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name={habit?.icon as any} size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TouchableOpacity
            onPress={() => router.push(`/addHabit?id=${habit?.id}`)}
          >
            <Ionicons name="pencil" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              deleteHabit(habit?.id!);
              client.invalidateQueries({ queryKey: ["habits"] });
              router.back();
            }}
          >
            <Ionicons name="trash" size={24} color="red" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [habit]);

  if (!habit) return <Text>Loading...</Text>;

  return (
    <SafeAreaView style={{ height: "100%" }}>
      {habit.type === "numeric" ? (
        <HabitChart habitId={habit.id!} />
      ) : (
        <HabitContributionChart habitId={habit.id!} />
      )}

      <View
        style={
          habit.type === "numeric" && {
            flexDirection: "row",
            justifyContent: "space-between",
          }
        }
      >
        {habit.type === "numeric" && (
          <TextInput
            style={{
              flex: 1,
              margin: 10,
              borderWidth: 1,
              borderColor: "gray",
              borderRadius: 5,
              padding: 5,
            }}
            placeholder="Enter numeric value"
            keyboardType="numeric"
            value={numericValue?.toString()}
            onChangeText={(text) => {
              if (text === "") {
                setNumericValue(undefined);
              } else {
                setNumericValue(parseInt(text));
              }
            }}
          />
        )}
        <Button
          style={{ margin: 10 }}
          title="Add Entry"
          onPress={async () => {
            await addHabitLog(
              habit.id!,
              new Date().toISOString(),
              numericValue ?? 0
            );
            client.invalidateQueries({ queryKey: ["habitLogs", habit.id] });
          }}
        />
      </View>
      <HabitLogList habitId={habit.id!} />
    </SafeAreaView>
  );
};

export default HabitPage;
