import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, Image, ScrollView, TouchableOpacity } from 'react-native';
import { firestore, auth } from '../../../firebase.js';
import CircularProgress from 'react-native-circular-progress-indicator';
import { MaterialIcons } from '@expo/vector-icons';

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
      return "Congratulations! You've completed all your tasks!";
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

  const handleContainerPressToMeditation = () => {
    navigation.navigate('MeditationScreen');
  };

  const handleContainerPressToResources = () => {
    navigation.navigate('ResourcesScreen');
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
            progressValueStyle={{ color: 'white' }}
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
      ) : (
        <View style={styles.restDayContainer}>
          <Text numberOfLines={3} style={styles.restDayText}>It's your rest day!You have no task planned for the day</Text>
          <Image source={require('./Images/dog.png')} style={styles.restImage} />
        </View>
      )}
      <View>
        <View style={styles.categoryTitleWithArrow}>
            <Text style={styles.categoryTitle}>Start your day</Text>
            <View style={styles.arrowContainer}>
                <MaterialIcons name="arrow-forward-ios" size={15} color="black" style={styles.arrowIcon} />
            </View>
        </View>
        <ScrollView horizontal>
            <TouchableOpacity style={styles.containerButton} onPress={handleContainerPressToMeditation}>
            <Text style={styles.contentTitle}>Meditation</Text>
            <Text style={styles.content}>Take a deep breath</Text>
            <Image source={require('./Images/Meditate.png')} style={styles.restImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.containerButton} onPress={handleContainerPressToResources}>
            <Text>5 min read</Text>
            </TouchableOpacity>
        </ScrollView>
      </View>
      <View>
      <View style={styles.categoryTitleWithArrow}>
            <Text style={styles.categoryTitle}>Analytics</Text>
            <View style={styles.arrowContainer}>
                <MaterialIcons name="arrow-forward-ios" size={15} color="black" style={styles.arrowIcon} />
            </View>
        </View>
        <ScrollView horizontal>
            <TouchableOpacity style={styles.containerButton} onPress={handleContainerPressToMeditation}>
            <Text style={styles.contentTitle}>Diary</Text>
            <Text style={styles.content}>Track your mood</Text>
            <Image source={require('./Images/Diary.png')} style={styles.restImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.containerButton} onPress={handleContainerPressToMeditation}>
            <Text style={styles.contentTitle}>Timer</Text>
            <Text style={styles.content}>See how focused you are</Text>
            <Image source={require('./Images/Timer.png')} style={styles.restImage} />
            </TouchableOpacity>
        </ScrollView>
      </View>
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
    padding: 10,
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
    backgroundColor: '#478C5C',
    flexDirection: 'row',
    padding: 20,
    borderRadius: 20,
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
    color: 'white'
  },
  quoteText: {
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'popRegular',
    color: 'white',
  },
  tasksLeft: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
    color: '#DCE0EA',
  },
  containerButton: {
    width: 198,
    height: 200,
    backgroundColor: '#F6FFDE',
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 10,
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
    flexDirection: 'row',
    padding: 20,
    borderRadius: 20,
    width: '95%',
    alignSelf: 'center',
  },
  restDayText: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'popSemiBold',
    width: '50%',
  },
  restImage: {
    width: 130, 
    height: 120, 
    marginTop: 10,
  },
  categoryTitle: {
    marginLeft: 15,
    marginTop: 10,
    fontFamily: 'popSemiBold',
    fontSize: 17,
  },
  contentTitle: {
    fontFamily: 'popSemiBold',
  },
  content: {
    fontFamily: 'popRegular',
  },
  categoryTitleWithArrow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowIcon: {
    marginLeft: 5,
  },
  arrowContainer: {
    flex: 1,
    marginTop: 10,
    marginRight: 15,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
