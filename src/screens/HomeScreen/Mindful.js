import { Audio } from 'expo-av';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Slider from '@react-native-community/slider';
import { Entypo, AntDesign, SimpleLineIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const MeditationScreen = () => {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(10);
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
    const loadAudio = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('./Audio/rain.mp3')
      );
      setSound(sound);
    };

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
  if (isPlaying && sound) {
    if (isMuted) {
      sound.setVolumeAsync(1.0);
    } else {
      sound.setVolumeAsync(0.0);
    }
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <Image source={require('./Images/rainforest.png')} style={styles.image} />
        <TouchableOpacity style={styles.button} onPress={toggleDuration}>
          <Text style={styles.buttonText}>
            {selectedDuration === 10 ? 'Switch to 20 mins' : 'Switch to 10 mins'}
          </Text>
        </TouchableOpacity>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} onPress={resetTimer}>
            <AntDesign name="reload1" size={24} color="#478C5C" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonPlay} onPress={isRunning ? pauseTimer : startTimer}>
            {isRunning ? (
              <View style={styles.buttonContent}>
                <MaterialCommunityIcons name="pause" size={24} color="white" />
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <Entypo name="controller-play" size={24} color="white" />
              </View>
            )}
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.button} onPress={toggleMute}>
            {isMuted ? (
              <SimpleLineIcons name="volume-off" size={24} color="#478C5C" />
            ) : (
              <SimpleLineIcons name="volume-2" size={24} color="#478C5C" />
            )}
          </TouchableOpacity> */}
        </View>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={selectedDuration * 60}
          value={timer}
          minimumTrackTintColor="#478C5C"
          maximumTrackTintColor="lightgrey"
          thumbTintColor="transparent"
          disabled={true}
        />
        <View style={styles.startEnd}>
          <View style={{ flex: 1, alignItems: 'flex-start', marginLeft: 27 }}>
            <Text style={styles.timerText}>{formatTime(timer)}</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 27 }}>
            <Text style={styles.timerText}>{formatTime(selectedDuration * 60)}</Text>
          </View>
        </View>
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
    backgroundColor: '#F6FFDE',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  progress: {
    marginBottom: 20,
  },
  image: {
    width: 260,
    height: 260,
    margin: 10,
  },
  timerText: {
    fontSize: 16,
    fontFamily: 'popRegular',
    color: '#478C5C',
    margin: 5,
  },
  button: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    margin: 5,
    borderColor: '#478C5C',
    borderWidth: 1,
  },
  buttonPlay: {
    padding: 10,
    backgroundColor: '#478C5C',
    borderRadius: 5,
    margin: 5,
    borderColor: '#478C5C',
    borderWidth: 1,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#478C5C',
    fontWeight: 'bold',
    marginRight: 5,
    fontFamily: 'popSemiBold',
  },
  startEnd: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  audioButton: {
    padding: 10,
    backgroundColor: '#478C5C',
    borderRadius: 5,
    width: 130,
  },
  instructionsContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
  },
  instructions: {
    fontSize: 18,
    fontFamily: 'popSemiBold',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
    fontFamily: 'popRegular',
  },
  slider: {
    width: 350,
    height: 40,
  },
  buttons: {
    flexDirection: 'row',
    margin: 5,
  },
});

export default MeditationScreen;
