import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { getJournals, getHabits, getJournalFlows } from '@/db/database';

const ExportDataScreen = () => {
  const { colors } = useTheme();

  const exportData = async (dataType: string) => {
    let data;
    let fileName;
    try {
      if (dataType === 'journals') {
        data = await getJournals();
        fileName = 'journals.json';
      } else if (dataType === 'habits') {
        data = await getHabits();
        fileName = 'habits.json';
      } else if (dataType === 'journalFlows') {
        data = await getJournalFlows();
        fileName = 'journal_flows.json';
      }

      const json = JSON.stringify(data);
      const fileUri = FileSystem.documentDirectory! + fileName!;
      await FileSystem.writeAsStringAsync(fileUri, json);
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      Alert.alert('Export Error', 'Failed to export data.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => exportData('journals')}
      >
        <Text style={styles.buttonText}>Export Journals</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => exportData('habits')}
      >
        <Text style={styles.buttonText}>Export Habits</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => exportData('journalFlows')}
      >
        <Text style={styles.buttonText}>Export Journal Flows</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ExportDataScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  button: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
