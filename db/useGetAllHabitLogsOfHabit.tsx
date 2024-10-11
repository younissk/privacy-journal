import { useQuery } from "@tanstack/react-query";
import { getHabitLogsByHabitId } from "./database";

const useGetAllHabitLogsOfHabit = (habitId: number) => {
  return useQuery({
    queryKey: ["habitLogs", habitId],
    queryFn: () => getHabitLogsByHabitId(habitId),
  });
};

export default useGetAllHabitLogsOfHabit;
