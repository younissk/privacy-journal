import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { ContributionGraph } from "react-native-chart-kit";
import useGetAllHabitLogsOfHabit from "@/db/useGetAllHabitLogsOfHabit";
import { useThemeStore } from "@/theme/useThemeState";
const screenWidth = Dimensions.get("window").width;

interface HabitContributionChartProps {
  habitId: number;
}

const HabitContributionChart: React.FC<HabitContributionChartProps> = ({
  habitId,
}) => {
  const { data: habitLogs } = useGetAllHabitLogsOfHabit(habitId);
  const { theme } = useThemeStore();

  const values =
    habitLogs?.map((log) => ({
      date: log.date.split("T")[0],
      count: 1,
    })) || [];

  const bgHexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <View style={styles.chartContainer}>
      {/* @ts-ignore */}
      <ContributionGraph
        values={values}
        endDate={new Date()}
        numDays={70}
        width={screenWidth - 30}
        height={220}
        chartConfig={{
          backgroundColor: theme.colors.background,
          backgroundGradientFrom: theme.colors.background,
          backgroundGradientTo: theme.colors.background,
          color: (opacity = 1) => bgHexToRgba(theme.colors.primary, opacity),
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForBackgroundLines: {
            stroke: "#E3E3E3",
          },
        }}
        style={styles.chart}
        squareSize={20}
        gutterSize={4}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: "center",
    marginTop: 15,
  },
  chart: {
    borderRadius: 10,
  },
});

export default HabitContributionChart;
