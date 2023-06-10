import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { auth } from '../../firebase';
import * as ExpoSplashScreen from 'expo-splash-screen';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    async function hideSplashScreen() {
      await ExpoSplashScreen.preventAutoHideAsync();
      auth.onAuthStateChanged(user => {
        setTimeout(() => {
            navigation.navigate(user ? "Home" : "Login");
        }, 1000);
        ExpoSplashScreen.hideAsync();
      });
    }
    hideSplashScreen();
  }, []);

  return (
    <View style={styles.container}>
        <Text style={styles.text}>StudyPals</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#478C5C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 45,
    fontFamily: 'popBold',
  },
});

export default SplashScreen;