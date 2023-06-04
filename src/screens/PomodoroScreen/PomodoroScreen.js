import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import EditScreen from "./EditScreen";
import Header from "../../components/Header";

const INITIAL_WORK_DURATION = 25; // in minutes
const INITIAL_SHORT_BREAK_DURATION = 5; // in minutes
const INITIAL_NUM_SESSIONS = 4;
const INITIAL_TIME_IN_SECONDS = INITIAL_WORK_DURATION * 60;

const PomodoroScreen = () => {
  const [count, setCount] = useState(INITIAL_TIME_IN_SECONDS);
  const [active, setActive] = useState(false);
  const [workDuration, setWorkDuration] = useState(INITIAL_WORK_DURATION);
  const [shortBreakDuration, setShortBreakDuration] = useState(INITIAL_SHORT_BREAK_DURATION);
  const [numFocusSessions, setNumFocusSessions] = useState(INITIAL_NUM_SESSIONS);
  const [modifiedNumFocusSessions, setModifiedNumFocusSessions] = useState(INITIAL_NUM_SESSIONS);
  const [breakTime, setBreakTime] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [tintColor, setTintColor] = useState("#F6FFDE"); // Add state for tint color

  const navigation = useNavigation();

  useEffect(() => {
    let interval = null;
  
    if (active && count > 0) {
      interval = setInterval(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
  
    if (count === 0) {
      clearInterval(interval);
  
      if (breakTime) {
        setBreakTime(false);
        setTintColor("#F6FFDE");
  
        if (numFocusSessions === 1) {
          setActive(false);
          setCount(workDuration * 60);
          setNumFocusSessions(modifiedNumFocusSessions); // Reset the number of sessions
        } else {
          setCount(workDuration * 60);
          setNumFocusSessions((prevNumSessions) => prevNumSessions - 1);
        }
      } else {
        setBreakTime(true);
        setTintColor("#fff");
        setCount(shortBreakDuration * 60);
      }
    }
  
    return () => clearInterval(interval);
  }, [active, count, breakTime, workDuration, shortBreakDuration, numFocusSessions, modifiedNumFocusSessions]);
  

  const handleStart = () => {
    setActive(true);
  };

  const handlePause = () => {
    setActive(false);
  };

  const handleReset = () => {
    setActive(false);
    setCount(workDuration * 60);
    setNumFocusSessions(modifiedNumFocusSessions);
    setBreakTime(false);
    setTintColor("#F6FFDE");
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSaveSettings = ({
    workDuration: newWorkDuration,
    shortBreakDuration: newShortBreakDuration,
    numFocusSessions: newNumFocusSessions,
  }) => {
    setEditMode(false);
    setWorkDuration(newWorkDuration);
    setShortBreakDuration(newShortBreakDuration);
    setModifiedNumFocusSessions(newNumFocusSessions);
    setCount(newWorkDuration * 60);
    setActive(false);
    setBreakTime(false);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const formatTime = (time) => {
    return String(time).padStart(2, "0");
  };

  if (editMode) {
    return (
      <EditScreen
        onSave={handleSaveSettings}
        onCancel={handleCancelEdit}
        workDuration={workDuration}
        shortBreakDuration={shortBreakDuration}
        numFocusSessions={numFocusSessions}
      />
    );
  }

  return (
    <View style={styles.container}>
      {active && breakTime && (
        <>
        <Header>It's Break Time!</Header>
        <Text style={styles.text}>Walk, breathe, rehydrate!</Text>
        </>
      )}

      <View style={styles.circle}>
        <AnimatedCircularProgress
          size={250}
          width={11}
          fill={(count * 100) / (workDuration * 60)}
          tintColor={tintColor}
        >
          {() => (
            <Text style={styles.timerText}>
              {formatTime(Math.floor(count / 60))}:{formatTime(count % 60)}
            </Text>
          )}
        </AnimatedCircularProgress>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Ionicons name="refresh-sharp" size={25} color="#fff" />
        </TouchableOpacity>

        {!active ? (
          <TouchableOpacity style={styles.button} onPress={handleStart}>
            <Ionicons name="play-sharp" size={25} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handlePause}>
            <Ionicons name="pause" size={25} color="#fff" />
          </TouchableOpacity>
        )}

        {!active && (
          <TouchableOpacity style={styles.button} onPress={handleEdit}>
            <Ionicons name="create-sharp" size={25} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#F6FFDE',
  },
  text: {
    marginTop: -16,
    marginBottom: 30,
    fontFamily: 'popRegular',
    color: '#000',
  },
  timerText: {
    fontSize: 65,
    fontFamily: 'popMedium',
    textAlign: "center",
    color: "#F6FFDE"
  },
  circle: {
    backgroundColor: '#478C5C',
    width: 300,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 150,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
  },
  button: {
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 40,
    borderRadius: 240,
    backgroundColor: "#478C5C",
    width: 50,
    height: 50,
  }
});

export default PomodoroScreen;