import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { firestore, auth } from '../../../firebase.js';
import { BarChart } from "react-native-gifted-charts";

const DiaryAnalyticsScreen = () => {
  const [emojiCounts, setEmojiCounts] = useState([]);
  const [currentMonth, setCurrentMonth] = useState('');
  const [highestEmoji, setHighestEmoji] = useState('');

  const allEmojis = ['😊', '😭', '😐', '😨'];

  useEffect(() => {
    const user = auth.currentUser;
    const diaryRef = firestore.collection('diaryEntries');

    if (user) {
      const startDate = new Date();
      startDate.setDate(1); // Start from the first day of the current month
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date();
      endDate.setDate(1); // Set to the first day of the next month
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setHours(0, 0, 0, 0);

      const query = diaryRef
        .where('userId', '==', user.uid)
        .where('timestamp', '>=', startDate)
        .where('timestamp', '<', endDate);

      query.get().then((snapshot) => {
        const emojiCountsMap = allEmojis.reduce((map, emoji) => {
          map[emoji] = 0;
          return map;
        }, {});

        snapshot.forEach((doc) => {
          const emoji = doc.data().emoji;
          emojiCountsMap[emoji] += 1;
        });

        const emojiCountsArray = Object.keys(emojiCountsMap).map((emoji) => ({
          emoji,
          count: emojiCountsMap[emoji],
        }));

        setEmojiCounts(emojiCountsArray);

        let maxCount = 0;
        let maxEmoji = '';
        emojiCountsArray.forEach((item) => {
          if (item.count > maxCount) {
            maxCount = item.count;
            maxEmoji = item.emoji;
          }
        });
        setHighestEmoji(maxEmoji);
      });
    }

    const currentDate = new Date();
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    setCurrentMonth(monthName);
  }, []);

  const chartData = emojiCounts.map((item) => ({
    value: item.count,
    label: item.emoji,
  }));

  const totalReflectionsCount = emojiCounts.reduce(
    (total, item) => total + item.count,
    0
  );

  const getQuoteForEmoji = (emoji) => {
    switch (emoji) {
      case '😊':
        return "Keep smiling! You're doing great!";
      case '😭':
        return "It's okay to cry. Remember, tough times don't last!";
      case '😐':
        return "Stay positive and embrace new opportunities!";
      case '😨':
        return "Don't worry, you're stronger than you think!";
      default:
        return 'Keep going and stay positive!';
    }
  };

  const quoteForHighestEmoji = getQuoteForEmoji(highestEmoji);

  return (
    <View style={styles.container}>
      <View style={styles.chartWithTitle}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Overview for {currentMonth}</Text>
        </View>

        <View style={styles.chartContainer}>
          <BarChart
            data={chartData}
            barWidth={20}
            initialSpacing={45}
            spacing={42}
            barBorderRadius={4}
            yAxisThickness={0}
            frontColor={'#75CE9F'}
            xAxisType={'dashed'}
            xAxisColor={'lightgray'}
            yAxisTextStyle={{ color: 'lightgray' }}
            noOfSections={6}
            labelWidth={12}
            showLine
            lineConfig={{
              color: '#FFC06E',
              thickness: 3,
              curved: true,
              hideDataPoints: true,
              shiftY: 20,
              initialSpacing: 50,
            }}
          />
        </View>
      </View>

      <View style={styles.emojiContainer}>
        {emojiCounts.map((item) => (
          <View key={item.emoji} style={styles.emojiItem}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.count}>{item.count}</Text>
            <Text style={styles.additionalInfo}>Average Rating: {item.averageRating}</Text>
            <Text style={styles.percentage}>
              {((item.count / totalReflectionsCount) * 100).toFixed(2)}%
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.quoteContainer}>
        <Text style={styles.quote}>{quoteForHighestEmoji}</Text>
      </View>
    </View>
  );
};

export default DiaryAnalyticsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: 'white',
    fontFamily: 'popSemiBold',
  },
  titleContainer: {
    marginTop: 10,
  },
  chartWithTitle: {
    margin: 2,
    width: '100%',
    height: '40%',
    borderRadius: 20,
    backgroundColor: '#06373A',
    alignItems: 'center',
  },
  chartContainer: {
    margin: 5,
  },
  emojiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  emojiItem: {
    width: '48%',
    marginBottom: 10,
    backgroundColor: '#478C5C',
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  count: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'popSemiBold',
  },
  percentage: {
    fontSize: 14,
    color: 'lightgrey',
    fontFamily: 'popSemiBold',
  },
  additionalInfo: {
    fontSize: 14,
    color: 'lightgrey',
    fontFamily: 'popSemiBold',
  },
  quoteContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#26580F',
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
  },
  quote: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'popSemiBold',
    paddingVertical: 40,
  },
});
