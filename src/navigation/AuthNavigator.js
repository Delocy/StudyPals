import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';
import RegisterScreen from '../screens/RegisterScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import AddTaskScreen from '../screens/CalendarScreen/AddTaskScreen';
import EmojiPickerScreen from '../screens/ShareYourWorriesScreen/EmojiPickerScreen';
import MoodDetailsScreen from '../screens/ShareYourWorriesScreen/MoodDetailsScreen';
import DiaryEntriesScreen from '../screens/ShareYourWorriesScreen/DiaryEntriesScreen';
import EditTaskScreen from '../screens/CalendarScreen/EditTaskScreen';
import MeditationScreen from '../screens/HomeScreen/Mindful';
import TimerAnalyticsScreen from '../screens/HomeScreen/TimerAnalyticsScreen';

function AuthNavigator() {
    const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='SplashScreen'>
        <Stack.Screen name='SplashScreen' options={{ headerShown: false }} component={SplashScreen}/>
        <Stack.Screen name='Login' options={{ headerShown: false }} component={LoginScreen} />
        <Stack.Screen name='Register' options={{ headerShown: false }} component={RegisterScreen} />
        <Stack.Screen name='Home' options={{ headerShown: false }} component={TabNavigator} />
        <Stack.Screen name='ResetPassword' options={{ headerShown: false }} component={ResetPasswordScreen} />
        <Stack.Screen name="AddTask" component={AddTaskScreen} />
        <Stack.Screen name="EmojiPicker" component={EmojiPickerScreen} />
        <Stack.Screen name="MoodDetails" component={MoodDetailsScreen} />
        <Stack.Screen name="DiaryEntries" component={DiaryEntriesScreen} />
        <Stack.Screen name="EditTask" component={EditTaskScreen} /> 
        <Stack.Screen name="MeditationScreen" component={MeditationScreen} /> 
        <Stack.Screen name="Timer Analytics" component={TimerAnalyticsScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AuthNavigator;