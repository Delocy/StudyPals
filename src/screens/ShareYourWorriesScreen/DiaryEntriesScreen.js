import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const DiaryEntriesScreen = ({ route }) => {
  const { diaryEntries } = route.params;
  const [entries, setEntries] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());  
  
  useEffect(() => {
    let filteredEntries = diaryEntries[0];
    if (selectedMonth !== '' && selectedYear !== '') {
      const month = parseInt(selectedMonth, 10);
      const year = parseInt(selectedYear, 10);
      filteredEntries = diaryEntries[0].filter((entry) => {
        const entryMonth = entry.timestamp.toDate().getMonth();
        const entryYear = entry.timestamp.toDate().getFullYear();
        return entryMonth === month && entryYear === year;
      });
    }
    const sortedEntries = filteredEntries.sort(
      (a, b) => a.timestamp.toMillis() - b.timestamp.toMillis()
    );
    setEntries(sortedEntries);
  }, [diaryEntries, selectedMonth, selectedYear]);

  // Render each diary entry in the FlatList
  const renderItem = ({ item }) => {
    const timestamp = item.timestamp.toDate();
    const formattedDate = timestamp.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return (
      <View style={styles.diaryEntry}>
        <View style={styles.dateEmojiContainer}>
          <Text style={styles.diaryDate}>{formattedDate}</Text>
          <Text>{item.emoji}</Text>
        </View>
        <Text style={styles.diaryText}>{item.message}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Picker
          style={styles.picker}
          selectedValue={selectedMonth}
          onValueChange={(itemValue) => setSelectedMonth(itemValue)}
        >
          <Picker.Item label="January" value="0" />
          <Picker.Item label="February" value="1" />
          <Picker.Item label="March" value="2" />
          <Picker.Item label="April" value="3" />
          <Picker.Item label="May" value="4" />
          <Picker.Item label="June" value="5" />
          <Picker.Item label="July" value="6" />
          <Picker.Item label="August" value="7" />
          <Picker.Item label="September" value="8" />
          <Picker.Item label="October" value="9" />
          <Picker.Item label="November" value="10" />
          <Picker.Item label="December" value="11" />
        </Picker>
        <Picker
          style={styles.picker}
          selectedValue={selectedYear}
          onValueChange={(itemValue) => setSelectedYear(itemValue)}
        >
          <Picker.Item label="2023" value="2023" />
          {/* Add more years if needed */}
        </Picker>
      </View>
      <FlatList
        data={entries.reverse()}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.flatList}
        style={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#F6FFDE',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  picker: {
    flex: 1,
    marginRight: 8,
  },
  flatList: {
    flex: 1,
  },
  diaryEntry: {
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#E8FEEE',
    borderRadius: 8,
  },
  dateEmojiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  diaryDate: {
    marginRight: 8,
    fontSize: 15,
    fontFamily: 'popSemiBold',
    color: '#478C5C',
  },
  diaryText: {
    fontSize: 13,
    color: '#000',
    fontFamily: 'popMedium',
  },
});

export default DiaryEntriesScreen;
