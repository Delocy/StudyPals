import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const EmojiPickerScreen = ({ navigation, route }) => {
  const { handleEmojiSelection } = route.params;

  const selectEmoji = (emoji) => {
    handleEmojiSelection(emoji);
    navigation.goBack();
  };

  return (
    <View style={styles.emojiPickerContainer}>
      <TouchableOpacity onPress={() => selectEmoji('😊')}>
        <Text style={styles.emojiText}>😊</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => selectEmoji('😭')}>
        <Text style={styles.emojiText}>😭</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => selectEmoji('😧')}>
        <Text style={styles.emojiText}>😧</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => selectEmoji('😡')}>
        <Text style={styles.emojiText}>😡</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  emojiPickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  emojiText: {
    fontSize: 30,
    marginHorizontal: 10,
  },
});

export default EmojiPickerScreen;