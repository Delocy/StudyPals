import React, { useState, useEffect, PureComponent } from 'react';
import Tag from './TagColors';
import { Text, Image, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Agenda, AgendaEntry, AgendaSchedule, DateData } from 'react-native-calendars';
import { Card, Avatar } from 'react-native-paper';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};

const theme = {
  backgroundColor: '#ffffff',
  calendarBackground: '#ffffff',
  textSectionTitleColor: '#b6c1cd',
  selectedDayBackgroundColor: '#478C5C',
  selectedDayTextColor: '#ffffff',
  todayTextColor: '#478C5C',
  dayTextColor: '#2d4150',
  textDisabledColor: '#999999',
  arrowColor: '#478C5C',
};

const firebaseConfig = {
  apiKey: "AIzaSyAae5wIuRN8tuqvKTbwJJDWOCDFutgF2M0",
  authDomain: "studypals-auth.firebaseapp.com",
  projectId: "studypals-auth",
  storageBucket: "studypals-auth.appspot.com",
  messagingSenderId: "848602608150",
  appId: "1:848602608150:web:214341bebeac9aea74fb37",
  measurementId: "G-C13G3L9F88"
};

const CalendarScreen = ({ navigation }) => {
  const [items, setItems] = useState({});
  const [subtitle, setSubtitle] = useState('');
  const [selectedDate, setSelectedDate] = useState(timeToString(Date.now()));

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const tasksSnapshot = await getDocs(collection(db, 'tasks'));
  
      const formattedItems = {};
  
      tasksSnapshot.forEach((doc) => {
        const task = doc.data();
        const strTime = timeToString(task.time);
  
        if (!formattedItems[strTime]) {
          formattedItems[strTime] = [];
        }
  
        formattedItems[strTime].push({
          name: task.name,
          description: task.description,
          startTime: task.startTime,
          endTime: task.endTime,
          time: task.time,
          tags: task.tags || []
        });
      });
  
      setItems(formattedItems);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  }

  const navigateToAddTaskScreen = () => {
    navigation.navigate('AddTask', { date: selectedDate });
  };

  const renderItem = (item) => {
    const startTime = new Date(item.startTime.seconds * 1000); // Convert timestamp to Date object
    const endTime = new Date(item.endTime.seconds * 1000);

    const startTimeString = startTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const endTimeString = endTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    return (
      <TouchableOpacity style={{ marginRight: 10, marginTop: 17 }}>
        <Card>
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardText}>{item.name}</Text>
              <Text style={styles.cardText}>{item.description.toString()}</Text>
              <Text>{startTimeString} - {endTimeString}</Text>
              <View style={{ flexDirection: 'row', marginTop: 8 }}>
                {item.tags.map((tag, index) => (
                  <Tag key={index} text={tag} />
                ))}
              </View>
            </View>
            <Avatar.Image
              source={require('./ImageLogo/sunflower.jpeg')}
              size={40}
            />
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };


  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Task</Text>
        <Text style={styles.subtitleText}>{subtitle}</Text>
      </View>
      <Agenda
        items={items}
        theme={theme}
        loadItemsForMonth={loadTasks}
        selected={timeToString(Date.now())}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        onDayPress={(date) => {
          setSelectedDate(date.dateString);
          const selectedMonth = new Date(date.year, date.month - 1).toLocaleString('default', { month: 'long' });
          setSubtitle(selectedMonth);
        }}
        showOnlySelectedDayItems
      />
      <TouchableOpacity style={styles.addButton} onPress={navigateToAddTaskScreen}>
        <Text style={styles.addButtonLabel}>Add Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Set the background color to white
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10,
    backgroundColor: '#ffffff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitleText: {
    fontSize: 16,
    marginLeft: 8,
    color: 'gray',
  },
  taskInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  taskInput: {
    flex: 1,
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  },
  addButton: {
    backgroundColor: '#478C5C',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonLabel: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  dayContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: '#478C5C',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTextContainer: {
    flexDirection: 'column',
    flex: 1,
    marginRight: 8,
  },
  cardText: {
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tagBox: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 4,
    marginBottom: 4,
  },
  tagText: {
    color: '#000000',
    fontSize: 12,
  },
});


export default CalendarScreen;
