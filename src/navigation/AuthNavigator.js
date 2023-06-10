import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';
import RegisterScreen from '../screens/RegisterScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import AddTaskScreen from '../screens/CalendarScreen/AddTaskScreen';
import EmojiPickerScreen from '../screens/ShareYourWorriesScreen/EmojiPickerScreen';
import MoodDetailsScreen from '../screens/ShareYourWorriesScreen/MoodDetailsScreen';
import DiaryEntriesScreen from '../screens/ShareYourWorriesScreen/DiaryEntriesScreen';

function AuthNavigator() {
    const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='SplashScreen'>
        <Stack.Screen name="AuthLoadingScreen" component={AuthLoadingScreen}/>
        <Stack.Screen name='SplashScreen' options={{ headerShown: false }} component={SplashScreen}/>
        <Stack.Screen name='Login' options={{ headerShown: false }} component={LoginScreen} />
        <Stack.Screen name='Register' options={{ headerShown: false }} component={RegisterScreen} />
        <Stack.Screen name='Home' options={{ headerShown: false }} component={TabNavigator} />
        <Stack.Screen name='ResetPassword' options={{ headerShown: false }} component={ResetPasswordScreen} />
        <Stack.Screen name="AddTask" component={AddTaskScreen} />
        <Stack.Screen name="EmojiPicker" component={EmojiPickerScreen} />
        <Stack.Screen name="MoodDetails" component={MoodDetailsScreen} />
        <Stack.Screen name="DiaryEntries" component={DiaryEntriesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AuthNavigator;