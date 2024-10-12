import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import useGetAllJournalFlows from "@/db/useGetAllJournalFlows";
import PageWithFAB from "@/components/templates/PageWithFAB";
import JournalFlowCard from "@/components/molecules/JournalFlowCard";
import { useThemeStore } from "@/theme/useThemeState";

const JournalFlows = () => {
  const { data: flows, refetch } = useGetAllJournalFlows();
  const router = useRouter();
  const [favoriteFlows, setFavoriteFlows] = useState<number[]>([]);
  const { theme } = useThemeStore();

  useEffect(() => {
    refetch();
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favorites = await AsyncStorage.getItem("favoriteFlows");
      if (favorites) {
        setFavoriteFlows(JSON.parse(favorites));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const toggleFavorite = async (flowId: number) => {
    let updatedFavorites = [...favoriteFlows];
    if (favoriteFlows.includes(flowId)) {
      updatedFavorites = updatedFavorites.filter((id) => id !== flowId);
    } else {
      updatedFavorites.push(flowId);
    }
    setFavoriteFlows(updatedFavorites);
    await AsyncStorage.setItem(
      "favoriteFlows",
      JSON.stringify(updatedFavorites)
    );
  };

  const isFavorite = (flowId: number) => {
    return favoriteFlows.includes(flowId);
  };

  return (
    <PageWithFAB onFabPress={() => router.push("/addJournalFlow")}>
      <FlatList
        data={flows}
        keyExtractor={(item) => item?.id?.toString() ?? ""}
        renderItem={({ item }) => (
          <JournalFlowCard
            item={item}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
          />
        )}
        contentContainerStyle={[{ backgroundColor: theme.colors.background }]}
      />
    </PageWithFAB>
  );
};

export default JournalFlows;
