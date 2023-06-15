import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { firestore, auth } from '../../../firebase.js';

const DiaryAnalyticsScreen = () => {
  const [emojiCounts, setEmojiCounts] = useState([]);

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
        .where('time', '>=', startDate.toISOString())
        .where('time', '<', endDate.toISOString());

      query.get().then((snapshot) => {
        const emojiCountsMap = {};

        snapshot.forEach((doc) => {
          const emoji = doc.data().emoji;
          emojiCountsMap[emoji] = (emojiCountsMap[emoji] || 0) + 1;
        });

        // Convert the map to an array of objects
        const emojiCountsArray = Object.keys(emojiCountsMap).map((emoji) => ({
          emoji,
          count: emojiCountsMap[emoji],
        }));

        setEmojiCounts(emojiCountsArray);
      });
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emoji Analytics for the Month</Text>
      {emojiCounts.map((item) => (
        <View key={item.emoji} style={styles.emojiContainer}>
          <Text style={styles.emoji}>{item.emoji}</Text>
          <Text style={styles.count}>{item.count}</Text>
        </View>
      ))}
    </View>
  );
};

export default DiaryAnalyticsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emojiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  emoji: {
    fontSize: 24,
    marginRight: 10,
  },
  count: {
    fontSize: 18,
  },
});
