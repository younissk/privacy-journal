import { View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import useGetAllHabitLogsOfHabit from "@/db/useGetAllHabitLogsOfHabit";

const HabitChart = ({ habitId }: { habitId: number }) => {
  const { data: habitLogs } = useGetAllHabitLogsOfHabit(habitId);

  const chartData = {
    labels: habitLogs?.map(log => new Date(log.date).toLocaleDateString()) || [],
    datasets: [
      {
        data: habitLogs?.map(log => log.numericValue) || [], // Assuming 'progress' is a field in habitLog
      },
    ],
  };

  const sanitizedData = chartData.datasets.map(dataset => ({
    ...dataset,
    data: dataset.data.map(value => value ?? 0) // Replace undefined with 0 or any default number
  }));

  return (
      <LineChart
        data={{ ...chartData, datasets: sanitizedData }}
        width={Dimensions.get("window").width} // from react-native
        height={220}
        yAxisLabel=""
        yAxisSuffix="%"
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726",
          },
        }}
        bezier
      />
  );
};

export default HabitChart;
