import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import TextInput from '../../components/TextInput';
import { MaterialIcons } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import { firestore, auth } from '../../../firebase.js';

function getMonthName(month) {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return monthNames[parseInt(month) - 1];
}


const ShareYourWorriesScreen = ({ navigation }) => {
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [message, setMessage] = useState('');
  const apiKey = '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';
  const gptLink = 'https://api.openai.com/v1/engines/text-davinci-002/completions'
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [diaryEntries, setDiaryEntries] = useState([]); // State variable for diary entries
  const [showBenefits, setShowBenefits] = useState(false);
  const userId = auth.currentUser.uid;

  const handleEmojiSelection = (emoji) => {
    setSelectedEmoji(emoji);
    setShowEmojiPicker(false);
  };

  const navigateToGeneratedPrompt = async () => { //create new screen for openai prompt
    addToDiary();
    /*try {
      const response = await fetch(gptLink, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`, // Replace with your OpenAI API key
        },
        body: JSON.stringify({
          prompt: message + 'please give me a short encouragement message to make my day. use humanlike and personal voice',
          max_tokens: 100,
        }),
      });

      const data = await response.json();
      console.log("#####");
      console.log(data);
      setGeneratedPrompt(data.choices[0].text);
      addToDiary(); // Add the diary entry when the user presses the button
    } catch (error) {
      console.error('Error:', error);
    }*/
  };

  const renderEmojiImage = () => {
    if (selectedEmoji === '😊') {
      return <Image source={require('../../assets/happy.png')} style={styles.emojiImage} />;
    } else if (selectedEmoji === '😭') {
      return <Image source={require('../../assets/sad.png')} style={styles.emojiImage} />;
    } else if (selectedEmoji === '😐') {
      return <Image source={require('../../assets/average.png')} style={styles.emojiImage} />;
    } else if (selectedEmoji === '😨') {
      return <Image source={require('../../assets/worried.png')} style={styles.emojiImage} />;
    } else {
      return <MaterialIcons name="face-retouching-natural" size={35} color="#F1FDF5" />;
    }
  };

  /*const addToDiary = () => {
    const date = new Date();
    const formattedDate = `${date.getDate()} ${getMonthName(date.getMonth() + 1)} ${date.getFullYear()}`;
    const newEntry = {
      message: message,
      emoji: selectedEmoji,
      timestamp: formattedDate, // Add the current date to the entry
    };
    setDiaryEntries([...diaryEntries, newEntry]);
    setMessage(''); // Clear the message input after adding to the diary
    setSelectedEmoji(''); // Clear the selected emoji after adding to the diary
    saveDiaryEntryToFirestore(userId, message, selectedEmoji, formattedDate); // Call the saveToFirestore function to save the entry to Firestore
  };*/

  const addToDiary = async () => {
    const date = new Date();
    const formattedDate = `${date.getDate()} ${getMonthName(date.getMonth() + 1)} ${date.getFullYear()}`;
    const newEntry = {
      message: message,
      emoji: selectedEmoji,
      timestamp: formattedDate, // Add the current date to the entry
    };
  
    try {
      const diaryEntriesRef = firestore.collection('diaryEntries'); // Use the firestore object here
      const querySnapshot = await diaryEntriesRef
        .where('userId', '==', userId)
        .where('timestamp', '==', formattedDate) //Can try to put other dates for testing.
        .get();
  
      if (querySnapshot.empty) {
        await diaryEntriesRef.add({
          userId: userId,
          message: message,
          emoji: selectedEmoji,
          timestamp: formattedDate,
        });
        console.log('Diary entry saved to Firestore');
        setDiaryEntries([...diaryEntries, newEntry]);
      } else {
        console.log('A diary entry for the current user and date already exists.');
      }
    } catch (error) {
      console.error('Error adding diary entry to Firestore:', error);
    }
  
    setMessage(''); // Clear the message input after adding to the diary
    setSelectedEmoji(''); // Clear the selected emoji after adding to the diary
  };
  

  const renderEmptyDiary = () => {
  
    const flipCard = () => {
      setShowBenefits(!showBenefits);
    };

    const today = new Date();
    const formattedToday = `${today.getDate()} ${getMonthName(today.getMonth() + 1)} ${today.getFullYear()}`;

    const hasEntryForToday = diaryEntries.some(entry => entry.timestamp === formattedToday);

    if (hasEntryForToday) {
      return null; // If there is an entry for today, return null to render nothing
    }
  
    return (
      <TouchableOpacity style={styles.emptyDiaryContainer} onPress={flipCard}>
        <View style={styles.emptyDiaryCard}>
          {showBenefits ? (
            <View>
              <Text style={styles.emptyDiaryHeaderText}>Benefits of Reflecting:</Text>
              <Text style={styles.emptyDiaryText}>
                Reflecting on your day can help you gain insights, reduce stress, improve self-awareness,
                and promote personal growth. Take a moment to jot down your thoughts and experiences.
              </Text>
            </View>
          ) : (
            <View>
              <Image
                source={require('../../assets/diary.png')}
                style={styles.emptyDiaryImage}
              />
              <Text style={styles.emptyDiaryText}>
                Start reflecting your day for mindfulness and growth! 
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topContainer}>
            <Text style={styles.headText}>Hi, how was your day like this today?</Text>
            <View style={styles.circle}>
              {renderEmojiImage()}
            </View>
            <TouchableOpacity style={styles.buttonEmoji} onPress={() => setShowEmojiPicker(true)}>
                <Ionicons name="add-circle" size={24} color="black" />
            </TouchableOpacity>
            <TextInput style={styles.input}
            multiline
            label="Reflection"
            returnKeyType="next"
            value={message}
            onChangeText={setMessage}
            scrollEnabled
            />
            <Button mode="contained" onPress={navigateToGeneratedPrompt} style={{width: '80%'}}> 
              Get a personalised encouragement!
            </Button>
            <Text>{generatedPrompt}</Text>
        </View>

        <Modal visible={showEmojiPicker} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.emojiPickerContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowEmojiPicker(false)}>
                <Ionicons name="close-circle" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.btmHeadText}>Select an Emoji</Text>
              <View style={styles.emojiContainer}>
                <TouchableOpacity
                  style={styles.emojiButton}
                  onPress={() => handleEmojiSelection('😊')}
                >
                  <Image source={require('../../assets/happy.png')} style={styles.emojiImage} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.emojiButton}
                  onPress={() => handleEmojiSelection('😭')}
                >
                  <Image source={require('../../assets/sad.png')} style={styles.emojiImage} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.emojiButton}
                  onPress={() => handleEmojiSelection('😐')}
                >
                  <Image source={require('../../assets/average.png')} style={styles.emojiImage} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.emojiButton}
                  onPress={() => handleEmojiSelection('😨')}
                >
                  <Image source={require('../../assets/worried.png')} style={styles.emojiImage} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles.diaryHeader}>
          <Text style={styles.btmHeadText}>Diary</Text>
          <TouchableOpacity
            mode="contained"
            onPress={() => navigation.navigate('DiaryEntries', { diaryEntries })}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {diaryEntries.length === 0 ? (
          renderEmptyDiary()
        ) : (
        <View style={styles.btmContainer}>
          {diaryEntries
            .slice(-3)
            .reverse()
            .map((entry, index) => {
              const dateParts = entry.timestamp.split(' ');
              const formattedDate = `${dateParts[0]} ${dateParts[1]} ${dateParts[2]}`.replace(',', '');  
              return (
                <View key={index} style={styles.diaryEntryContainer}>
                  <View style={styles.diaryEntry}>
                    <View style={styles.dateEmojiContainer}>
                      <Text style={styles.diaryDate}>{formattedDate}</Text>
                      <Text>{entry.emoji}</Text>
                    </View>
                    <Text style={styles.diaryText}>{entry.message}</Text>
                  </View>
                  {index !== diaryEntries.length - 1 && <View style={styles.entrySeparator} />}
                </View>
              );
            })}
        </View>
        )}
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  topContainer: {
    backgroundColor: '#F6FFDE',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 190,
  },
  headText: {
    color: '#478C5C',
    fontFamily: 'popSemiBold',
    fontSize: 22,
    width: '50%',
    marginTop: 14,
  },
  input: {
    marginTop: -20,
    width: '80%',
    textAlignVertical: 'center',
    alignSelf: 'center',
  },
  circle: {
    backgroundColor: '#478C5C',
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 150,
  },
  buttonEmoji: {
    left: 23,
    bottom: 20,
  },
  btmContainer: {
    alignItems: 'flex-start',
  },
  diaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 35,
    marginBottom: 10,
  },
  viewAllText: {
    color: '#478C5C',
    fontSize: 16,
    fontFamily: 'popSemiBold',
  },
  btmHeadText: {
    fontFamily: 'popSemiBold',
    fontSize: 24,
    width: '80%',
    textAlign: 'left',
    paddingVertical: 15,
    color: '#013A20',
  },
  diaryEntry: {
    flexDirection: 'column',
    backgroundColor: '#E8FEEE',
    padding: 12,
  },
  diaryDate: {
    color: '#478C5C',
    fontSize: 16,
    fontFamily: 'popSemiBold',
  },
  diaryText: {
    fontSize: 13,
    marginRight: 8,
    fontFamily: 'popMedium',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  emojiPickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  emojiContainer: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  emojiButton: {
    padding: 10,
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 20,
  },
  emojiImage: {
    width: 30, // Adjust the width as needed
    height: 30, // Adjust the height as needed
  },
  dateEmojiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  diaryEntryContainer: {
    width: '100%',
    paddingHorizontal: 30,
  },
  entrySeparator: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  emptyDiaryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 35,
  },
  emptyDiaryCard: {
    padding: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8FEEE',
    borderRadius: 30,
  },
  emptyDiaryHeaderText: {
    fontSize: 18,
    fontFamily: 'popSemiBold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  emptyDiaryText: {
    fontSize: 16,
    fontFamily: 'popMedium',
    textAlign: 'center',
    color: '#555555',
  },
  emptyDiaryImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
    alignSelf: 'center',
  }
});

export default ShareYourWorriesScreen;