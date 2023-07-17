import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view'
import { auth } from '../../../firebase.js';

const DiaryEntriesScreen = ({ route }) => {
  const { diaryEntries } = route.params;
  const [entries, setEntries] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [isMonthModalVisible, setMonthModalVisible] = useState(false);
  const [isYearModalVisible, setYearModalVisible] = useState(false);
  const userName = auth.currentUser.displayName;
  
  useEffect(() => {
    let filteredEntries = diaryEntries[0];
    if (selectedMonth !== '' && selectedYear !== '') {
      const month = selectedMonth;
      const year = parseInt(selectedYear, 10);
      filteredEntries = diaryEntries[0].filter((entry) => {
        const entryMonth = entry.timestamp.toDate().toLocaleString('default', { month: 'long' });
        const entryYear = entry.timestamp.toDate().getFullYear();
        return entryMonth === month && entryYear === year;
      });
    }
    const sortedEntries = filteredEntries.sort(
      (a, b) => a.timestamp.toMillis() - b.timestamp.toMillis()
    );
    setEntries(sortedEntries);
  }, [diaryEntries, selectedMonth, selectedYear]);

  const calculateInsights = () => {
    const entries = diaryEntries[0];
    const totalEntries = entries.length;
    let currentStreak = 0;
    let longestStreak = 0;
  
    for (let i = 0; i < totalEntries; i++) {
      if (i === 0 || entries[i].timestamp.toDate() - entries[i - 1].timestamp.toDate() <= 86400000) {
        // If it's the first entry or the current entry is within one day of the previous entry, increase current streak
        currentStreak += 1;
      } else {
        // Reset current streak if there is a gap of more than one day between entries
        currentStreak = 1;
      }
  
      // Update the longest streak if the current streak is greater
      longestStreak = Math.max(longestStreak, currentStreak);
    }
  
    return { totalEntries, currentStreak, longestStreak };
  };  
  
  const insights = calculateInsights();

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
        <Text style={styles.diaryText}>{userName}: {item.message}</Text>
        <Text></Text>
        <Text style={styles.responseText}>StudyPals: {item.generatedPrompt.trimStart()}</Text>
      </View>
    );
  };

  const toggleMonthModal = () => {
    setMonthModalVisible(!isMonthModalVisible);
  };

  const toggleYearModal = () => {
    setYearModalVisible(!isYearModalVisible);
  };

  const handleMonthSelection = (month) => {
    setSelectedMonth(month);
    setMonthModalVisible(false);
  };

  const handleYearSelection = (year) => {
    setSelectedYear(year);
    setYearModalVisible(false);
  };

  const renderMonthDropdown = () => {
    return (
      <Modal
        visible={isMonthModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleMonthModal}
      >
        <View style={styles.dropdownContainer}>
        <TouchableOpacity style={styles.dropdownOption} onPress={() => handleMonthSelection("January")}>
            <Text style={styles.month}>January</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownOption} onPress={() => handleMonthSelection("February")}>
            <Text style={styles.month}>February</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownOption} onPress={() => handleMonthSelection("March")}>
            <Text style={styles.month}>March</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownOption} onPress={() => handleMonthSelection("April")}>
            <Text style={styles.month}>April</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownOption} onPress={() => handleMonthSelection("May")}>
            <Text style={styles.month}>May</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownOption} onPress={() => handleMonthSelection("June")}>
            <Text style={styles.month}>June</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownOption} onPress={() => handleMonthSelection("July")}>
            <Text style={styles.month}>July</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownOption} onPress={() => handleMonthSelection("August")}>
            <Text style={styles.month}>August</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownOption} onPress={() => handleMonthSelection("September")}>
            <Text style={styles.month}>September</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownOption} onPress={() => handleMonthSelection("October")}>
            <Text style={styles.month}>October</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownOption} onPress={() => handleMonthSelection("November")}>
            <Text style={styles.month}>November</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownOption} onPress={() => handleMonthSelection("December")}>
            <Text style={styles.month}>December</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  const renderYearDropdown = () => {
    return (
      <Modal
        visible={isYearModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleYearModal}
      >
        <View style={styles.dropdownContainer}>
          <TouchableOpacity style={styles.dropdownOption} onPress={() => handleYearSelection("2023")}>
            <Text style={styles.month}>2023</Text>
          </TouchableOpacity>
          {/* Render other year options */}
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <Text style={styles.cardTitle}>Insights</Text>
        <View style={styles.insightsContainer}>
          <View style={styles.insightCard}>
            <Text style={styles.insightValue}>{insights.currentStreak}</Text>
            <Text style={styles.insightTitle}>CURRENT STREAK</Text>
          </View>
          <View style={styles.insightCard}>
            <Text style={styles.insightValue}>{insights.longestStreak}</Text>
            <Text style={styles.insightTitle}>LONGEST STREAK</Text>
          </View>
          <View style={styles.insightCard}>
            <Text style={styles.insightValue}>{insights.totalEntries}</Text>
            <Text style={styles.insightTitle}>TOTAL ENTRIES</Text>
          </View>
        </View>
      </View>
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.dropdownButton} onPress={toggleMonthModal}>
          <Text style={styles.displayedFilter}>{selectedMonth}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dropdownButton} onPress={toggleYearModal}>
          <Text style={styles.displayedFilter}>{selectedYear}</Text>
        </TouchableOpacity>
      </View>
      {renderMonthDropdown()}
      {renderYearDropdown()}
      <ScrollView>
        <FlatList
          data={entries.reverse()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.flatList}
          style={styles.flatList}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#AAC8A7',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '3%',
  },
  dropdownButton: {
    flex: 1,
    marginRight: '1.8%',
    paddingVertical: '3%',
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: '3%',
  },
  dropdownContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#AAC8A7',
  },
  dropdownOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
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
    color: '#000',
  },
  month: {
    fontSize: 16,
    fontFamily: 'popRegular',
    color: '#fff',
  },
  diaryText: {
    fontSize: 15,
    color: '#454545',
    fontFamily: 'popMedium',
  },
  responseText: {
    fontSize: 15,
    color: '#478C5C',
    fontFamily: 'popMedium'
  },
  insightsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: '#F2FDF5',
    borderRadius: 10,
  },
  insightCard: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  insightTitle: {
    fontSize: 15,
    fontFamily: 'popMedium',
    color: '#478C5C',
    textAlign: 'center',
  },
  insightValue: {
    fontSize: 22,
    fontFamily: 'popSemiBold',
    color: '#000',
    textAlign: 'center',
  },
  cardContainer: {
    backgroundColor: '#F6FFDE',
    borderRadius: 10,
    padding: 16,
    marginTop: '5%',
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'popSemiBold',
    marginBottom: 10,
    color: '#000',
  },
  displayedFilter: {
    fontFamily: 'popRegular',
    fontSize: 12,
  }
});

export default DiaryEntriesScreen;
