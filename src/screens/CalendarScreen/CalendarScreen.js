import React, { useState, useEffect } from 'react';
import { Text, Modal, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Agenda } from 'react-native-calendars';
import { firestore, auth } from '../../../firebase.js';
import {
  query,
  where,
  collection,
  deleteDoc,
  updateDoc,
  getDoc,
  doc,
  onSnapshot,
} from 'firebase/firestore';
import Tag from './TagColors';

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
  const [subtitle, setSubtitle] = useState('');
  const [selectedDate, setSelectedDate] = useState(timeToString(Date.now()));
  const [markedDates, setMarkedDates] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const db = firestore;
  const user = auth.currentUser;

  const openModal = (task, taskId) => {
    setIsModalVisible(true);
    setSelectedTask(task);
    setSelectedTaskId(taskId);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const formattedItems = {};
        const formattedMarkedDates = {};
  
        snapshot.forEach((doc) => {
          const task = doc.data();
          const strTime = timeToString(task.time);
  
          if (!formattedItems[strTime]) {
            formattedItems[strTime] = [];
            formattedMarkedDates[strTime] = {
              marked: true,
              dotColor: '#478C5C',
            };
          }
  
          formattedItems[strTime].push({
            id: doc.id,
            name: task.name,
            description: task.description,
            startTime: task.startTime,
            endTime: task.endTime,
            time: task.time,
            tags: task.tags || [],
            completed: task.completed,
          });
        });
  
        // Sort the tasks by start time in ascending order
        const sortedItems = {};
        Object.keys(formattedItems).forEach((date) => {
          sortedItems[date] = formattedItems[date].sort(
            (a, b) => a.startTime.seconds - b.startTime.seconds
          );
        });
  
        setItems(sortedItems); // Update the state with the sorted items
        setMarkedDates(formattedMarkedDates); // Update the state with the formatted marked dates
      });
  
      return unsubscribe; // Return the unsubscribe function to clean up the subscription
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };    

  const navigateToAddTaskScreen = () => {
    navigation.navigate('AddTask', { date: selectedDate });
  };

  const navigateToEditTaskScreen = () => {
    navigation.navigate('EditTask', { task: selectedTask });
    closeModal();
  };

  const handleDelete = async () => {
    try {
      const taskRef = doc(db, 'tasks', selectedTaskId); // Use the correct document ID
      await deleteDoc(taskRef);
      closeModal();
      loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleComplete = async () => {
    try {
      const taskRef = doc(db, 'tasks', selectedTaskId);
      const taskDoc = await getDoc(taskRef);
      if (taskDoc.exists()) {
        const currentCompleted = taskDoc.data().completed || false;
        await updateDoc(taskRef, {
          completed: !currentCompleted,
        });
        setSelectedTask((prevTask) => ({
          ...prevTask,
          completed: !prevTask.completed,
        }));
      }
      closeModal();
      setItems(loadTasks());
    } catch (error) {
      console.error('Error toggling completed status:', error);
    }
  };
  
  const renderItem = (item) => {
    const startTime = new Date(item.startTime.seconds * 1000); // Convert timestamp to Date object
    const endTime = new Date(item.endTime.seconds * 1000);

    const startTimeString = startTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const endTimeString = endTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    const textDecoration = item.completed ? 'line-through' : 'none';

    return (
      <TouchableOpacity
        style={{ marginLeft: 20, marginRight: 20, marginTop: 20 }}
        onPress={() => openModal(item, item.id)}
      >
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardTextContainer}>
              <Text style={[styles.cardText, { textDecorationLine: textDecoration }]}>{item.name}</Text>
              <Text style={styles.cardTextDescription}>{item.description.toString()}</Text>
              <Text style={styles.cardTextDescription}>{startTimeString} - {endTimeString}</Text>
              <View style={{ flexDirection: 'row', marginTop: 8 }}>
                {item.tags.map((tag, index) => (
                  <Tag key={index} text={tag} />
                ))}
              </View>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Ionicons name="calendar" size={40} color="#478C5C" />
        <Text style={styles.emptyDateText}>No tasks for this date</Text>
      </View>
    );
  };

  const rowHasChanged = (r1, r2) => {
    return (
      r1.name !== r2.name ||
      r1.description !== r2.description ||
      r1.startTime !== r2.startTime ||
      r1.endTime !== r2.endTime
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
        rowHasChanged={rowHasChanged}
        renderDay={(day, item) => {
          return <View/>;
        }}
        onDayPress={(date) => {
          const selectedDateString = date.dateString;
          setSelectedDate(selectedDateString);
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
      <Modal visible={isModalVisible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalTitleWithCancel}>
              <Text style={styles.selectedTaskTitle}>{selectedTask ? selectedTask.name : ''}</Text>
              <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.modalOption, styles.editButton]} onPress={navigateToEditTaskScreen}>
                <View style={styles.buttonContent}>
                  <Feather name="edit" size={24} color="white" />
                  <Text style={styles.buttonText}>Edit</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalOption, styles.deleteButton]} onPress={handleDelete}>
                <View style={styles.buttonContent}>
                  <MaterialIcons name="delete-outline" size={24} color="white" />
                  <Text style={styles.buttonText}>Delete</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalOption, styles.completeButton]} onPress={handleComplete}>
                <View style={styles.buttonContent}>
                  <Ionicons name="checkbox-outline" size={24} color="white" />
                  <Text style={styles.buttonText}>Complete</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontFamily: 'popRegular',
  },
  subtitleText: {
    fontSize: 16,
    marginLeft: 8,
    color: 'gray',
    fontFamily: 'popRegular',
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
    fontSize: 16,
    fontFamily: 'popRegular',
  },
  cardTextDescription: {
    marginBottom: 8,
    color: '#9DA3B0',
    fontFamily: 'popRegular',
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
    fontFamily: 'popRegular',
  },
  card: {
    backgroundColor: '#F9FAFD',
    borderRadius: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 27,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 40, 
    paddingHorizontal: 20,
    paddingVertical: 30,
    width: '90%',
  },
  modalOption: {
    borderBottomWidth: 1,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 10,
  },
  modalTitleWithCancel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 15,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  editButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#99C3EC',
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#F69C9E',
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#97E3C2', 
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'popRegular',
  },
  selectedTaskTitle: {
    fontSize: 15,
    fontFamily: 'popRegular',
  }
});


export default CalendarScreen;
