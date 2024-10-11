import { router, useNavigation } from "expo-router";
import { useEffect } from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
const Home = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Home",
      headerRight: () => (
        <TouchableOpacity onPress={() => router.push("/settings")}>
          <Ionicons style={{ marginRight: 10 }} name="settings" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View>
      <Text>Welcome to the Private Journaling App</Text>
      <Text>Your data is always yours</Text>
    </View>
  );
};

export default Home;
