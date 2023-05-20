import React from 'react';
import { useFonts } from 'expo-font';
import AuthNavigator from './src/navigation/AuthNavigator';

export default function App() {

  const [fontsLoaded] = useFonts({
    popRegular: require('./src/assets/fonts/Poppins-Regular.ttf'),
    popBold: require('./src/assets/fonts/Poppins-Bold.ttf'),
    popMedium: require('./src/assets/fonts/Poppins-Medium.ttf'),
    popSemiBold: require('./src/assets/fonts/Poppins-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    return null; // or a loading spinner or something else
  }

  return (
    <AuthNavigator/>
  );
}
