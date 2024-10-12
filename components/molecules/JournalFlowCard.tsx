import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { JournalFlow } from '@/interfaces/Journal';
import { useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
const JournalFlowCard = ({
  item,
  toggleFavorite,
  isFavorite,
}: {
  item: JournalFlow;
  toggleFavorite: (flowId: number) => void;
  isFavorite: (flowId: number) => boolean;
}) => {
  const { colors } = useTheme();
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.flowCard}
      onPress={() => router.push(`/journalFlow?id=${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.flowName}>{item.name}</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            onPress={() => router.push(`/addJournalFlow?id=${item.id}`)}
            style={styles.editButton}
          >
            <Ionicons name="pencil" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => toggleFavorite(item.id!)}
            style={styles.favoriteButton}
          >
            <Ionicons
              name={isFavorite(item.id!) ? 'heart' : 'heart-outline'}
              size={24}
              color="#E91E63"
            />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.flowDescription}>{item.description}</Text>
    </TouchableOpacity>
  );
};

export default JournalFlowCard;

const styles = StyleSheet.create({
  flowCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flowName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  flowDescription: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 5,
    marginRight: 10,
  },
  favoriteButton: {
    padding: 5,
  },
});
