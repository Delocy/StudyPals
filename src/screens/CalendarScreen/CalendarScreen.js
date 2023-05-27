import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Card, Avatar } from 'react-native-paper';
import { PropTypes } from 'prop-types';

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};

const CalendarScreen = ({ navigation }) => {
  const [items, setItems] = useState({});

  const loadItems = (day) => {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);
        if (!items[strTime]) {
          items[strTime] = [];
          const numItems = Math.floor(Math.random() * 3 + 1);
          for (let j = 0; j < numItems; j++) {
            const uniqueKey = `${strTime}_${j}`; // Generate a unique key using the date and index
            items[strTime].push({
              key: uniqueKey,
              name: 'Item for ' + strTime + ' #' + j,
              height: Math.max(50, Math.floor(Math.random() * 150)),
            });
          }
        }
      }
      const newItems = { ...items };
      setItems(newItems);
    }, 1000);
  };
  

  class RenderItem extends React.PureComponent {
    render() {
      const { item } = this.props;
      if (!item) {
        return null; // Return null or a fallback component if item is undefined
      }
      return (
        <TouchableOpacity style={{ marginRight: 10, marginTop: 17 }}>
          <Card>
            <Card.Content>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View>
                  <Text>{item.name}</Text>
                </View>
                <Avatar.Text label="J" />
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      );
    }
  }
  

  RenderItem.propTypes = {
    item: PropTypes.object.isRequired, // Adjust the prop type based on the expected item shape
  };

  return (
    <View style={{ flex: 1 }}>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        selected={'2023-05-21'}
        renderItem={({ item }) => <RenderItem item={item} />}
        keyExtractor={(item) => item.key}
      />
    </View>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8fcbbc',
  },
});
