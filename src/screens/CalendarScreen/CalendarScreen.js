import React, { useState } from 'react';
import { Text, TextInput, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Card, Avatar } from 'react-native-paper';
import { useEffect } from 'react';
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

const CalendarScreen = ({ navigation }) => {
  const [items, setItems] = useState({});
  const [taskName, setTaskName] = useState('');
  const [subtitle, setSubtitle] = useState('');

  useEffect(() => {
    const db = getFirestore();
  
    const fetchTasks = async () => {
      try {
        //console.log('Fetching tasks...');
        const tasksSnapshot = await getDocs(collection(db, 'tasks'));
        const tasksData = tasksSnapshot.docs.map((doc) => doc.data());
        
        //console.log('Tasks data:', tasksData);
  
        // Convert the tasks data into the required format for the `items` state
        const newItems = {};
        tasksData.forEach((task) => {
          const selectedDay = timeToString(task.time);
          if (newItems[selectedDay]) {
            newItems[selectedDay].push(task);
          } else {
            newItems[selectedDay] = [task];
          }
        });
  
        //console.log('New items:', newItems);
  
        setItems(newItems);
      } catch (error) {
        //console.error('Error fetching tasks: ', error);
      }
    };
  
    fetchTasks();
  }, []);
  


  const loadItems = (day) => {
    setTimeout(() => {
      const selectedDay = timeToString(day.timestamp);
      const selectedItems = items[selectedDay] || [];
      const sortedItems = selectedItems.sort((a, b) => {
        return new Date(a.time) - new Date(b.time);
      });
      const newItems = {
        [selectedDay]: sortedItems,
      };
      setItems(newItems);
  
      const selectedDate = new Date(selectedDay);
      const month = selectedDate.toLocaleString('default', { month: 'long' });
      const year = selectedDate.getFullYear();
      const formattedSubtitle = `${month} ${year}`;
      setSubtitle(formattedSubtitle); // Add this line to update the subtitle state
    }, 1000);
  };

  const navigateToAddTaskScreen = () => {
    navigation.navigate('AddTask');
  };
  
  const renderItem = React.memo(({ item }) => {
    const deleteTask = () => {
      const selectedDay = timeToString(Date.now());
      const newItems = { ...items };
      const tasks = newItems[selectedDay];
      const updatedTasks = tasks.filter((task) => task.time !== item.time);
      newItems[selectedDay] = updatedTasks;
      setItems(newItems);
    };
  
    return (
      <Agenda.Item
        key={item.time}
        onPress={() => console.log('Item pressed:', item)}
        style={{ marginRight: 10, marginTop: 17 }}
      >
        <Card>
          <Card.Content>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text>{item.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Avatar.Text label="J" />
                <TouchableOpacity onPress={deleteTask}>
                  <Text style={{ color: 'red', marginLeft: 8 }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card.Content>
        </Card>
      </Agenda.Item>
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Task</Text>
        <Text style={styles.subtitleText}>{subtitle}</Text>
      </View>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        selected={timeToString(Date.now())}
        theme={theme}
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
});


export default CalendarScreen;
