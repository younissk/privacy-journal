import { useQuery } from "@tanstack/react-query";
import { getCategories } from "./database";

export const useGetAllCategories = () => {
  return useQuery({ queryKey: ["categories"], queryFn: getCategories });
};
