import React from 'react';
import { View, Text } from 'react-native';

const Tag = ({ text }) => {
  let color, textColor;

  switch (text.toLowerCase()) {
    case 'school':
      color = '#ECEAFF';
      textColor = '#8F81FE';
      break;
    case 'home':
      color = '#FFEFEB';
      textColor = '#F0A58E';
      break;
    case 'urgent':
      color = '#FFE9ED';
      textColor = '#F57C96'; // You can set the desired color for 'urgent'
      break;
    case 'personal':
      color = '#D1FEFF';
      textColor = '#1EC1C3'; // You can set the desired color for 'personal'
      break;
    default:
      color = '#000000';
      textColor = '#FFFFFF';
      break;
  }

  return (
    <View style={{ 
      backgroundColor: color, 
      borderRadius: 18,
      paddingVertical: 8,
      paddingHorizontal: 15,
      marginRight: 6,
      justifyContent:'center',}}>
      <Text style={{ color: textColor, marginHorizontal: 7, fontFamily: 'popRegular', fontSize: 12,}}>{text}</Text>
    </View>
  );
};

export default Tag;