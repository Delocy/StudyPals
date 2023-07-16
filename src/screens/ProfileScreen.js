import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { firestore, auth } from '../../firebase';
import { logoutUser } from '../api/auth-api';
import { collection, query, where, getDocs } from 'firebase/firestore';

const ProfileScreen = () => {
  const [avatar, setAvatar] = useState(require('./HomeScreen/Images/avatar.png'));
  const [completedTasks, setCompletedTasks] = useState([]);
  const [hrsFocused, setHrsFocused] = useState(0);

  useEffect(() => {
    const fetchTimerData = async () => {
      try {
        const userId = auth.currentUser.uid;

        // Fetch the timer data
        const timerDocRef = firestore.collection('pomodoro').doc(userId);
        const timerDoc = await timerDocRef.get();

        if (timerDoc.exists) {
          const timerData = timerDoc.data();
          console.log(timerData);

          // Calculate the total hours spent
          const totalHoursSpent = Object.values(timerData).reduce(
            (total, data) => total + (data.totalWorkDuration || 0), 0
          );
          // console.log(totalHoursSpent);

          // Fetch the completed tasks
          const tasksQuerySnapshot = await firestore
            .collection('tasks')
            .where('userId', '==', userId)
            .where('completed', '==', true)
            .get();

          const completedTasks = tasksQuerySnapshot.docs.map((doc) => doc.data());

          // Update the completedTasks state and check for achievements
          setCompletedTasks(completedTasks);
          setHrsFocused(totalHoursSpent);
        }
      } catch (error) {
        console.error('Error fetching timer data:', error);
        Alert.alert('Error', 'Failed to fetch timer data. Please try again.');
      }
    };

    fetchTimerData();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library denied.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar({ uri: result.uri });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
        <Image source={avatar} style={styles.avatar} />
      </TouchableOpacity>

      <Text style={styles.username}>{auth.currentUser?.displayName}</Text>

      <View style={styles.achievementTitle}>
        <Text style={styles.sectionTitle}>Achievements</Text>
      </View>

      <View style={styles.achievementsContainer}>
        {completedTasks.length >= 1 && (
          <View style={styles.achievementRow}>
            <Image source={require('./HomeScreen/Images/1.png')} style={styles.achievementIcon} />
          </View>
        )}

        {completedTasks.length >= 3 && (
          <View style={styles.achievementRow}>
            <Image source={require('./HomeScreen/Images/2.png')} style={styles.achievementIcon} />
          </View>
        )}

        {completedTasks.length >= 10 && (
          <View style={styles.achievementRow}>
            <Image source={require('./HomeScreen/Images/3.png')} style={styles.achievementIcon} />
          </View>
        )}

        {/* Add more achievements as needed */}
      </View>

      <View style={styles.achievementsContainer}>
        {hrsFocused >= 60 && (
          <View style={styles.achievementRow}>
            <Image source={require('./HomeScreen/Images/4.png')} style={styles.achievementIcon} />
          </View>
        )}

        {hrsFocused >= 600 && (
          <View style={styles.achievementRow}>
            <Image source={require('./HomeScreen/Images/5.png')} style={styles.achievementIcon} />
          </View>
        )}

        {hrsFocused >= 6000 && (
          <View style={styles.achievementRow}>
            <Image source={require('./HomeScreen/Images/6.png')} style={styles.achievementIcon} />
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={logoutUser}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  changeAvatarText: {
    fontSize: 16,
    color: '#478C5C',
    textDecorationLine: 'underline',
    fontFamily: 'popSemiBold',
  },
  username: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: 'popSemiBold',
  },
  achievementsContainer: {
    width: '100%',
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'popRegular',
    marginBottom: 10,
  },
  achievementTitle: {
    justifyContent: 'flex-start',
  },
  achievementRow: {
    flexDirection: 'row',
    marginBottom: 10,
    marginLeft: 20,
  },
  achievementIcon: {
    width: 100,
    height: 100,
  },
  achievementName: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#478C5C',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default ProfileScreen;
