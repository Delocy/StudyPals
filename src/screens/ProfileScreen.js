import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { auth } from '../../firebase';
import { logoutUser } from '../api/auth-api'

const ProfileScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Email: {auth.currentUser?.email}</Text>
            <TouchableOpacity 
                mode = "outlined"
                style={styles.button}
                onPress={logoutUser}
            >
                <Text style={styles.buttonText}>Sign out</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button : {
        backgroundColor: '#478C5C',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 40,
    }, 
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
})