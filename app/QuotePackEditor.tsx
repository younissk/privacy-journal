// QuotePackEditor.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  FlatList,
  Modal,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import {
  getQuotePackById,
  addQuotePack,
  updateQuotePack,
  getQuotesByPackId,
  addQuote,
  updateQuote,
  deleteQuote,
} from "@/db/database";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Quote, QuotePack } from "@/interfaces/Quotes";
import { Ionicons } from "@expo/vector-icons";

const QuotePackEditor = () => {
  const { id } = useLocalSearchParams();
  const isEditing = !!id;

  const [quotePack, setQuotePack] = useState<QuotePack>({
    id: 0,
    name: "",
    description: "",
    isPredefined: 0,
  });
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [quoteModalVisible, setQuoteModalVisible] = useState(false);

  const { colors } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (isEditing) {
      fetchQuotePack();
      fetchQuotes();
    }
  }, []);

  const fetchQuotePack = async () => {
    try {
      const pack = await getQuotePackById(parseInt(id as string));
      setQuotePack(pack);
    } catch (error) {
      Alert.alert("Error", "Failed to load quote pack.");
    }
  };

  const fetchQuotes = async () => {
    try {
      const quotesData = await getQuotesByPackId(parseInt(id as string));
      setQuotes(quotesData);
    } catch (error) {
      Alert.alert("Error", "Failed to load quotes.");
    }
  };

  const handleSaveQuotePack = async () => {
    if (!quotePack.name.trim()) {
      Alert.alert("Error", "Please enter a name for the quote pack.");
      return;
    }
    try {
      if (isEditing) {
        await updateQuotePack(quotePack);
        Alert.alert("Success", "Quote pack updated successfully.");
      } else {
        const newPackId = await addQuotePack({
          name: quotePack.name,
          description: quotePack.description,
          isPredefined: 0,
        });
        setQuotePack({ ...quotePack, id: newPackId });
        Alert.alert("Success", "Quote pack created successfully.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save quote pack.");
    }
  };

  const handleAddQuote = () => {
    if (quotePack.id === 0) {
      Alert.alert("Please save the quote pack first.");
      return;
    }
    setEditingQuote({
      id: 0,
      quoteText: "",
      explanation: "",
      author: "",
      packId: quotePack.id!,
    });
    setQuoteModalVisible(true);
  };

  const handleEditQuote = (quote: Quote) => {
    setEditingQuote(quote);
    setQuoteModalVisible(true);
  };

  const handleDeleteQuote = async (quoteId: number) => {
    try {
      await deleteQuote(quoteId);
      fetchQuotes();
    } catch (error) {
      Alert.alert("Error", "Failed to delete quote.");
    }
  };

  const handleSaveQuote = async () => {
    if (!editingQuote?.quoteText.trim()) {
      Alert.alert("Error", "Please enter the quote text.");
      return;
    }
    try {
      if (editingQuote.id && editingQuote.id > 0) {
        // Update existing quote
        await updateQuote(editingQuote);
        Alert.alert("Success", "Quote updated successfully.");
      } else {
        // Add new quote
        await addQuote({ ...editingQuote, packId: quotePack.id! });
        Alert.alert("Success", "Quote added successfully.");
      }
      setQuoteModalVisible(false);
      setEditingQuote(null);
      fetchQuotes();
    } catch (error) {
      Alert.alert("Error", "Failed to save quote.");
    }
  };

  const renderQuoteItem = ({ item }: { item: Quote }) => (
    <View style={styles.quoteItem}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => handleEditQuote(item)}
      >
        <Text style={[styles.quoteText, { color: colors.text }]}>
          {item.quoteText}
        </Text>
        {item.author && (
          <Text style={[styles.quoteAuthor, { color: colors.text }]}>
            - {item.author}
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteQuote(item.id!)}>
        <Ionicons name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <TextInput
        style={[
          styles.input,
          { borderColor: colors.border, color: colors.text },
        ]}
        placeholder="Quote Pack Name"
        placeholderTextColor={colors.text}
        value={quotePack.name}
        onChangeText={(text) => setQuotePack({ ...quotePack, name: text })}
      />
      <TextInput
        style={[
          styles.input,
          { borderColor: colors.border, color: colors.text },
        ]}
        placeholder="Description"
        placeholderTextColor={colors.text}
        value={quotePack.description}
        onChangeText={(text) =>
          setQuotePack({ ...quotePack, description: text })
        }
      />
      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.primary }]}
        onPress={handleSaveQuotePack}
      >
        <Text style={[styles.saveButtonText, { color: "#fff" }]}>
          {isEditing ? "Update Quote Pack" : "Create Quote Pack"}
        </Text>
      </TouchableOpacity>

      {quotePack.id! > 0 && (
        <>
          <View style={styles.quotesHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Quotes
            </Text>
            <TouchableOpacity onPress={handleAddQuote}>
              <Ionicons name="add-circle" size={30} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={quotes}
            keyExtractor={(item) => item.id!.toString()}
            renderItem={renderQuoteItem}
          />
        </>
      )}

      {/* Quote Modal */}
      <Modal
        visible={quoteModalVisible}
        animationType="slide"
        onRequestClose={() => {
          setQuoteModalVisible(false);
          setEditingQuote(null);
        }}
      >
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
              style={[
                styles.modalContainer,
                { backgroundColor: colors.background },
              ]}
            >
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editingQuote?.id! > 0 ? "Edit Quote" : "Add Quote"}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                    minHeight: 80,
                  },
                ]}
                placeholder="Quote Text"
                placeholderTextColor={colors.text}
                multiline
                value={editingQuote?.quoteText}
                onChangeText={(text) =>
                  setEditingQuote({ ...editingQuote!, quoteText: text })
                }
              />
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: colors.border,
                    color: colors.text,
                    minHeight: 80,
                  },
                ]}
                placeholder="Explanation"
                placeholderTextColor={colors.text}
                multiline
                value={editingQuote?.explanation}
                onChangeText={(text) =>
                  setEditingQuote({ ...editingQuote!, explanation: text })
                }
              />
              <TextInput
                style={[
                  styles.input,
                  { borderColor: colors.border, color: colors.text },
                ]}
                placeholder="Author"
                placeholderTextColor={colors.text}
                value={editingQuote?.author}
                onChangeText={(text) =>
                  setEditingQuote({ ...editingQuote!, author: text })
                }
              />
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleSaveQuote}
              >
                <Text style={[styles.saveButtonText, { color: "#fff" }]}>
                  Save Quote
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cancelButton]}
                onPress={() => {
                  setQuoteModalVisible(false);
                  setEditingQuote(null);
                }}
              >
                <Text
                  style={[styles.cancelButtonText, { color: colors.primary }]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
};

export default QuotePackEditor;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    textAlignVertical: "top", // For multiline TextInput
  },
  saveButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  saveButtonText: { fontSize: 16 },
  cancelButton: {
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
  },
  cancelButtonText: { fontSize: 16 },
  quotesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  quoteItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  quoteText: { fontSize: 16 },
  quoteAuthor: { fontSize: 14, fontStyle: "italic" },
  modalContainer: { flex: 1, padding: 20 },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});
