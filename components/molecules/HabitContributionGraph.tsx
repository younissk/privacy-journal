import React, { useState } from "react";
import { ContributionGraph } from "react-native-chart-kit";
import { View, Text } from "react-native";
import { HabitLog } from "@/interfaces/Journal";
import { ContributionChartValue } from "react-native-chart-kit/dist/contribution-graph/ContributionGraph";
import useGetAllHabitLogsOfHabit from "@/db/useGetAllHabitLogsOfHabit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

interface HabitContributionChartProps {
  habitId: number;
}

const HabitContributionChart: React.FC<HabitContributionChartProps> = ({
  habitId,
}) => {
  const { data: habitLogs } = useGetAllHabitLogsOfHabit(habitId);
  const values =
    habitLogs?.map((log) => ({
      date: log.date,
      count: 1,
    })) || [];

  return (
    // @ts-ignores
    <ContributionGraph
      values={values}
      endDate={new Date()}
      numDays={105}
      width={screenWidth}
      height={220}
      chartConfig={{
        backgroundColor: "#ffffff",
        backgroundGradientFrom: "#fb8c00",
        backgroundGradientTo: "#ffa726",
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      }}
    />
  );
};

export default HabitContributionChart;
