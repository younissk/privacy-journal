import { useQuery } from "@tanstack/react-query";
import { getJournals } from "./database";

const useGetAllJournals = () => {
  return useQuery({
    queryKey: ["journals"],
    queryFn: async () => await getJournals(),
  });
};

export default useGetAllJournals;