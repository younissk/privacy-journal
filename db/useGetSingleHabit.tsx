import { useQuery } from "@tanstack/react-query";
import { getHabitById } from "./database";

const useGetSingleHabit = (id: number) => {
  return useQuery({ queryKey: ["habit", id], queryFn: () => getHabitById(id) });
};

export default useGetSingleHabit;
