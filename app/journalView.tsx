import { View, Text, SafeAreaView, ScrollView } from "react-native";

import { useLocalSearchParams, useNavigation } from "expo-router";
import useGetSingleJournal from "@/db/useGetSingleJournal";
import { useEffect } from "react";

const JournalView = () => {
  const { id } = useLocalSearchParams();

  const { data: journal } = useGetSingleJournal(parseInt(id as string));

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: true, title: journal?.title });
  }, [navigation, journal]);

  return (
    <SafeAreaView style={{ margin: 20, height: "100%" }}>
      <ScrollView>
        <Text>{journal?.content}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default JournalView;