import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import TimePicker from 'react-native-modal-datetime-picker';
import { updateDoc, doc, Timestamp } from 'firebase/firestore';
import { firestore } from '../../../firebase.js';

const EditTaskScreen = ({ route, navigation }) => {
  const { task } = route.params;

  const [taskName, setTaskName] = useState(task.name);
  const [taskDescription, setTaskDescription] = useState(task.description);
  const [startTime, setStartTime] = useState(task.startTime);
  const [endTime, setEndTime] = useState(task.endTime);
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState(task.tags || []);
  const [customTag, setCustomTag] = useState('');
  const availableTags = [
    { name: 'School', color: '#ECEAFF', selectedColor: '#8F81FE', textColor: '#8F81FE', selectedTextColor: '#FFFFFF' },
    { name: 'Home', color: '#FFEFEB', selectedColor: '#F0A58E', textColor: '#F0A58E', selectedTextColor: '#FFFFFF' },
    { name: 'Personal', color: '#D1FEFF', selectedColor: '#1EC1C3', textColor: '#1EC1C3', selectedTextColor: '#FFFFFF' },
    { name: 'Urgent', color: '#FFE9ED', selectedColor: '#F57C96', textColor: '#F57C96', selectedTextColor: '#FFFFFF' },
  ];

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

      const db = firestore;
      await updateDoc(doc(db, 'tasks', task.id), updatedTask);

      navigation.goBack();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const formatTime = (time) => {
    if (!time) return '';
    if (time instanceof Timestamp) {
      const convertedTime = time.toDate(); // Convert Firebase Timestamp to Date
      return convertedTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } else {
      return time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }
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
    return isTagSelected(tag) ? '#FFFFFF' : availableTags.find((t) => t.name === tag).textColor;
  };

  const getTagBackgroundColor = (tag) => {
    const selectedTag = availableTags.find((t) => t.name === tag);
    if (selectedTag) {
      return isTagSelected(tag) ? selectedTag.selectedColor : selectedTag.color;
    } else {
      return '#779ECB';
    }
  };
  

  const handleAddCustomTag = () => {
    if (customTag.trim() !== '') {
      toggleTag(customTag);
      setCustomTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setSelectedTags(selectedTags.filter((selectedTag) => selectedTag !== tag));
  };

  const showStartTimePicker = () => {
    setStartTimePickerVisible(true);
  };

  const hideStartTimePicker = () => {
    setStartTimePickerVisible(false);
  };

  const handleStartTimeConfirm = (time) => {
    setStartTime(time);
    hideStartTimePicker();
  };

  const showEndTimePicker = () => {
    setEndTimePickerVisible(true);
  };

  const hideEndTimePicker = () => {
    setEndTimePickerVisible(false);
  };

  const handleEndTimeConfirm = (time) => {
    setEndTime(time);
    hideEndTimePicker();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Task Name *</Text>
      <TextInput
        style={styles.input}
        value={taskName}
        placeholderTextColor="#777"
        onChangeText={setTaskName}
        placeholder="Update task name"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={taskDescription}
        placeholderTextColor="#777"
        onChangeText={setTaskDescription}
        placeholder="Update task description"
      />

      {/* Display the selected task time */}
      <View style={styles.timeContainer}>
        <View style={styles.timeInputContainer}>
          <Text style={styles.label}>Start Time *</Text>
          <TouchableOpacity style={styles.input} onPress={showStartTimePicker}>
            <Text style={[styles.timeText, startTime && styles.selectedTimeText]}>
              {startTime ? formatTime(startTime) : 'Select Start Time'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timeInputContainer}>
          <Text style={styles.label}>End Time *</Text>
          <TouchableOpacity style={styles.input} onPress={showEndTimePicker}>
            <Text style={[styles.timeText, endTime && styles.selectedTimeText]}>
              {endTime ? formatTime(endTime) : 'Select End Time'}
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

      {/* Tags */}
      <View style={styles.tagContainer}>
        <Text style={styles.label}>Tags:</Text>
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
            placeholderTextColor="#777"
            onChangeText={setCustomTag}
            placeholder="Enter custom tag"
          />
          <TouchableOpacity
            style={[
              styles.customTagButton,
              { backgroundColor: customTag.trim() !== '' ? '#478C5C' : '#CCCCCC' },
            ]}
            onPress={handleAddCustomTag}
          >
            <Text style={[styles.tagButtonText, { color: '#FFFFFF' }]}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Update Task Button */}
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
    fontFamily: 'popSemiBold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontFamily: 'popRegular',
  },
  button: {
    backgroundColor: '#478C5C',
    paddingVertical: 20,
    borderRadius: 15,
    marginTop: 'auto',
    marginBottom: 100,
    marginLeft: 40,
    marginRight: 40,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'popBold',
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
  },
  selectedTimeText: {
    fontWeight: 'normal',
    fontFamily: 'popRegular',
  },
  tagButton: {
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 20,
    margin: 4,
  },
  tagButtonText: {
    fontFamily: 'popRegular',
    fontSize: 13,
  },
  tagContainer: {
    marginBottom: 16,
  },
  tagButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 18,
    paddingVertical: 8,
    margin: 4,
    justifyContent: 'center',
  },
  customTagInput: {
    height: 40,
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 8,
    paddingHorizontal: 10,
    fontFamily: 'popRegular',
  },
  customTagButton: {
    backgroundColor: '#CCCCCC',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 20,
    margin: 4,
  }
});

export default EditTaskScreen;
