import React, { useState, useEffect, PureComponent } from 'react';
import Tag from './TagColors';
import { Text, Image, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Agenda, AgendaEntry, AgendaSchedule, DateData } from 'react-native-calendars';
import { Card, Avatar } from 'react-native-paper';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import { getFirestore, query, where ,collection, getDocs, deleteDoc, doc } from "firebase/firestore";

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
  const [markedDates, setMarkedDates] = useState({});

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
      const tasksSnapshot = await getDocs(q);
      const formattedItems = {};
      const formattedMarkedDates = {};
  
      tasksSnapshot.forEach((doc) => {
        const task = doc.data();
        const strTime = timeToString(task.time);
  
        if (!formattedItems[strTime]) {
          formattedItems[strTime] = [];
        }
  
        formattedItems[strTime].push({
          id: doc.id,
          name: task.name,
          description: task.description,
          startTime: task.startTime,
          endTime: task.endTime,
          time: task.time,
          tags: task.tags || []
        });
        formattedMarkedDates[strTime] = { 
          marked: true,
          dotColor: '#478C5C',
          // selectedDotColor: '#ffffff',
        };
      });

      // Sort the tasks by start time in ascending order
      const sortedItems = {};
      Object.keys(formattedItems).forEach((date) => {
        sortedItems[date] = formattedItems[date].sort((a, b) => a.startTime.seconds - b.startTime.seconds);
      });
  
      setItems(sortedItems);
      setMarkedDates(formattedMarkedDates);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const navigateToAddTaskScreen = () => {
    navigation.navigate('AddTask', { date: selectedDate });
  };

  const renderItem = (item) => {
    const startTime = new Date(item.startTime.seconds * 1000); // Convert timestamp to Date object
    const endTime = new Date(item.endTime.seconds * 1000);
  
    const startTimeString = startTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const endTimeString = endTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  
    const handleDelete = async () => {
      try {
        const taskRef = doc(db, 'tasks', item.id); // Use the correct document ID
        await deleteDoc(taskRef);
        loadTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    };
    
    
    return (
      <TouchableOpacity style={{ marginLeft:20, marginRight: 20, marginTop: 20 }}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardText}>{item.name}</Text>
              <Text style={styles.cardTextDescription}>{item.description.toString()}</Text>
              <Text style={styles.cardTextDescription}>{startTimeString} - {endTimeString}</Text>
              <View style={{ flexDirection: 'row', marginTop: 8 }}>
                {item.tags.map((tag, index) => (
                  <Tag key={index} text={tag} />
                ))}
              </View>
            </View>
            <TouchableOpacity onPress={handleDelete}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };
  

  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text style={styles.emptyDateText}>No tasks for this date</Text>
      </View>
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
        markedDates={markedDates}
        theme={theme}
        loadItemsForMonth={loadTasks}
        selected={timeToString(Date.now())}
        renderItem={renderItem}
        renderEmptyData={renderEmptyDate}
        renderDay={(day, item) => {
          return <View/>;
        }}
        onDayPress={(date) => {
          setSelectedDate(date.dateString);
          const selectedMonth = new Date(date.year, date.month - 1).toLocaleString('default', { month: 'long' });
          setSubtitle(selectedMonth);
        }}
        showOnlySelectedDayItems
      />
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.addButton} onPress={navigateToAddTaskScreen}>
          <Text style={styles.addButtonLabel}>Add Task</Text>
        </TouchableOpacity>
      </View>
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
  bottomContainer: {
    backgroundColor: "#F2F4F4",
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
    margin: 20, // Adjust the margin top value as needed
    alignSelf: 'center', // Align the button to the center horizontally
  },
  addButtonLabel: {
    color: '#ffffff',
    fontSize: 16,
    marginHorizontal: 15,
    marginVertical: 3,
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
    fontSize: 18,
  },
  cardTextDescription: {
    marginBottom: 8,
    color: '#9DA3B0',
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
  deleteButton: {
    color: 'red',
    fontSize: 16,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyDateText: {
    fontSize: 16,
    color: 'gray',
  },
  card: {
    backgroundColor: '#F9FAFD',
    borderRadius: 15,
    elevation: 2,
    marginBottom: 20,
  },
});


export default CalendarScreen;
