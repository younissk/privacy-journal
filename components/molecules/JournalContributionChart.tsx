import React from "react";
import { ContributionGraph } from "react-native-chart-kit";
import useGetAllJournals from "@/db/useGetAllJournals";
import { Dimensions, View, StyleSheet } from "react-native";
import { useThemeStore } from "@/theme/useThemeState";
const screenWidth = Dimensions.get("window").width;

const JournalContributionChart = () => {
  const { theme } = useThemeStore();
  const { data: journals } = useGetAllJournals();

  const uniqueDates = [
    ...new Set(
      journals?.map((journal) =>
        new Date(journal.dateCreated).toISOString().split("T")[0]
      )
    ),
  ];

  const values = uniqueDates.map((date) => ({
    date,
    count:
      journals?.filter(
        (journal) =>
          new Date(journal.dateCreated).toISOString().split("T")[0] === date
      ).length || 0,
  }));

  const bgHexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <View style={[styles.chartWrapper, { backgroundColor: theme.colors.background }]}>
      {/* @ts-ignore */}
      <ContributionGraph
        values={values}
        endDate={new Date()}
        numDays={70}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundColor: theme.colors.background,
          backgroundGradientFrom: theme.colors.background,
          backgroundGradientTo: theme.colors.background,
          decimalPlaces: 0,
          color: (opacity = 1) => bgHexToRgba(theme.colors.primary, opacity),
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        style={{
          borderRadius: 16,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartWrapper: {
    borderRadius: 16,
    padding: 10,
    elevation: 4,
  },
});

export default JournalContributionChart;
