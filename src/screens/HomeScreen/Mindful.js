import { Audio } from 'expo-av';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CircularProgress } from 'react-native-circular-progress';

const MeditationScreen = () => {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(10); // Default duration is 10 minutes
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    async function loadAudio() {
      const { sound } = await Audio.Sound.createAsync(
        require('./Audio/rain.mp3')
      );
      setSound(sound);
    }

    loadAudio();

    return () => {
      if (sound) {
        sound.stopAsync();
        sound.unloadAsync();
      }
    };
  }, []);

  const startTimer = () => {
    setIsRunning(true);
    playAudio();
  };

  const pauseTimer = () => {
    setIsRunning(false);
    pauseAudio();
  };

  const resetTimer = () => {
    setTimer(0);
    setIsRunning(false);
    stopAudio();
  };

  const toggleDuration = () => {
    setSelectedDuration((prevDuration) => (prevDuration === 10 ? 20 : 10));
    resetTimer();
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progress = (timer / (selectedDuration * 60)) * 100;

  const playAudio = async () => {
    if (sound && !isMuted) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const pauseAudio = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    setIsMuted((prevMuted) => !prevMuted);
    if (isPlaying) {
      if (isMuted) {
        playAudio();
      } else {
        pauseAudio();
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <CircularProgress
          size={180}
          width={15}
          fill={progress}
          tintColor="#478C5C"
          backgroundColor="#EFEFEF"
          rotation={0}
          lineCap="round"
          style={styles.progress}
        >
          {() => (
            <Text style={styles.timerText}>{formatTime(timer)}</Text>
          )}
        </CircularProgress>
      </View>
      <TouchableOpacity style={styles.button} onPress={isRunning ? pauseTimer : startTimer}>
        <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Start'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={resetTimer}>
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={toggleDuration}>
        <Text style={styles.buttonText}>
          {selectedDuration === 10 ? 'Switch to 20 mins' : 'Switch to 10 mins'}
        </Text>
      </TouchableOpacity>
      <View style={styles.audioButtonContainer}>
        <TouchableOpacity style={styles.audioButton} onPress={toggleMute}>
          <Text style={styles.buttonText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructions}>Instructions:</Text>
        <Text style={styles.instructionText}>Find a quiet and comfortable space</Text>
        <Text style={styles.instructionText}>Assume a relaxed and upright posture</Text>
        <Text style={styles.instructionText}>Focus on your breath</Text>
        <Text style={styles.instructionText}>Cultivate non-judgmental awareness</Text>
        <Text style={styles.instructionText}>Practice gentle acceptance</Text>
        <Text style={styles.instructionText}>Stay present and mindful</Text>
        <Text style={styles.instructionText}>End the meditation gradually</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  progress: {
    marginBottom: 10,
  },
  timerText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  button: {
    padding: 10,
    backgroundColor: '#478C5C',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    
  },
  audioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  audioButton: {
    padding: 10,
    backgroundColor: '#478C5C',
    borderRadius: 5,
    width: 130,
  },
  instructionsContainer: {
    alignItems: 'center',
  },
  instructions: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },
});

export default MeditationScreen;
