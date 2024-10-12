import { useQuery } from "@tanstack/react-query";
import { getJournalFlows } from "@/db/database";

const useGetAllJournalFlows = () => {
  return useQuery(["journalFlows"], getJournalFlows);
};

export default useGetAllJournalFlows;
