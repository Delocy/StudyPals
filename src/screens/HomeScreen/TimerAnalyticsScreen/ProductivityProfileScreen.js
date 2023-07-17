import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const ProductivityProfileScreen = ({ route }) => {
  const { profile } = route.params;
  console.log(profile);

  const getAdvice = () => {
    switch (profile) {
      case 'Morning Person':
        return (
          <>
            <Text>- Leverage your natural energy and focus in the morning to tackle your most challenging tasks.</Text>
            <Text>- Set a morning routine that includes activities to boost your productivity.</Text>
            <Text>- Take short breaks throughout the day to maintain your energy levels and avoid burnout.</Text>
          </>
        );
      case 'Afternoon Achiever':
        return (
          <>
            <Text>- Use the morning to ease into your day and handle less demanding tasks. {'\n'}</Text>
            <Text>- Optimize your workspace for productivity during the afternoon. {'\n'}</Text>
            <Text>- Consider incorporating a power nap or short meditation session during the mid-afternoon slump.</Text>
          </>
        );
      case 'Evening Energizer':
        return (
          <>
            <Text>- Embrace your peak productivity time in the evening for creative and innovative tasks. {'\n'}</Text>
            <Text>- Create a clear transition from daytime to evening work mode. {'\n'}</Text>
            <Text>- Take advantage of the quiet and less interrupted evenings.</Text>
          </>
        );
      case 'Night Owl':
        return (
          <>
            <Text>- Structure your day to allow for a later start and peak productivity in the evenings. {'\n'}</Text>
            <Text>- Prioritize quality sleep and establish a consistent sleep schedule. {'\n'}</Text>
            <Text>- Be mindful of potential distractions during the night and create a dedicated work environment.</Text>
          </>
        );
      default:
        return null;
    }
  };

  const getPersonalityInsights = (profile) => {
    switch (profile) {
      case 'Morning Person':
        return 'You are an early riser and tend to be proactive and focused in the morning. You thrive on structure and organization, and you find it easier to prioritize tasks and set goals. Your disciplined nature helps you start the day with a clear plan and tackle important tasks efficiently. You are often energized and motivated by early accomplishments, setting a positive tone for the rest of the day.';
      case 'Afternoon Achiever':
        return 'You have a balanced approach to productivity and find your peak energy and focus in the afternoon. You possess the ability to adapt to changing circumstances and handle various tasks efficiently. Your flexibility allows you to navigate through different responsibilities with ease. You excel in multitasking and are skilled at managing your time and resources effectively. You maintain a steady pace of productivity throughout the day, making significant progress on your goals.';
      case 'Evening Energizer':
        return 'You are a night owl and find your creative energy and inspiration in the evening. You enjoy a more relaxed and quiet environment, allowing your mind to wander and explore new ideas. You possess a creative spark and find it easier to think outside the box during these hours. Your focus and attention to detail are heightened, enabling you to delve deep into complex tasks or engage in activities that require imagination and innovation.';
      case 'Night Owl':
        return 'You are most productive during the late hours and prefer to work during the night. Your mind is sharp and alert during this time, making you an excellent problem solver. You enjoy the peace and quiet that the nighttime offers, allowing you to dive deep into your work without distractions. Your ability to concentrate for extended periods during the night allows you to make significant progress on challenging tasks or engage in activities that require intense focus.';
      default:
        return '';
    }
  };

  const personalityInsights = getPersonalityInsights(profile); 
  const personalityImage = require('./personality.jpg');

  return (
    <View style={styles.container}>
      <Image source={personalityImage} style={styles.image} />
      <Text style={styles.profileTitle}>You are a {profile}!</Text>
      <Text style={styles.sectionTitle}>Personality</Text>
      <Text style={styles.personalityInsights}>{personalityInsights}</Text>
      <Text style={styles.sectionTitle}>Advice</Text>
      <Text style={styles.advice}>{getAdvice()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
    alignItems: 'center'
  },
  image: {
    width: 200,
    height: 200,
    margin: '5%',
  },
  profileTitle: {
    fontSize: 24,
    fontFamily: 'popBold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#478C5C'
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'popSemiBold',
    marginTop: '3%',
    marginBottom: '2%',
    color: '#478C5C'
  },
  personalityInsights: {
    fontSize: 15,
    lineHeight: 24,
  },
  advice: {
    fontSize: 15,
    lineHeight: 24,
    fontStyle: 'italic',
  },
});

export default ProductivityProfileScreen;
