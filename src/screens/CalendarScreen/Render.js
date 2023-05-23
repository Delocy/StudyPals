import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import { PropTypes } from 'prop-types';

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

export default RenderItem;
