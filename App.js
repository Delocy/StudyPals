import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SplashScreen from './screens/SplashScreen';
import { useFonts } from 'expo-font';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    popRegular: require('./assets/fonts/Poppins-Regular.ttf'),
    popBold: require('./assets/fonts/Poppins-Bold.ttf'),
    popMedium: require('./assets/fonts/Poppins-Medium.ttf'),
    popSemiBold: require('./assets/fonts/Poppins-SemiBold.ttf'),
  });

  if (!fontsLoaded) {
    return null; // or a loading spinner or something else
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='SplashScreen'>
        <Stack.Screen name='SplashScreen' component={SplashScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
        <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
