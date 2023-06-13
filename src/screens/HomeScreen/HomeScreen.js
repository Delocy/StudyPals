import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, Image, ScrollView, TouchableOpacity } from 'react-native';
import { firestore, auth } from '../../../firebase.js';
import CircularProgress from 'react-native-circular-progress-indicator';

const HomeScreen = ({ navigation }) => {
  const [taskCount, setTaskCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [userName, setUserName] = useState('');
  const [showChart, setShowChart] = useState(true); // Add showChart state

  useEffect(() => {
    const currentDate = new Date().toISOString().split('T')[0];

    const tasksRef = firestore.collection('tasks');
    const query = tasksRef.where('time', '==', currentDate);

    const unsubscribe = query.onSnapshot((snapshot) => {
      const totalCount = snapshot.size;
      const completedTasks = snapshot.docs.filter((doc) => doc.data().completed);
      const completedCount = completedTasks.length;

      setTaskCount(totalCount);
      setCompletedCount(completedCount);
      setShowChart(totalCount > 0); // Update showChart state
    });

    const user = auth.currentUser;
    if (user) {
      setUserName(user.displayName);
    }

    return () => unsubscribe();
  }, []);

  const completionPercentage = taskCount > 0 ? (completedCount / taskCount) * 100 : 0;

  const getQuote = (percentage) => {
    if (percentage === 100) {
      return "Congratulations! You've completed all tasks!";
    } else if (percentage >= 80) {
      return "Great job! You're almost there! Keep up the good work and stay motivated!";
    } else if (percentage >= 50) {
      return "Keep going! You're making progress! Stay focused and determined!";
    } else {
      return "You can do it! Stay motivated and never give up on your goals!";
    }
  };

  const quote = getQuote(completionPercentage);
  const tasksLeft = taskCount - completedCount;

  const handleContainerPress = () => {
    // Perform navigation logic here
    navigation.navigate('MeditationScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('./Images/Logo.png')} style={styles.logo} />
        <Text style={styles.userName}>Hi, {userName}</Text>
      </View>
      {showChart ? ( // Render circular chart if showChart is true
        <View style={styles.rectangularContainer}>
          <CircularProgress
            value={completionPercentage}
            valueSuffix={'%'}
            radius={60}
            inActiveStrokeOpacity={0.5}
            activeStrokeWidth={20}
            inActiveStrokeWidth={20}
            progressValueStyle={{ color: '#478C5C' }}
          >
          </CircularProgress>
          <View style={styles.quoteContainer}>
            <Text style={styles.title}>Daily Task Tracker</Text>
            <Text numberOfLines={4} ellipsizeMode="tail" style={styles.quoteText}>
              {quote}
            </Text>
            <Text style={styles.tasksLeft}>{tasksLeft} task(s) left for today</Text>
          </View>
        </View>
      ) : ( // Render rest day component if showChart is false
        <View style={styles.restDayContainer}>
          <Text style={styles.restDayText}>It's important to take a rest!</Text>
          <Image source={require('./Images/dog.png')} style={styles.restImage} />
        </View>
      )}
      <Text>Start your day</Text>
      <ScrollView horizontal>
        <TouchableOpacity style={styles.containerButton} onPress={handleContainerPress}>
          {/* Add the content of the container here */}
          <Text>Meditation</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.containerButton} onPress={handleContainerPress}>
          {/* Add the content of the container here */}
          <Text>Another Button</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  userName: {
    fontSize: 30,
    color: '#478C5C', 
    letterSpacing: 1,
    fontFamily: 'popSemiBold',
  },
  rectangularContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6FFDE',
    flexDirection: 'row',
    padding: 20,
    borderRadius: 20,
    marginTop: 5,
    width: '95%',
    alignSelf: 'center',
  },
  quoteContainer: {
    marginLeft: 20,
    flexShrink: 1,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'popSemiBold',
  },
  quoteText: {
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'popRegular',
  },
  tasksLeft: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
    color: '#666666',
  },
  containerButton: {
    width: 198,
    height: 200,
    backgroundColor: 'lightblue',
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  restDayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#478C5C',
    padding: 20,
    borderRadius: 20,
    marginTop: 5,
    width: '95%',
    alignSelf: 'center',
  },
  restDayText: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'popSemiBold',
  },
  restImage: {
    width: 200, 
    height: 200, 
    marginTop: 20,
  },
});
