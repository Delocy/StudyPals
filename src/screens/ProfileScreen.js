import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { firestore, auth } from '../../firebase';
import { logoutUser } from '../api/auth-api';
import { collection, query, where, getDocs } from 'firebase/firestore';

const ProfileScreen = () => {
  const [avatar, setAvatar] = useState(require('./HomeScreen/Images/avatar.png'));
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const tasksRef = collection(firestore, 'tasks');
        const q = query(tasksRef, where('userId', '==', auth.currentUser.uid), where('completed', '==', true));
        const snapshot = await getDocs(q);

        const tasks = snapshot.docs.map((doc) => doc.data());
        setCompletedTasks(tasks);
      } catch (error) {
        console.error('Error fetching completed tasks:', error);
        Alert.alert('Error', 'Failed to fetch completed tasks. Please try again.');
      }
    };

    fetchCompletedTasks();
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
        <Text style={styles.changeAvatarText}>Change Avatar</Text>
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
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'popSemiBold',
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
