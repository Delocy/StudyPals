import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Ionicons } from "@expo/vector-icons";

const INITIAL_TIME_IN_SECONDS = 25 * 60; // 25 minutes

const PomodoroScreen = () => {
  const [count, setCount] = useState(INITIAL_TIME_IN_SECONDS);
  const [active, setActive] = useState(false);

  const minutes = Math.floor(count / 60);
  const seconds = count % 60;
  const progress = (count * 100) / INITIAL_TIME_IN_SECONDS;

  useEffect(() => {
    let interval;

    if (active && count > 0) {
      interval = setInterval(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000);
    }

    if (count === 0) {
      clearInterval(interval);
      // Perform actions when the timer reaches zero (e.g., show notifications, etc.)
      // Replace the following console.log statement with your desired actions
      console.log("Pomodoro session has ended!");
    }

    return () => {
      clearInterval(interval);
    };
  }, [active, count]);

  const handleStart = () => {
    setActive(true);
  };

  const handlePause = () => {
    setActive(false);
  };

  const handleReset = () => {
    setCount(INITIAL_TIME_IN_SECONDS);
    setActive(false);
  };

  const handleEdit = () => {
    // Handle the edit action
  };

  const formatTime = (time) => {
    return String(time).padStart(2, "0");
  };

  return (
    <View style={styles.container}>
        <View style={styles.circle}>
          <AnimatedCircularProgress
            size={250}
            width={11}
            fill={progress}
            tintColor="#F6FFDE"
          >
            {() => (
              <Text style={styles.timerText}>
                {formatTime(minutes)}:{formatTime(seconds)}
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

          <TouchableOpacity style={styles.button} onPress={handleEdit}>
            <Ionicons name="create-sharp" size={25} color="#fff" />
          </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    fontSize: 60,
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
  button : {
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
