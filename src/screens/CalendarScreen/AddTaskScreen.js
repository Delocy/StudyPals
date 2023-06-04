import React, { useState } from 'react';
import Tag from './TagColors';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import TimePicker from 'react-native-modal-datetime-picker';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore,collection, addDoc } from "firebase/firestore";
//import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAae5wIuRN8tuqvKTbwJJDWOCDFutgF2M0",
  authDomain: "studypals-auth.firebaseapp.com",
  projectId: "studypals-auth",
  storageBucket: "studypals-auth.appspot.com",
  messagingSenderId: "848602608150",
  appId: "1:848602608150:web:214341bebeac9aea74fb37",
  measurementId: "G-C13G3L9F88"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const AddTaskScreen = ({ route, navigation }) => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStartTime, setTaskStartTime] = useState(null);
  const [taskEndTime, setTaskEndTime] = useState(null);
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const availableTags = ['Office', 'Home', 'Personal', 'Urgent'];


  const formatTime = (time) => {
    if (!time) return '';
    return time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const handleCreateTask = async () => {
    // Perform form validation
    if (!taskName || !taskDescription || !taskStartTime || !taskEndTime || selectedTags.length === 0) {
      // If any required fields are empty, display an error message or handle the validation error
      // For example, you can show an alert or set an error state variable
      alert('Please fill all required fields');
      return;
    }
    
    const db = getFirestore();
    const task = {
      name: taskName,
      description: taskDescription,
      startTime: taskStartTime,
      endTime: taskEndTime,
      time: route.params.date,
      tags: selectedTags,
      // Add more properties as needed
    };
  
    try {
      await addDoc(collection(db, 'tasks'), task);
      console.log('Task added successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding task: ', error);
    }
  };

  const showStartTimePicker = () => {
    setStartTimePickerVisible(true);
  };

  const hideStartTimePicker = () => {
    setStartTimePickerVisible(false);
  };

  const handleStartTimeConfirm = (time) => {
    setTaskStartTime(time);
    hideStartTimePicker();
  };

  const showEndTimePicker = () => {
    setEndTimePickerVisible(true);
  };

  const hideEndTimePicker = () => {
    setEndTimePickerVisible(false);
  };

  const handleEndTimeConfirm = (time) => {
    setTaskEndTime(time);
    hideEndTimePicker();
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((selectedTag) => selectedTag !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };  
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Task Name:</Text>
      <TextInput
        style={styles.input}
        value={taskName}
        onChangeText={setTaskName}
        placeholder="Enter task name"
      />
      <Text style={styles.label}>Task Description:</Text>
      <TextInput
        style={styles.input}
        value={taskDescription}
        onChangeText={setTaskDescription}
        placeholder="Enter task description"
      />
      <Text style={styles.label}>Time:</Text>
      {/* Display the selected task time */}
      <View style={styles.timeContainer}>
        <View style={styles.timeInputContainer}>
          <Text style={[styles.label, styles.timeLabel]}>Start Time:</Text>
          <TouchableOpacity style={styles.input} onPress={showStartTimePicker}>
            <Text style={[styles.timeText, taskStartTime && styles.selectedTimeText]}>
              {taskStartTime ? formatTime(taskStartTime) : 'Select Start Time'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timeInputContainer}>
          <Text style={[styles.label, styles.timeLabel]}>End Time:</Text>
          <TouchableOpacity style={styles.input} onPress={showEndTimePicker}>
            <Text style={[styles.timeText, taskEndTime && styles.selectedTimeText]}>
              {taskEndTime ? formatTime(taskEndTime) : 'Select End Time'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>


      {/* Time picker component */}
      <TimePicker
        isVisible={isStartTimePickerVisible}
        mode="time"
        onConfirm={handleStartTimeConfirm}
        onCancel={hideStartTimePicker}
      />

      <TimePicker
        isVisible={isEndTimePickerVisible}
        mode="time"
        onConfirm={handleEndTimeConfirm}
        onCancel={hideEndTimePicker}
      />

      <View style={styles.tagContainer}>
        <Text style={styles.label}>Tags:</Text>
        <View style={styles.tagButtonContainer}>
          {availableTags.map((tag) => (
            <Tag
              key={tag}
              text={tag}
              selected={selectedTags.includes(tag)}
              onPress={() => toggleTag(tag)}
            />
          ))}
        </View>
      </View>
      
      <TouchableOpacity style={styles.addButton} onPress={handleCreateTask}>
        <Text style={styles.addButtonLabel}>Create Task</Text>
      </TouchableOpacity>
    </View>
  );
}  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 25,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  tagContainer: {
    marginBottom: 16,
  },
  tagButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: '#478C5C',
    paddingVertical: 20,
    borderRadius: 15,
    marginTop: 'auto',
    marginBottom: 100,
    marginLeft: 40,
    marginRight: 40,
  },
  addButtonLabel: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeInputContainer: {
    flex: 1,
    marginRight: 8,
  },
  timeLabel: {
    marginRight: 8,
  },
  timeText: {
    textAlign: 'center',
    marginTop: 10,
  },
  selectedTimeText: {
    fontWeight: 'normal',
  },
});

export default AddTaskScreen;
