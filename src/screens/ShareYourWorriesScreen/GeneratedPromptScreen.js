import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const GeneratedPromptScreen = ({ route }) => {
  const { generatedPrompt } = route.params;

  return (
    <View style={styles.container}>
      <Image source={require('./prompt.png')} style={styles.image} />
      <Text style={styles.studyPalsText}>StudyPals:</Text>
      <Text style={styles.quote}>{generatedPrompt.trim()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8FEEE',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  studyPalsText: {
    fontSize: 40,
    textAlign: 'center',
    fontFamily: 'popBold',
    color: '#478C5C',
    marginTop: 10,
  },
  quote: {
    fontSize: 22,
    textAlign: 'center',
    marginHorizontal: 20,
    fontFamily: 'popMedium',
  },
});

export default GeneratedPromptScreen;