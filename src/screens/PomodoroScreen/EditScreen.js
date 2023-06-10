import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import Slider from "react-native-slider";

const EditScreen = ({ onSave, onCancel, workDuration, shortBreakDuration, numFocusSessions }) => {
  const [editedWorkDuration, setEditedWorkDuration] = useState(workDuration);
  const [editedShortBreakDuration, setEditedShortBreakDuration] = useState(shortBreakDuration);
  const [editedNumFocusSessions, setEditedNumFocusSessions] = useState(numFocusSessions);

  const handleSave = () => {
    onSave({
      workDuration: editedWorkDuration,
      shortBreakDuration: editedShortBreakDuration,
      numFocusSessions: editedNumFocusSessions,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>
          Work Duration: {editedWorkDuration}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={60}
          step={1}
          value={editedWorkDuration}
          onValueChange={setEditedWorkDuration}
          minimumTrackTintColor="#013A20"
          maximumTrackTintColor="rgba(1, 58, 32, 0.37)"
          thumbTintColor="#013A20"
        />
        <View style={styles.sliderLabelContainer}>
            <Text style={styles.sliderLabel}>1 min</Text>
            <Text style={styles.sliderLabel}>60 min</Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>
          Short Break Duration: {editedShortBreakDuration}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={15}
          step={1}
          value={editedShortBreakDuration}
          onValueChange={setEditedShortBreakDuration}
          minimumTrackTintColor="#013A20"
          maximumTrackTintColor="rgba(1, 58, 32, 0.37)"
          thumbTintColor="#013A20"
        />
        <View style={styles.sliderLabelContainer}>
            <Text style={styles.sliderLabel}>1 min</Text>
            <Text style={styles.sliderLabel}>15 min</Text>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>
          Focus Sessions: {editedNumFocusSessions}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={15}
          step={1}
          value={editedNumFocusSessions}
          onValueChange={setEditedNumFocusSessions}
          minimumTrackTintColor="#013A20"
          maximumTrackTintColor="rgba(1, 58, 32, 0.37)"
          thumbTintColor="#013A20"
        />
        <View style={styles.sliderLabelContainer}>
            <Text style={styles.sliderLabel}>1</Text>
            <Text style={styles.sliderLabel}>15</Text>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <Button style={styles.button} title="Cancel" onPress={onCancel} color="#C0392B" />
        <Button style={styles.button} title="Apply" onPress={handleSave} color="#27AE60" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  row: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    fontFamily: 'popRegular',
    marginBottom: 8,
    color: "#000",
  },
  slider: {
    color: '#013A20',
    width: 300,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  button: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#27AE60",
    elevation: 2,
  },
  sliderLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sliderLabel: {
    fontSize: 15,
    color: "#000",
    fontFamily: 'popRegular'
  },
});

export default EditScreen;