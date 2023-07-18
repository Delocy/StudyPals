import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const AchievementScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Possible Achievements</Text>
      <ScrollView>
        <View style={styles.achievementsContainer}>
          <View style={styles.achievementRow}>
            <Image source={require('../HomeScreen/Images/1.png')} style={styles.achievementIcon} />
            <View style={styles.achievementDetails}>
              <Text style={styles.achievementName}>Completed 1 Task</Text>
              <Text style={styles.achievementDescription}>Achieve by completing 1 task.</Text>
            </View>
          </View>

          <View style={styles.achievementRow}>
            <Image source={require('../HomeScreen/Images/2.png')} style={styles.achievementIcon} />
            <View style={styles.achievementDetails}>
              <Text style={styles.achievementName}>Completed 10 Tasks</Text>
              <Text style={styles.achievementDescription}>Achieve by completing 10 tasks.</Text>
            </View>
          </View>

          <View style={styles.achievementRow}>
            <Image source={require('../HomeScreen/Images/3.png')} style={styles.achievementIcon} />
            <View style={styles.achievementDetails}>
              <Text style={styles.achievementName}>Completed 100 Tasks</Text>
              <Text style={styles.achievementDescription}>Achieve by completing 100 tasks.</Text>
            </View>
          </View>

          {/* Add more achievements as needed */}
        </View>

        <View style={styles.achievementsContainer}>
          <View style={styles.achievementRow}>
            <Image source={require('../HomeScreen/Images/4.png')} style={styles.achievementIcon} />
            <View style={styles.achievementDetails}>
              <Text style={styles.achievementName}>Focused for 1 Hr</Text>
              <Text style={styles.achievementDescription}>Achieve by focusing for 1 hour.</Text>
            </View>
          </View>

          <View style={styles.achievementRow}>
            <Image source={require('../HomeScreen/Images/5.png')} style={styles.achievementIcon} />
            <View style={styles.achievementDetails}>
              <Text style={styles.achievementName}>Focused for 10 Hrs</Text>
              <Text style={styles.achievementDescription}>Achieve by focusing for 10 hours.</Text>
            </View>
          </View>

          <View style={styles.achievementRow}>
            <Image source={require('../HomeScreen/Images/6.png')} style={styles.achievementIcon} />
            <View style={styles.achievementDetails}>
              <Text style={styles.achievementName}>Focused for 100 Hrs</Text>
              <Text style={styles.achievementDescription}>Achieve by focusing for 100 hours.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000',
  },
  achievementsContainer: {
    marginBottom: 5,
    alignItems: 'center',
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  achievementIcon: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  achievementDetails: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    marginLeft: 10,
    color: '#000000',
  },
  achievementDescription: {
    fontSize: 14,
    marginLeft: 10,
    color: '#999999',
  },
});

export default AchievementScreen;
