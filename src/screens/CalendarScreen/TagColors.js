import React from 'react';
import { View, Text } from 'react-native';

const Tag = ({ text }) => {
  let color, textColor;

  switch (text.toLowerCase()) {
    case 'office':
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
    <View style={{ backgroundColor: color, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 20, marginVertical: 4, marginRight: 8 }}>
      <Text style={{ color: textColor, fontSize: 12, marginVertical: 2, marginHorizontal: 7 }}>{text}</Text>
    </View>
  );
};

export default Tag;
