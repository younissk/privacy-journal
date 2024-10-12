import useGetAllHabitLogsOfHabit from "@/db/useGetAllHabitLogsOfHabit";
import { ScrollView } from "react-native";
import HabitLogCard from "../molecules/HabitLogCard";

const HabitLogList = ({ habitId, unit, isNumeric }: { habitId: number; unit: string, isNumeric: boolean }) => {
  const { data: habitLogs } = useGetAllHabitLogsOfHabit(habitId);

  return (
    <ScrollView style={{ height: "100%" }}>
      {habitLogs
        ?.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        .map((habitLog, index) => (
          <HabitLogCard
            key={habitLog.id}
            habitLog={habitLog}
            index={index}
            isNumeric={isNumeric}
            unit={unit}
          />
        ))}
    </ScrollView>
  );
};

export default HabitLogList;
