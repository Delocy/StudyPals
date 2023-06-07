import React, { useState } from 'react';
import Tag from './TagColors';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import TimePicker from 'react-native-modal-datetime-picker';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore,collection, addDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
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
const auth = getAuth();

// const analytics = getAnalytics(app);

const EditTaskScreen = ({ route, navigation }) => {
  const { task } = route.params;

  const [taskName, setTaskName] = useState(task.name);
  const [taskDescription, setTaskDescription] = useState(task.description);
  const [startTime, setStartTime] = useState(task.startTime);
  const [endTime, setEndTime] = useState(task.endTime);
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState(task.tags || []);

  const handleUpdateTask = async () => {
    try {
      const updatedTask = {
        ...task,
        name: taskName,
        description: taskDescription,
        startTime: startTime,
        endTime: endTime,
        tags: selectedTags,
      };

      const db = getFirestore();
      await updateDoc(doc(db, 'tasks', task.id), updatedTask);

      navigation.goBack();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Function to handle tag selection
  const handleTagSelection = (tag) => {
    const isSelected = selectedTags.includes(tag);
    if (isSelected) {
      setSelectedTags(selectedTags.filter((selectedTag) => selectedTag !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Function to show the start time picker
  const showStartTimePicker = () => {
    setStartTimePickerVisible(true);
  };

  // Function to hide the start time picker
  const hideStartTimePicker = () => {
    setStartTimePickerVisible(false);
  };

  // Function to handle the selection of start time
  const handleStartTimeConfirm = (time) => {
    setStartTime(time);
    hideStartTimePicker();
  };

  // Function to show the end time picker
  const showEndTimePicker = () => {
    setEndTimePickerVisible(true);
  };

  // Function to hide the end time picker
  const hideEndTimePicker = () => {
    setEndTimePickerVisible(false);
  };

  // Function to handle the selection of end time
  const handleEndTimeConfirm = (time) => {
    setEndTime(time);
    hideEndTimePicker();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Task Name</Text>
      <TextInput
        style={styles.input}
        value={taskName}
        onChangeText={setTaskName}
        placeholder="Enter task name"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={taskDescription}
        onChangeText={setTaskDescription}
        placeholder="Enter task description"
        multiline
      />

      <Text style={styles.label}>Start Time</Text>
      <TouchableOpacity style={styles.input} onPress={showStartTimePicker}>
        <Text>{startTime ? startTime.toLocaleString() : 'Select start time'}</Text>
      </TouchableOpacity>
      <TimePicker
        isVisible={isStartTimePickerVisible}
        mode="datetime"
        onConfirm={handleStartTimeConfirm}
        onCancel={hideStartTimePicker}
      />

      <Text style={styles.label}>End Time</Text>
      <TouchableOpacity style={styles.input} onPress={showEndTimePicker}>
        <Text>{endTime ? endTime.toLocaleString() : 'Select end time'}</Text>
      </TouchableOpacity>
      <TimePicker
        isVisible={isEndTimePickerVisible}
        mode="datetime"
        onConfirm={handleEndTimeConfirm}
        onCancel={hideEndTimePicker}
      />

      <Text style={styles.label}>Tags</Text>
      <View style={styles.tagsContainer}>
        {Tag.map((tag) => (
          <TouchableOpacity
            key={tag.id}
            style={[
              styles.tag,
              selectedTags.includes(tag.id) ? { backgroundColor: tag.color } : null,
            ]}
            onPress={() => handleTagSelection(tag.id)}
          >
            <Text style={styles.tagText}>{tag.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleUpdateTask}>
        <Text style={styles.buttonText}>Update Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#478C5C',
    paddingVertical: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'gray',
    marginHorizontal: 5,
    marginVertical: 3,
  },
  tagText: {
    fontSize: 12,
  },
});

export default EditTaskScreen;
  
