import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { getJournals } from "@/db/database";
import { Journal } from "@/interfaces/Journal";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Button, CheckBox } from "@rneui/themed";

const ExportJournalsScreen = () => {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [selectedJournals, setSelectedJournals] = useState<number[]>([]);
  const { colors } = useTheme();

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      const data = await getJournals();
      setJournals(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load journals.");
    }
  };

  const toggleSelectJournal = (id: number) => {
    setSelectedJournals((prev) =>
      prev.includes(id) ? prev.filter((jid) => jid !== id) : [...prev, id]
    );
  };

  const exportAsPDF = async () => {
    if (selectedJournals.length === 0) {
      Alert.alert(
        "No Journals Selected",
        "Please select at least one journal to export."
      );
      return;
    }

    const journalsToExport = journals
      .filter((journal) => selectedJournals.includes(journal.id!))
      // Sort journals by date or title if desired
      .sort((a, b) => new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime());

    const htmlContent = generateHTMLContent(journalsToExport);

    try {
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert("Export Error", "An error occurred while exporting the PDF.");
    }
  };

  const generateHTMLContent = (journals: Journal[]) => {
    const coverTitle = "My Journal Collection";
    const coverSubtitle = "Exported Journals";
    const exportDate = new Date().toLocaleDateString();

    // Generate Table of Contents
    let tableOfContents = `
      <div class="toc-page">
        <h1>Table of Contents</h1>
        <ul>
    `;

    journals.forEach((journal, index) => {
      tableOfContents += `
        <li>
          ${index + 1}. ${journal.title} - ${new Date(journal.dateCreated).toLocaleDateString()}
        </li>
      `;
    });

    tableOfContents += `
        </ul>
        <div class="page-break"></div>
      </div>
    `;

    // Generate Journal Entries
    let journalEntries = "";

    journals.forEach((journal) => {
      journalEntries += `
        <div class="journal-page">
          <h2>${journal.title}</h2>
          <p class="date">${new Date(journal.dateCreated).toLocaleDateString()}</p>
          <p>${journal.content.replace(/\n/g, "<br>")}</p>
          <div class="page-break"></div>
        </div>
      `;
    });

    // Combine all parts into final HTML
    const html = `
      <html>
      <head>
        <meta charset="utf-8" />
        <style>
          @page {
            margin: 50px;
          }
          body {
            font-family: 'Helvetica Neue', 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            color: ${colors.text};
          }
          .cover-page {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: ${colors.primary};
            color: #fff;
          }
          .cover-page h1 {
            font-size: 48px;
            margin-bottom: 20px;
          }
          .cover-page h2 {
            font-size: 24px;
            margin-bottom: 10px;
          }
          .cover-page p {
            font-size: 16px;
          }
          .toc-page {
            padding: 50px;
          }
          .toc-page h1 {
            text-align: center;
            margin-bottom: 30px;
          }
          .toc-page ul {
            list-style-type: none;
            padding: 0;
          }
          .toc-page li {
            font-size: 16px;
            margin-bottom: 10px;
          }
          .journal-page {
            padding: 50px;
          }
          .journal-page h2 {
            text-align: center;
            margin-bottom: 20px;
          }
          .journal-page .date {
            text-align: center;
            font-size: 14px;
            color: gray;
            margin-bottom: 30px;
          }
          .journal-page p {
            font-size: 16px;
            line-height: 1.6;
            text-align: justify;
          }
          .page-break {
            page-break-after: always;
          }
        </style>
      </head>
      <body>
        <div class="cover-page">
          <h1>${coverTitle}</h1>
          <h2>${coverSubtitle}</h2>
          <p>Export Date: ${exportDate}</p>
        </div>
        <div class="page-break"></div>
        ${tableOfContents}
        ${journalEntries}
      </body>
      </html>
    `;

    return html;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
        {selectedJournals.length > 0 ? (
          <Button
            title="Clear Selection"
            onPress={() => setSelectedJournals([])}
          />
        ) : (
          <Button
            title="Select All"
            onPress={() => setSelectedJournals(journals.map((j) => j.id!))}
          />
        )}
        <Button
          title="Export as PDF"
          onPress={exportAsPDF}
          disabled={selectedJournals.length === 0}
        />
      </View>
      <FlatList
        data={journals}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.journalItem}
            onPress={() => toggleSelectJournal(item.id!)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <CheckBox
                checked={selectedJournals.includes(item.id!)}
                onPress={() => toggleSelectJournal(item.id!)}
              />
              <View style={{ flexDirection: "column", flex: 1 }}>
                <Text style={[styles.title, { color: colors.text }]}>
                  {item.title}
                </Text>
                <Text style={[styles.date, { color: colors.text }]}>
                  {new Date(item.dateCreated).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ExportJournalsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  journalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  date: {
    fontSize: 14,
  },
});
