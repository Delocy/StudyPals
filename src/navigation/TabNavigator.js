import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import ShareYourWorriesScreen from "../screens/ShareYourWorriesScreen";
import CalendarScreen from "../screens/CalendarScreen/CalendarScreen";
import HomeScreen from '../screens/HomeScreen';
import PomodoroScreen from "../screens/PomodoroScreen";
import ProfileScreen from "../screens/ProfileScreen";

// Screen names
const shareYourWorriesName = "Share Your Worries";
const calendarName = "Calendar";
const homeName = "Nested Home";
const pomodoroName = "Pomodoro";
const profileName = "Profile";


const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
      <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, size, color }) => {
            let iconName;
            let rn = route.name;

            if (rn === homeName) {
                iconName = focused ? 'home' : 'home-outline';
              } else if (rn === calendarName) {
                iconName = focused ? 'calendar' : 'calendar-outline';
              } else if (rn === profileName) {
                iconName = focused ? 'person-circle' : 'person-circle-outline';
              } else if (rn === pomodoroName) {
                  iconName = focused ? 'time' : 'time-outline';
              } else if (rn === shareYourWorriesName) {
                  iconName = focused ? 'sad' : 'sad-outline';
              }
            return <Ionicons name={iconName} size={size} color={focused ? '#478C5C' : '#C6CEDD'} />;
            //return <Image source = {iconName} color = {color} />;
          },
          style: { padding: 30, height: 80},
          tabBarLabel: '',
          tabStyle: {paddingTop: 30},
        })}>

        <Tab.Screen name={shareYourWorriesName} component={ShareYourWorriesScreen} />
        <Tab.Screen name={calendarName} component={CalendarScreen} />
        <Tab.Screen name={homeName} component={HomeScreen} />
        <Tab.Screen name={pomodoroName} component={PomodoroScreen} />
        <Tab.Screen name={profileName} component={ProfileScreen} />

      </Tab.Navigator>
  );
}

export default TabNavigator;