import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import HomeScreen from '../screens/HomeScreen';
import PomodoroScreen from "../screens/PomodoroScreen";
import ShareYourWorriesScreen from "../screens/ShareYourWorriesScreen";
import CalendarScreen from "../screens/CalendarScreen/CalendarScreen";
import ProfileScreen from "../screens/ProfileScreen";

//Screen names
const homeName = "Home";
const calendarName = "Calendar";
const profileName = "Profile";
const pomodoroName = "Pomodoro";
const shareYourWorriesName = "ShareYourWorries";

const Tab = createBottomTabNavigator();

function MainContainer() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === homeName) {
              iconName = focused ? 'home' : 'home-outline';
            } else if (rn === calendarName) {
              iconName = focused ? 'calendar' : 'calendar-outline';

            } else if (rn === profileName) {
              iconName = focused ? 'profile' : 'profile-outline';
            } else if (rn === pomodoroName) {
                iconName = focused ? 'pomodoro' : 'pomodoro-outline';
            } else if (rn === shareYourWorriesName) {
                iconName = focused ? 'shareyourworries' : 'shareyourworries-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'grey',
          labelStyle: { paddingBottom: 10, fontSize: 10 },
          style: { padding: 10, height: 70}
        }}>

        <Tab.Screen name={homeName} component={HomeScreen} />
        <Tab.Screen name={pomodoroName} component={PomodoroScreen} />
        <Tab.Screen name={profileName} component={ProfileScreen} />
        <Tab.Screen name={calendarName} component={CalendarScreen} />
        <Tab.Screen name={shareYourWorriesName} component={ShareYourWorriesScreen} />

      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default MainContainer;