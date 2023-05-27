import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Feather from 'react-native-vector-icons/Feather';

import HomeScreen from "../src/screens/HomeScreen";
import PomodoroScreen from "../src/screens/Pomodoro/PomodoroScreen";
import ShareYourWorriesScreen from "../src/screens/ShareYourWorriesScreen";
import CalendarScreen from "../src/screens/CalendarScreen";
import ProfileScreen from "../src/screens/ProfileScreen";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name = "Home" component={HomeScreen}></Tab.Screen>
            <Tab.Screen name = "Pomodoro" component={PomodoroScreen}></Tab.Screen>
            <Tab.Screen name = "ShareYourWorries" component={ShareYourWorriesScreen}></Tab.Screen>
            <Tab.Screen name = "Calendar" component={CalendarScreen}></Tab.Screen>
            <Tab.Screen name = "Profile" component={ProfileScreen}></Tab.Screen>
        </Tab.Navigator>
        )
}

export default TabNavigator;