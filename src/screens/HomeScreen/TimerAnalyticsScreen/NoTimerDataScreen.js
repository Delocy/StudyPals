import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NoTimerDataScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.message}>No focus data available for timer analytics.</Text> 
      <Text>Start tracking your work with our Pomodoro Timer!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F6FFDE',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
    },
    message: {
        fontFamily: 'popSemiBold',
        fontSize: 35,
        padding: '2%'
    },
})

export default NoTimerDataScreen;