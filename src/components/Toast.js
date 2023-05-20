import React from 'react'
import { Snackbar } from 'react-native-paper'
import { StyleSheet, SafeAreaView, Text } from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height'

export default function Toast({ type = 'error', message, onDismiss }) {
  return (
    <SafeAreaView style={styles.container}>
      <Snackbar
        visible={!!message}
        duration={3000}
        onDismiss={onDismiss}
        style={styles.snackbar}
      >
        <Text style={styles.content}>{message}</Text>
      </Snackbar>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 160 + getStatusBarHeight(),
    width: '100%',
  },
  content: {
    fontWeight: '500',
    color: '#000',
  },
  snackbar: {
    backgroundColor: '#fff',
  }
})