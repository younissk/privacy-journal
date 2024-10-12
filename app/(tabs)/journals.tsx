import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  SectionList,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { Chip, FAB, SearchBar } from "@rneui/themed";
import { Journal } from "@/interfaces/Journal";
import useGetAllJournals from "@/db/useGetAllJournals";
import PageWithFAB from "@/components/templates/PageWithFAB";
import { useThemeStore } from "@/theme/useThemeState";

const Journals = () => {
  const { data: journals } = useGetAllJournals();
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const router = useRouter();
  const { theme } = useThemeStore();

  if (!journals) return <Text>Loading...</Text>;

  // Get list of months and years from journals
  const months = Array.from(
    new Set(
      journals.map((journal) =>
        new Date(journal.dateCreated).toLocaleString("default", {
          month: "long",
        })
      )
    )
  ).sort();
  months.unshift("All");

  const years = Array.from(
    new Set(
      journals.map((journal) =>
        new Date(journal.dateCreated).getFullYear().toString()
      )
    )
  ).sort();
  years.unshift("All");

  // Filter and group journals
  const filteredAndGroupedJournals = filterAndGroupJournals(
    journals,
    search,
    selectedMonth,
    selectedYear
  );

  // Function to filter and group journals by month and year
  function filterAndGroupJournals(
    journals: Journal[],
    search: string,
    month: string,
    year: string
  ) {
    let filtered = journals;

    if (search !== "") {
      filtered = filtered.filter((journal) =>
        journal.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (month !== "All") {
      filtered = filtered.filter((journal) => {
        const journalMonth = new Date(journal.dateCreated).toLocaleString(
          "default",
          { month: "long" }
        );
        return journalMonth === month;
      });
    }

    if (year !== "All") {
      filtered = filtered.filter((journal) => {
        const journalYear = new Date(journal.dateCreated)
          .getFullYear()
          .toString();
        return journalYear === year;
      });
    }

    // Group journals by month and year
    const grouped: { title: string; data: Journal[] }[] = [];

    filtered.forEach((journal) => {
      const journalDate = new Date(journal.dateCreated);
      const monthYear = journalDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      const existingGroup = grouped.find((g) => g.title === monthYear);
      if (existingGroup) {
        existingGroup.data.push(journal);
      } else {
        grouped.push({ title: monthYear, data: [journal] });
      }
    });

    // Sort groups by date descending
    grouped.sort((a, b) => {
      const aDate = new Date(a.title);
      const bDate = new Date(b.title);
      return bDate.getTime() - aDate.getTime();
    });

    return grouped;
  }

  const renderItem = ({ item, index }: { item: Journal; index: number }) => {
    const date = new Date(item.dateCreated);
    const day = date.getDate();
    const restOfDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
    });

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: "white", flexDirection: "row" }]}
        onPress={() => router.push(`/journalView?id=${item.id}`)}
      >
        <View style={styles.dateContainer}>
          <Text style={styles.dayText}>{day}</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSnippet}>
            {item.content.length > 100
              ? item.content.slice(0, 100) + "..."
              : item.content}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <PageWithFAB onFabPress={() => router.push("/addJournal")}>
      {/* Search Bar */}
      <SearchBar
        placeholder="Search journals..."
        value={search}
        onChangeText={(text) => {
          setSearch(text);
        }}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInputContainer}
        inputStyle={styles.searchInput}
        placeholderTextColor="#999"
        round
        lightTheme
      />

      {/* Month and Year Selectors - Only show when searching */}
      {search !== "" && (
        <View style={styles.selectorContainer}>
          <View style={styles.selector}>
            <Text style={styles.selectorLabel}>Month:</Text>
            <FlatList
              data={months}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Chip
                  style={{ marginRight: 5 }}
                  color={selectedMonth === item ? "#6200EE" : "#E0E0E0"}
                  onPress={() => setSelectedMonth(item)}
                >
                  {item}
                </Chip>
              )}
              keyExtractor={(item) => item}
            />
          </View>
          <View style={styles.selector}>
            <Text style={styles.selectorLabel}>Year:</Text>
            <FlatList
              data={years}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Chip
                  style={{ marginRight: 5 }}
                  color={selectedYear === item ? "#6200EE" : "#E0E0E0"}
                  onPress={() => setSelectedYear(item)}
                >
                  {item}
                </Chip>
              )}
              keyExtractor={(item) => item}
            />
          </View>
        </View>
      )}

      {/* Journals List */}
      <SectionList
        sections={filteredAndGroupedJournals}
        keyExtractor={(item) => item.id?.toString() || ""}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>{title}</Text>
        )}
        contentContainerStyle={[styles.listContainer, { backgroundColor: theme.colors.background }]}
      />
    </PageWithFAB>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  statisticsText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  searchContainer: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  searchInputContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    height: 40,
  },
  searchInput: {
    color: "#333",
    fontSize: 16,
  },
  selectorContainer: {
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  selectorLabel: {
    fontSize: 16,
    color: "#333",
    marginRight: 10,
    fontWeight: "bold",
  },
  selectorItem: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    marginRight: 5,
  },
  selectorItemSelected: {
    backgroundColor: "#6200EE",
  },
  selectorItemText: {
    color: "#333",
  },
  selectorItemTextSelected: {
    color: "#fff",
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 80,
  },
  sectionHeader: {
    fontSize: 24,
    marginVertical: 10,
    fontWeight: "bold",
  },
  card: {
    marginVertical: 5,
    borderRadius: 10,
    padding: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  cardSnippet: {
    fontSize: 16,
    color: "#444",
  },
  dateContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  dayText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
});

export default Journals;
