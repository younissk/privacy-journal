import { Habit } from "@/interfaces/Journal";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { Card } from "@rneui/themed";
import { useGetAllCategories } from "@/db/useGetAllCategories";
import { Chip } from "@rneui/base";
const HabitCard = ({ habit }: { habit: Habit }) => {
  const router = useRouter();

  const { data: categories } = useGetAllCategories();

  console.log("habit", habit);

  console.log("categories", categories);

  return (
    <Card
      key={habit.id}
      containerStyle={{
        borderRadius: 10,
        borderWidth: 6,
        borderColor: habit.color,
      }}
    >
      <TouchableOpacity
        onPress={() => router.push(`/habitPage?id=${habit.id}`)}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name={habit.icon as any} size={18} color="black" />
            <Text style={{ marginLeft: 10, fontSize: 18 }}>{habit.name}</Text>
          </View>
          <Chip
            title={categories?.find((c) => c.id === habit.categoryId)?.name}
            color={categories?.find((c) => c.id === habit.categoryId)?.color}
            style={{ marginRight: 10 }}
          />
        </View>
      </TouchableOpacity>
    </Card>
  );
};

export default HabitCard;
