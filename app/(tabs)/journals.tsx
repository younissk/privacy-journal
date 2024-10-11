import { getJournals } from "@/db/database";
import {
  Text,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { FAB, Card, Button, SearchBar } from "@rneui/themed";
import { useState, useEffect } from "react";
import { Journal } from "@/interfaces/Journal";
import useGetAllJournals from "@/db/useGetAllJournals";

const Journals = () => {
  const { data: journals } = useGetAllJournals();
  const [filteredJournals, setFilteredJournals] = useState<Journal[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setFilteredJournals(journals || []);
  }, [journals]);

  const router = useRouter();

  if (!journals) return <Text>Loading...</Text>;

  return (
    <SafeAreaView style={{ height: "100%", position: "relative" }}>
      <SearchBar
        placeholder="Search"
        value={search}
        onChangeText={async (text) => {
          setSearch(text);
          if (text === "") {
            setFilteredJournals(journals);
          } else {
            setFilteredJournals(
              filteredJournals.filter((journal) =>
                journal.title.toLowerCase().includes(search.toLowerCase())
              )
            );
          }
        }}
      />
      <ScrollView>
        {filteredJournals.map((journal) => (
          <Card key={journal.id}>
            <Card.Title>{journal.title} </Card.Title>
            <Card.Divider />
            <Text>{journal.dateCreated}</Text>
            <Text>{journal.content.slice(0, 100)}...</Text>
            <Card.Divider />
            <Button
              title="View"
              color="primary"
              onPress={() => router.push(`/journalView?id=${journal.id}`)}
            />
          </Card>
        ))}
        <FAB
          style={{ margin: 10 }}
          icon={{ name: "add", color: "white" }}
          color="black"
          title="Add Journal"
          onPress={() => router.push("/addJournal")}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Journals;
