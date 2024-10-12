// /(tabs)/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTheme } from "@react-navigation/native";

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border || "#cccccc",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTitleStyle: {
          color: colors.text,
          fontWeight: "bold",
        },
        headerTintColor: colors.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons size={size} name="home-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="journals"
        options={{
          title: "Journals",
          tabBarIcon: ({ color, size }) => (
            <Ionicons size={size} name="book-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: "Habits",
          tabBarIcon: ({ color, size }) => (
            <Ionicons size={size} name="checkbox-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="flows"
        options={{
          title: "Flows",
          tabBarIcon: ({ color, size }) => (
            <Ionicons size={size} name="infinite-outline" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
