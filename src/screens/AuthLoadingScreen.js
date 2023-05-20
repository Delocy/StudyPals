import React from 'react'
import { ActivityIndicator } from 'react-native'
import { auth } from '../../firebase';
import Background from '../components/Background';

export default function AuthLoadingScreen({ navigation }) {
  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is logged in
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      })
    } else {
      // User is not logged in
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    }
  })

  return (
    <Background>
      <ActivityIndicator size="large"/>
    </Background>
  )
}