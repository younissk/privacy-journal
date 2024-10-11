import { HabitLog } from "@/interfaces/Journal";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "@rneui/themed";
import { Icon } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";
import { deleteHabitLog } from "@/db/database";
import { useQueryClient } from "@tanstack/react-query";

const HabitLogCard = ({
  habitLog,
  index,
}: {
  habitLog: HabitLog;
  index: number;
}) => {
  const client = useQueryClient();
  return (
    <Card containerStyle={styles.card}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {habitLog.numericValue !== null && (
          <Text style={styles.numericValue}>{habitLog.numericValue}</Text>
        )}
        <View style={styles.header}>
          <Text style={styles.date}>
            {new Date(habitLog.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <Icon name="calendar" type="font-awesome" color="#517fa4" />
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
    fontSize: 14,
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
