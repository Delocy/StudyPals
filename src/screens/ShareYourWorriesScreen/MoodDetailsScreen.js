import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const MoodDetailsScreen = ({ route }) => {
  const { imageSource, quote } = route.params;

  return (
    <View style={styles.container}>
      <Image source={imageSource} style={styles.image} />
      <Text style={styles.quote}>{quote}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  quote: {
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 20,
  },
});

export default MoodDetailsScreen;
