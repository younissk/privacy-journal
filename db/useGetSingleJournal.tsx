import { useQuery } from "@tanstack/react-query";
import { getJournalById } from "./database";

const useGetSingleJournal = (id: number) => {
  return useQuery({
    queryKey: ["journal", id],
    queryFn: async () => await getJournalById(id),
  });
};

export default useGetSingleJournal;
