import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Modal, Image, ActivityIndicator } from 'react-native';
import TextInput from '../../components/TextInput';
import { MaterialIcons } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import { firestore, auth, firebase } from '../../../firebase.js';
import Toast from '../../components/Toast';
import { API_KEY, GPT_LINK } from '@env';
import { Alert } from 'react-native';

const ShareYourWorriesScreen = ({ navigation }) => {
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [diaryEntries, setDiaryEntries] = useState([]); // State variable for diary entries
  const [showBenefits, setShowBenefits] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const userId = auth.currentUser.uid;
  const userName = auth.currentUser.displayName;
  const [showPrompt, setShowPrompt] = useState(false);
  const startOfDay = new Date().setHours(0, 0, 0, 0);
  const endOfDay = new Date().setHours(23, 59, 59, 999);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDiaryEntries = async () => {
      try {
        const diaryEntriesRef = firestore.collection('diaryEntries');
        const querySnapshot = await diaryEntriesRef.where('userId', '==', userId).get();
        const entries = [];
        querySnapshot.forEach((doc) => {
          entries.push(doc.data());
        });
        setDiaryEntries(entries);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching diary entries from Firestore:', error);
        setLoading(false);
      }
    };  
    fetchDiaryEntries();
  }, []);

  const handleEmojiSelection = (emoji) => {
    setSelectedEmoji(emoji);
    setShowEmojiPicker(false);
  };

  const navigateToGeneratedPrompt = async () => { //create new screen for openai prompt
    if (!selectedEmoji && !message) {
      setToastMessage('Please select an emoji and message before proceeding!');
    }

    if (!selectedEmoji) {
      setToastMessage('Please select an emoji before proceeding!');
      return;
    }

    if (!message) {
      setToastMessage('Please submit your reflection before proceeding!');
      return;
    }

    const existingEntry = diaryEntries.find(entry => {
      const entryTimestamp = entry.timestamp.toDate();
      return entryTimestamp >= startOfDay && entryTimestamp <= endOfDay;
    });
  
    if (existingEntry) {
      setToastMessage('A diary entry for today already exists!');
      return;
    }
    Alert.alert(
      'Reflection Detailed Enough?',
      'Editing your entry is not allowed. Are you sure you want to proceed?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Proceed',
          style: 'default',
          onPress: () => {
            setIsLoading(true); // Set loading state to true
            // Proceed with generating the prompt and adding the diary entry
            generatePrompt().then(() => {
              setIsLoading(false); // Set loading state to false
            });
          },
        },
      ],
    );
    //const generatedPrompt = "Tears may fall, but your spirit won't break. Embrace the pain as a stepping stone to growth. You are resilient, worthy of love, and destined for happiness. Keep shining, healing, and believing in brighter tomorrows. You've got this!";
    //setGeneratedPrompt(generatedPrompt);
    //await addToDiary(generatedPrompt);
  };

  const generatePrompt = async () => {
    try {
      let generatedPrompt = '';
  
      while (true) {
        // Generate the prompt using the API call
        const response = await fetch(GPT_LINK, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            prompt: message + '.Give me an encouragement message to make my day. Speak to me personally with min 40 words. Finish your sentence.',
            max_tokens: 80,
            top_p: 0.7,
            temperature: 0.8
          }),
        });
  
        const data = await response.json();
        console.log('API Response:', data);
        console.log('Generated Prompt:', data.choices[0].text);
  
        generatedPrompt = data.choices[0].text;
        
        // VALIDATION CHECKS.
        // Check if generated prompt ends with punctuation
        const lastChar = generatedPrompt.trim().slice(-1);
        if (!['.', '!', '?'].includes(lastChar)) {
          // Remove text after the last punctuation mark
          const lastIndex = generatedPrompt.search(/[.!?]/g);
          if (lastIndex >= 0) {
            generatedPrompt = generatedPrompt.substring(0, lastIndex + 1);
          }
        }
  
        // Check if generated prompt has at least 40 words
        const wordCount = generatedPrompt.trim().split(' ').length;
        if (wordCount >= 40) {
          // If the prompt passes the validation checks, break the loop and proceed
          break;
        }
      }
  
      await setGeneratedPrompt(generatedPrompt);
      await addToDiary(generatedPrompt); // Add the diary entry when the user presses the button
  
      navigation.navigate('GeneratedPrompt', { generatedPrompt });
    } catch (error) {
      console.error('Error:', error);
      navigation.goBack();
    }
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

  const addToDiary = async (generatedPrompt) => {
    // Check if generatedPrompt is null
    if (generatedPrompt === null) {
      setToastMessage('Waiting for StudyPals response...');
      console.log('Waiting for generated prompt to be available...');
      return;
    }

    const timestamp = firebase.firestore.Timestamp.now();
    const newEntry = {
      message: message,
      generatedPrompt: generatedPrompt,
      emoji: selectedEmoji,
      timestamp: timestamp, // Use the timestamp instead of formatted date
    };
  
    try {
      const diaryEntriesRef = firestore.collection('diaryEntries');
      const querySnapshot = await diaryEntriesRef
        .where('userId', '==', userId)
        .where('timestamp', '>=', firebase.firestore.Timestamp.fromDate(new Date(startOfDay)))
        .where('timestamp', '<=', firebase.firestore.Timestamp.fromDate(new Date(endOfDay)))
        .get();
  
      if (querySnapshot.empty) {
        await diaryEntriesRef.add({
          userId: userId,
          message: message,
          generatedPrompt: generatedPrompt,
          emoji: selectedEmoji,
          timestamp: timestamp,
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
    setGeneratedPrompt(''); // Clear the selected prompt after adding to the diary
  };

  const currentDate = new Date();
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(currentDate.getDate() - 3);
  
  const recentEntries = diaryEntries.filter(entry => entry.timestamp.toDate() >= threeDaysAgo); 
  
  const renderEmptyDiary = () => {
    const flipCard = () => {
      setShowBenefits(!showBenefits);
    };

    if (recentEntries.length === 0) {
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
    }
  
    return null;
  };  

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.topContainer}>
          {/* Loading indicator */}
          {isLoading && <ActivityIndicator />}
            <Text style={styles.headText}>Hi {userName}, how was your day like today?</Text>
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
            autoCapitalize="none"
            autoComplete="off"
            scrollEnabled
            />
            <Button mode="contained" onPress={navigateToGeneratedPrompt} style={{width: '80%'}}> 
              Get a personalised encouragement!
            </Button>
            {toastMessage && <Toast message={toastMessage} onDismiss={() => setToastMessage('')} />}
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
            onPress={() => navigation.navigate('DiaryEntries', { diaryEntries: [diaryEntries] })}
            >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {(!recentEntries || recentEntries.length === 0) ? (
          renderEmptyDiary()
        ) : (
        <View style={styles.btmContainer}>
          {diaryEntries
            .filter(entry => {
              // Get the timestamp for three days ago
              const threeDaysAgo = new Date();
              threeDaysAgo.setDate(threeDaysAgo.getDate() - 4);

              // Filter entries that have a timestamp greater than or equal to three days ago
              return entry.timestamp.toDate() >= threeDaysAgo;
            })
            .sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate()) // Sort entries by timestamp in descending order
            .slice(0, 3) // Get the first three entries
            .map((entry, index) => {
              const timestamp = entry.timestamp.toDate();
              const formattedDate = timestamp.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });
              
              const handlePromptModalOpen = async () => {
                try {
                  setGeneratedPrompt(entry.generatedPrompt);
                  setShowPrompt(true);
                } catch (error) {
                  console.log('Error retrieving generated prompt:', error);
                }
              };
                    
              return (
                <View key={index} style={styles.diaryEntryContainer}>
                    <TouchableOpacity style={styles.diaryEntry} onPress={handlePromptModalOpen}>
                    <View style={styles.dateEmojiContainer}>
                      <Text style={styles.diaryDate}>{formattedDate}</Text>
                      <Text>{entry.emoji}</Text>
                    </View>
                    <Text style={styles.diaryText}>{entry.message}</Text>
                  </TouchableOpacity>
                  {index !== diaryEntries.length - 1 && <View style={styles.entrySeparator} />}
                </View>
              );
            })}
              <Modal visible={showPrompt} animationType="fade" transparent>
                <View style={styles.modalContainer}>
                  <View style={styles.promptContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setShowPrompt(false)}>
                      <Ionicons name="close-circle" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.brand}>StudyPals</Text>
                    <Text style={styles.quote}>Dear {userName}. {'\n'}</Text>
                    <Text style={styles.quote}>{generatedPrompt.trim()}</Text>
                  </View>
                </View>
              </Modal>

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
    marginTop: 10,
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
  promptContainer: {
    backgroundColor: '#E8FEEE',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    height: '65%',
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
  },
  quote: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'popMedium',
    marginTop: 5,
  },
  brand: {
    fontSize: 35,
    textAlign: 'center',
    fontFamily: 'popBold',
    color: '#478C5C',
    marginBottom: 25,
  }
});

export default ShareYourWorriesScreen;