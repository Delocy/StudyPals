import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const DiaryEntriesScreen = ({ route }) => {
  const { diaryEntries } = route.params;
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    setEntries(diaryEntries);
  }, [diaryEntries]);

  // Render each diary entry in the FlatList
  const renderItem = ({ item }) => {
    return (
      <View style={styles.diaryEntry}>
        <View style={styles.dateEmojiContainer}>
          <Text style={styles.diaryDate}>{item.timestamp}</Text>
          <Text>{item.emoji}</Text>
        </View>
        <Text style={styles.diaryText}>{item.message}</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={entries.reverse()}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      style={styles.flatList}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  flatList: {
    flex: 1,
  },
  diaryEntry: {
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F7F7F7',
    borderRadius: 8,
  },
  dateEmojiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  diaryDate: {
    marginRight: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  diaryText: {
    fontSize: 16,
  },
});

export default DiaryEntriesScreen;
