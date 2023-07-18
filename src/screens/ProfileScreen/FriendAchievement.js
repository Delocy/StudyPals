import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { firestore, auth } from '../../../firebase';

const FriendAchievementsScreen = ({ route }) => {
  const { friendId, userId, friendName, userName } = route.params;
  const [completedTasks, setCompletedTasks] = useState([]);
  const [hrsFocused, setHrsFocused] = useState(0);

  const isRequester = friendId === auth.currentUser.uid;

  // Fetch friend's achievements
  useEffect(() => {
    const fetchFriendAchievements = async () => {
      try {
        // Fetch the completed tasks
        const tasksQuerySnapshot = await firestore
          .collection('tasks')
          .where('userId', '==', isRequester ? userId : friendId)
          .where('completed', '==', true)
          .get();

        const completedTasks = tasksQuerySnapshot.docs.map((doc) => doc.data());
        setCompletedTasks(completedTasks);

        // Fetch the friend's timer data
        const timerDocRef = firestore.collection('pomodoro').doc(isRequester ? userId : friendId);
        const timerDoc = await timerDocRef.get();

        if (timerDoc.exists) {
          const timerData = timerDoc.data();

          // Calculate the total hours spent
          const totalHoursSpent = Object.values(timerData).reduce(
            (total, data) => total + (data.totalWorkDuration || 0),
            0
          );

          setHrsFocused(totalHoursSpent);
        }
      } catch (error) {
        console.error('Error fetching friend achievements:', error);
        Alert.alert('Error', 'Failed to fetch friend achievements. Please try again.');
      }
    };
    fetchFriendAchievements();
  }, [friendId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRequester ? userName : friendName}</Text>
      <View style={styles.achievementTitle}>
        <Text style={styles.sectionTitle}>Achievements</Text>
      </View>

      <ScrollView>
        <View style={styles.achievementsContainer}>
          {completedTasks.length >= 1 && (
            <View style={styles.achievementRow}>
              <Image source={require('../HomeScreen/Images/1.png')} style={styles.achievementIcon} />
              <View style={styles.achievementDetails}>
                <Text style={styles.achievementName}>Completed 1 Task</Text>
              </View>
            </View>
          )}

          {completedTasks.length >= 3 && (
            <View style={styles.achievementRow}>
              <Image source={require('../HomeScreen/Images/2.png')} style={styles.achievementIcon} />
              <View style={styles.achievementDetails}>
                <Text style={styles.achievementName}>Completed 10 Tasks</Text>
              </View>
            </View>
          )}

          {completedTasks.length >= 10 && (
            <View style={styles.achievementRow}>
              <Image source={require('../HomeScreen/Images/3.png')} style={styles.achievementIcon} />
              <View style={styles.achievementDetails}>
                <Text style={styles.achievementName}>Completed 100 Tasks</Text>
              </View>
            </View>
          )}

          {/* Add more achievements as needed */}
          
          {completedTasks.length === 0 && hrsFocused < 60 && (
            <View style={styles.achievementRow}>
              <Text style={styles.noAchievementsText}>No achievements achieved yet.</Text>
            </View>
          )}
        </View>

        <View style={styles.achievementsContainer}>
          {hrsFocused >= 60 && (
            <View style={styles.achievementRow}>
              <Image source={require('../HomeScreen/Images/4.png')} style={styles.achievementIcon} />
              <View style={styles.achievementDetails}>
                <Text style={styles.achievementName}>Focused for 1 Hr</Text>
              </View>
            </View>
          )}

          {hrsFocused >= 600 && (
            <View style={styles.achievementRow}>
              <Image source={require('../HomeScreen/Images/5.png')} style={styles.achievementIcon} />
              <View style={styles.achievementDetails}>
                <Text style={styles.achievementName}>Focused for 10 Hrs</Text>
              </View>
            </View>
          )}

          {hrsFocused >= 6000 && (
            <View style={styles.achievementRow}>
              <Image source={require('../HomeScreen/Images/6.png')} style={styles.achievementIcon} />
              <View style={styles.achievementDetails}>
                <Text style={styles.achievementName}>Focused for 100 Hrs</Text>
              </View>
            </View>
          )}
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
  achievementTitle: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
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
  noAchievementsText: {
    fontSize: 16,
    color: '#000000',
    fontStyle: 'italic',
  },
});

export default FriendAchievementsScreen;
