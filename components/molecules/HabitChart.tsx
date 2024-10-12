import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import useGetAllHabitLogsOfHabit from "@/db/useGetAllHabitLogsOfHabit";

const HabitChart = ({ habitId }: { habitId: number }) => {
  const { data: habitLogs } = useGetAllHabitLogsOfHabit(habitId);

  const chartData = {
    labels:
      habitLogs?.map((log) =>
        new Date(log.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      ) || [],
    datasets: [
      {
        data: habitLogs?.map((log) => log.numericValue || 0) || [],
        color: () => "#6200EE",
      },
    ],
  };

  return (
    <View style={styles.chartContainer}>
      <LineChart
        data={chartData}
        width={Dimensions.get("window").width - 30}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "#6200EE",
          },
          propsForBackgroundLines: {
            stroke: "#E3E3E3",
          },
        }}
        bezier
        style={styles.chart}
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

export default HabitChart;
