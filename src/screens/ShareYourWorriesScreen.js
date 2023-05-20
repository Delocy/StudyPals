import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ShareYourWorriesScreen = ({navigation}) => {
    return (
        <View style={styles.container}>
            <Text>Share Your Worries</Text>
        <Button
            title="Click here"
            onPress={() => alert('Button Pressed')}
        />
        </View>
    )
}

export default ShareYourWorriesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '$8fcbbc',
    }
})