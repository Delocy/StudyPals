import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import TimePicker from 'react-native-modal-datetime-picker';
import { collection, addDoc } from "firebase/firestore";
import { firestore, auth } from '../../../firebase.js';

const AddTaskScreen = ({ route, navigation }) => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStartTime, setTaskStartTime] = useState(null);
  const [taskEndTime, setTaskEndTime] = useState(null);
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTag, setCustomTag] = useState('');
  const availableTags = [
    { name: 'School', color: '#ECEAFF', selectedColor: '#8F81FE', textColor: '#8F81FE', selectedTextColor: '#FFFFFF' },
    { name: 'Home', color: '#FFEFEB', selectedColor: '#F0A58E', textColor: '#F0A58E', selectedTextColor: '#FFFFFF' },
    { name: 'Personal', color: '#D1FEFF', selectedColor: '#1EC1C3', textColor: '#1EC1C3', selectedTextColor: '#FFFFFF' },
    { name: 'Urgent', color: '#FFE9ED', selectedColor: '#F57C96', textColor: '#F57C96', selectedTextColor: '#FFFFFF' },
  ];

  const formatTime = (time) => {
    if (!time) return '';
    return time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const handleCreateTask = async () => {
    // Perform form validation
    if (
      !taskName ||
      !taskStartTime ||
      !taskEndTime
    ) {
      // If any required fields are empty, display an error message or handle the validation error
      alert('Please fill all required fields');
      return;
    }
    try {
      const user = auth.currentUser;
      if (user) {
        const db = firestore;
        const task = {
          name: taskName,
          description: taskDescription,
          startTime: taskStartTime,
          endTime: taskEndTime,
          time: route.params.date,
          tags: selectedTags.concat(customTag), // Add the custom tag to the selected tags
          // Add more properties as needed
          userId: user.uid, // Include the user's ID
          completed: false,
        };
  
        await addDoc(collection(db, 'tasks'), task);
        console.log('Task added successfully!');
        navigation.goBack();
      } else {
        // User is not logged in, handle the error or redirect to the login screen
        console.log('User not logged in');
      }
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
  
  const isTagSelected = (tag) => {
    return selectedTags.includes(tag);
  };

  const getTagTextColor = (tag) => {
    if (isTagSelected(tag)) {
      return '#FFFFFF';
    } else if (availableTags.some((t) => t.name === tag)) {
      return availableTags.find((t) => t.name === tag).textColor;
    } else {
      return '#000000';
    }
  };
  
  const getTagBackgroundColor = (tag) => {
    if (isTagSelected(tag)) {
      return availableTags.some((t) => t.name === tag)
        ? availableTags.find((t) => t.name === tag).selectedColor
        : '#779ECB';
    } else {
      return availableTags.some((t) => t.name === tag)
        ? availableTags.find((t) => t.name === tag).color
        : '#CCCCCC';
    }
  };

  const handleRemoveTag = (tag) => {
    setSelectedTags(selectedTags.filter((selectedTag) => selectedTag !== tag));
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Task Name *</Text>
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
      />
      {/* Display the selected task time */}
      <View style={styles.timeContainer}>
        <View style={styles.timeInputContainer}>
          <Text style={[styles.label]}>Start Time *</Text>
          <TouchableOpacity style={styles.input} onPress={showStartTimePicker}>
            <Text style={[styles.timeText, taskStartTime && styles.selectedTimeText]}>
              {taskStartTime ? formatTime(taskStartTime) : 'Select'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timeInputContainer}>
          <Text style={[styles.label]}>End Time *</Text>
          <TouchableOpacity style={styles.input} onPress={showEndTimePicker}>
            <Text style={[styles.timeText, taskEndTime && styles.selectedTimeText]}>
              {taskEndTime ? formatTime(taskEndTime) : 'Select'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Time picker component */}
      <TimePicker
        isVisible={isStartTimePickerVisible}
        mode="time"
        minuteInterval={5}
        onConfirm={handleStartTimeConfirm}
        onCancel={hideStartTimePicker}
      />

      <TimePicker
        isVisible={isEndTimePickerVisible}
        mode="time"
        minuteInterval={5}
        onConfirm={handleEndTimeConfirm}
        onCancel={hideEndTimePicker}
      />

      <View style={styles.tagContainer}>
        <Text style={styles.label}>Tags *</Text>
        <View style={styles.tagButtonContainer}>
          {availableTags.map((tag) => (
            <TouchableOpacity
              key={tag.name}
              style={[
                styles.tagButton,
                isTagSelected(tag.name) ? styles.selectedTagButton : null,
                { backgroundColor: getTagBackgroundColor(tag.name) },
              ]}
              onPress={() => toggleTag(tag.name)}
            >
              <Text style={[styles.tagButtonText, { color: getTagTextColor(tag.name) }]}>{tag.name}</Text>
            </TouchableOpacity>
          ))}
          {/* Custom Tag Input */}
          {selectedTags
          .filter((tag) => !availableTags.some((availableTag) => availableTag.name === tag))
          .map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[
                styles.tagButton,
                isTagSelected(tag) ? styles.selectedTagButton : null,
                { backgroundColor: getTagBackgroundColor(tag) },
              ]}
              onPress={() => handleRemoveTag(tag)}
            >
              <Text style={[styles.tagButtonText, { color: getTagTextColor(tag) }]}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.tagButtonContainer}>
            <TextInput
            style={styles.customTagInput}
            value={customTag}
            onChangeText={setCustomTag}
            placeholder="Enter custom tag"
          />
          <TouchableOpacity
            style={[
              styles.tagButton,
              { backgroundColor: '#CCCCCC' },
              customTag ? styles.selectedTagButton : null,
            ]}
            onPress={() => {
              if (customTag) {
                toggleTag(customTag);
                setCustomTag('');
              }
            }}
          >
            <Text style={[styles.tagButtonText, { color: '#FFFFFF' }]}>Add</Text>
          </TouchableOpacity>
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
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'popSemiBold',
  },
  input: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    fontFamily: 'popRegular',
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
  timeText: {
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'popRegular',
  },
  selectedTimeText: {
    fontWeight: 'normal',
  },
  tagButton: {
    backgroundColor: '#CCCCCC',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 20,
    margin: 4,
  },
  selectedTagButton: {
    backgroundColor: '#478C5C',
  },
  tagButtonText: {
    color: '#FFFFFF',
    fontFamily: 'popRegular',
    fontSize: 13,
  },  
});

export default AddTaskScreen;
