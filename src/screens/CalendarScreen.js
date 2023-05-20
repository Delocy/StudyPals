import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const CalendarScreen = ({navigation}) => {
    return (
        <View style={styles.container}>
            <Text>Calendar Screen</Text>
        <Button
            title="Click Here"
            onPress={() => alert('Button Clicked')}
        />
        </View>
    )
}

export default CalendarScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '$8fcbbc',
    }
})