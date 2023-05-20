import React from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'

export default function Header(props) {
  return <Text style={styles.header} {...props} />
}

const styles = StyleSheet.create({
  header: {
    fontSize: 36,
    color: '#478C5C',
    fontFamily: 'popBold',
    paddingVertical: 12,
  },
})