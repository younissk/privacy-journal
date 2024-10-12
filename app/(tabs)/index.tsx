import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import JournalContributionChart from "@/components/molecules/JournalContributionChart";
import { getGreetingMessage, getRandomQuote } from "@/utils/helpers";
import useGetAllJournals from "@/db/useGetAllJournals";
import { Card } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useGetAllJournalFlows from "@/db/useGetAllJournalFlows";
import JournalFlowCard from "@/components/molecules/JournalFlowCard";
import useGetAllHabits from "@/db/useGetAllHabits";
import { useThemeStore } from "@/theme/useThemeState";
import { Quote } from "@/interfaces/Quotes";

const screenWidth = Dimensions.get("window").width;

const Home = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { data: journals } = useGetAllJournals();
  const { data: habits } = useGetAllHabits();
  const { data: flows } = useGetAllJournalFlows();
  const { theme } = useThemeStore();
  const [favoriteFlows, setFavoriteFlows] = useState<number[]>([]);
  const [quote, setQuote] = useState<{
    text: string;
    author: string;
    explanation: string;
  }>();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Home",
      headerRight: () => (
        <TouchableOpacity onPress={() => router.push("/settings")}>
          <Ionicons
            style={{ marginRight: 10 }}
            name="settings"
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: theme.colors.primary,
      },
      headerTintColor: theme.colors.text,
    });
    loadFavorites();
    loadRandomQuote();
  }, [navigation, theme]);

  const loadFavorites = async () => {
    try {
      const favorites = await AsyncStorage.getItem("favoriteFlows");
      if (favorites) {
        setFavoriteFlows(JSON.parse(favorites));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const toggleFavorite = async (flowId: number) => {
    let updatedFavorites = [...favoriteFlows];
    if (favoriteFlows.includes(flowId)) {
      updatedFavorites = updatedFavorites.filter((id) => id !== flowId);
    } else {
      updatedFavorites.push(flowId);
    }
    setFavoriteFlows(updatedFavorites);
    await AsyncStorage.setItem(
      "favoriteFlows",
      JSON.stringify(updatedFavorites)
    );
  };

  const isFavorite = (flowId: number) => {
    return favoriteFlows.includes(flowId);
  };

  const greeting = getGreetingMessage();

  const loadRandomQuote = async () => {
    const randomQuote = await getRandomQuote();
    if (randomQuote) {
      setQuote(randomQuote);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View
        style={[
          styles.greetingContainer,
          { backgroundColor: theme.colors.primary },
        ]}
      >
        <Text style={[styles.greetingText, { color: theme.colors.text }]}>
          {greeting}
        </Text>
        <Text
          style={[styles.quoteText, { color: theme.colors.text }]}
        >{`"${quote?.text}"`}</Text>
        {quote?.author && (
          <Text
            style={[styles.quoteAuthor, { color: theme.colors.text }]}
          >{`- ${quote?.author}`}</Text>
        )}
      </View>

      <ScrollView>
        <View style={styles.cardContainer}>
          <Card
            containerStyle={[
              styles.card,
              { backgroundColor: theme.colors.card },
            ]}
          >
            <TouchableOpacity onPress={() => router.push("/journals")}>
              <View style={styles.cardContent}>
                <Ionicons name="book" size={40} color={theme.colors.primary} />
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                  Journals
                </Text>
                <Text
                  style={[styles.cardCount, { color: theme.colors.primary }]}
                >
                  {journals?.length || 0}
                </Text>
              </View>
            </TouchableOpacity>
          </Card>

          <Card
            containerStyle={[
              styles.card,
              { backgroundColor: theme.colors.card },
            ]}
          >
            <TouchableOpacity onPress={() => router.push("/habits")}>
              <View style={styles.cardContent}>
                <Ionicons
                  name="checkbox"
                  size={40}
                  color={theme.colors.primary}
                />
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                  Habits
                </Text>
                <Text
                  style={[styles.cardCount, { color: theme.colors.primary }]}
                >
                  {habits?.length || 0}
                </Text>
              </View>
            </TouchableOpacity>
          </Card>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => router.push("/addJournal")}
          >
            <Ionicons name="create" size={24} color={theme.colors.text} />
            <Text
              style={[styles.actionButtonText, { color: theme.colors.text }]}
            >
              New Journal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => router.push("/flows")}
          >
            <Ionicons name="play" size={24} color={theme.colors.text} />
            <Text
              style={[styles.actionButtonText, { color: theme.colors.text }]}
            >
              Start Flow
            </Text>
          </TouchableOpacity>
        </View>

        {favoriteFlows.length > 0 && (
          <View style={styles.favoriteFlowsContainer}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Your Favorite Flows
            </Text>
            <FlatList
              data={flows?.filter((flow) => isFavorite(flow.id!))}
              keyExtractor={(item) => item.id!.toString()}
              renderItem={({ item }) => (
                <JournalFlowCard
                  item={item}
                  toggleFavorite={toggleFavorite}
                  isFavorite={isFavorite}
                />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.favoriteFlowsList}
            />
          </View>
        )}

        <View style={styles.chartContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Your Journal Activity
          </Text>
          <JournalContributionChart />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  greetingContainer: {
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: "italic",
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 0,
    marginBottom: 20,
  },
  card: {
    width: screenWidth * 0.42,
    borderRadius: 10,
    padding: 0,
    elevation: 4,
  },
  cardContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  cardTitle: {
    fontSize: 18,
    marginTop: 10,
  },
  cardCount: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 5,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  actionButton: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 16,
    marginLeft: 10,
  },
  favoriteFlowsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  favoriteFlowsList: {
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chartContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  quoteAuthor: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "right",
    marginTop: 5,
  },
});

export default Home;
