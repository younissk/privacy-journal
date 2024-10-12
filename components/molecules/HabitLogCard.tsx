import { HabitLog } from "@/interfaces/Journal";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "@rneui/themed";
import { Icon } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";
import { deleteHabitLog } from "@/db/database";
import { useQueryClient } from "@tanstack/react-query";
import { useThemeStore } from "@/theme/useThemeState";

const HabitLogCard = ({
  habitLog,
  index,
  isNumeric,
  unit,
}: {
  habitLog: HabitLog;
  index: number;
  isNumeric: boolean;
  unit: string;
}) => {
  const { theme } = useThemeStore();
  const client = useQueryClient();
  return (
    <Card containerStyle={styles.card}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {isNumeric && (
          <Text style={[styles.numericValue, { color: theme.colors.text }]}>
            {habitLog.numericValue} {unit}
          </Text>
        )}
        <View style={styles.header}>
          <Text style={[styles.date, { color: theme.colors.text }]}>
            {new Date(habitLog.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <Ionicons
            name="trash"
            size={24}
            color="red"
            onPress={() => {
              deleteHabitLog(habitLog.id);
              client.invalidateQueries({ queryKey: ["habitLogs"] });
            }}
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 15,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 5,
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
  },
  numericValue: {
    fontSize: 24,
    color: "#333",
    marginVertical: 5,
  },
  index: {
    fontSize: 12,
    color: "#888",
    textAlign: "right",
  },
});

export default HabitLogCard;
