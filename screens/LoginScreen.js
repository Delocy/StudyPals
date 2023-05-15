import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';
import { auth } from '../firebase';


const LoginScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation()

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.replace("Home");
            }
        })

        return unsubscribe
    }, [])

    const handleSignUp = () => {
        auth
        .createUserWithEmailAndPassword(email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
            console.log('Registered with:', user.email)
        })
        .catch(error => alert(error.message))
    }

    const handleLogin = () => {
        auth
        .signInWithEmailAndPassword(email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
            console.log('Logged in with:', user.email)
        })
        .catch(error => alert(error.message))
    }

    return (
        <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        >
            <Text style={styles.header}>Login</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.input}
                />
                
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={styles.input}
                    secureTextEntry
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={handleLogin}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleSignUp}
                    style={[styles.button, styles.buttonOutline]}
                >
                    <Text style={styles.buttonOutlineText}>Register</Text>
                </TouchableOpacity>
            </View>

            <Text>Don’t have an account? Sign Up</Text>
        </KeyboardAvoidingView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        color: '#478C5C',
        fontSize: 36,
        fontFamily: 'popSemiBold',
    },
    inputContainer : {
        width: '80%',
    }, 
    input : {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    }, 
    buttonContainer : {
        width: '60%',
        justifyContent: 'center',
        //alignItems: 'center',
        marginTop: 40,
        alignItems: 'stretch',
    }, 
    button : {
        backgroundColor: '#478C5C',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    }, 
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutline : {
        backgroundColor: 'white',
        marginTop: 5,
    }, 
    buttonOutlineText : {
        color: '#478C5C',
        fontWeight: '700',
        fontSize: 16,
    }, 
})

