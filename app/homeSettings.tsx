// HomeSettings.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { CheckBox, Button } from '@rneui/themed';
import { QuotePack } from '@/interfaces/Quotes';
import { getAllQuotePacks } from '@/db/database';

const HomeSettings = () => {
  const [quotePacks, setQuotePacks] = useState<QuotePack[]>([]);
  const [selectedPacks, setSelectedPacks] = useState<number[]>([]);
  const { colors } = useTheme();
  const router = useRouter();

  useEffect(() => {
    fetchQuotePacks();
    loadSelectedPacks();
  }, []);

  const fetchQuotePacks = async () => {
    try {
      const packs = await getAllQuotePacks();
      setQuotePacks(packs);
    } catch (error) {
      Alert.alert('Error', 'Failed to load quote packs.');
    }
  };

  const loadSelectedPacks = async () => {
    try {
      const selected = await AsyncStorage.getItem('selectedQuotePackIds');
      if (selected) {
        setSelectedPacks(JSON.parse(selected));
      }
    } catch (error) {
      console.error('Error loading selected quote packs:', error);
    }
  };

  const toggleSelectPack = async (packId: number) => {
    let updatedSelected = [...selectedPacks];
    if (selectedPacks.includes(packId)) {
      updatedSelected = updatedSelected.filter((id) => id !== packId);
    } else {
      updatedSelected.push(packId);
    }
    setSelectedPacks(updatedSelected);
    await AsyncStorage.setItem('selectedQuotePackIds', JSON.stringify(updatedSelected));
  };

  const renderItem = ({ item }: { item: QuotePack }) => (
    <View style={styles.packItem}>
      <CheckBox
        checked={selectedPacks.includes(item.id!)}
        onPress={() => toggleSelectPack(item.id!)}
      />
      <View style={{ flex: 1 }}>
        <Text style={[styles.packName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.packDescription, { color: colors.text }]}>{item.description}</Text>
      </View>
      {!item.isPredefined && (
        <Button
          title="Edit"
          onPress={() => router.push(`/QuotePackEditor?id=${item.id ?? 0}`)}
          buttonStyle={{ backgroundColor: colors.primary }}
        />
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Button
        title="Create New Quote Pack"
        onPress={() => router.push("/QuotePackEditor")}
        buttonStyle={{ backgroundColor: colors.primary, margin: 10 }}
      />
      <FlatList
        data={quotePacks}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default HomeSettings;

const styles = StyleSheet.create({
  container: { flex: 1 },
  packItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  packName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  packDescription: {
    fontSize: 14,
  },
});
