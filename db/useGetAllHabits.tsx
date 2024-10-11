import { useQuery } from "@tanstack/react-query";
import { getHabits } from "./database";

const useGetAllHabits = () => {
  return useQuery({
    queryKey: ["habits"],
    queryFn: async () => await getHabits(),
  });
};

export default useGetAllHabits;
