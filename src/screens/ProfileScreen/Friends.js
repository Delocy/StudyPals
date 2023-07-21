import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { firestore, auth } from '../../../firebase';

const FriendsScreen = ({ navigation }) => {
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendIdInput, setFriendIdInput] = useState('');
  const [friendNicknameInput, setFriendNicknameInput] = useState('');
  const [friendRequestSent, setFriendRequestSent] = useState(false);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const userId = auth.currentUser.uid;

        const friendsCollection = firestore.collection('friends');
        const friendsQuerySnapshot = await friendsCollection
          .where('userId', '==', userId)
          .where('status', '==', 'accepted')
          .get();

          const friendsData = friendsQuerySnapshot.docs.map((doc) => ({
            id: doc.id, // Include the document ID in the data
            ...doc.data(),
          }));

        const friendsQuerySnapshot2 = await friendsCollection
          .where('friendId', '==', userId)
          .where('status', '==', 'accepted')
          .get();

        const friendsData2 = friendsQuerySnapshot2.docs.map((doc) => doc.data());
        const allFriendsData = [...friendsData, ...friendsData2];
        setFriends(allFriendsData);
      } catch (error) {
        console.error('Error fetching friends:', error);
        Alert.alert('Error', 'Failed to fetch friends. Please try again.');
      }
    };

    const fetchFriendRequests = async () => {
      try {
        const userId = auth.currentUser.uid;

        const friendRequestsQuerySnapshot = await firestore
          .collection('friends')
          .where('friendId', '==', userId)
          .where('status', '==', 'pending')
          .get();

        const requests = friendRequestsQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFriendRequests(requests);
      } catch (error) {
        console.error('Error fetching friend requests:', error);
        Alert.alert('Error', 'Failed to fetch friend requests. Please try again.');
      }
    };

    fetchFriends();
    fetchFriendRequests();
  }, []);

  const acceptFriendRequest = async (requestId) => {
    try {
      await firestore.collection('friends').doc(requestId).update({
        status: 'accepted',
      });

      const updatedFriends = friends.map((friend) => {
        if (friend.id === requestId) {
          return { ...friend, status: 'accepted' };
        }
        return friend;
      });
      setFriends(updatedFriends);

      const friendRequestsQuerySnapshot = await firestore
        .collection('friends')
        .where('friendId', '==', auth.currentUser.uid)
        .where('status', '==', 'pending')
        .get();

      const requests = friendRequestsQuerySnapshot.docs.map((doc) => doc.data());
      setFriendRequests(requests);
    } catch (error) {
      console.error('Error accepting friend request:', error);
      Alert.alert('Error', 'Failed to accept friend request. Please try again.');
    }
  };

  const sendFriendRequest = async (friendId, friendNickname) => {
    try {
      if (!friendId || !friendNickname) {
        Alert.alert('Please fill in both the Friend ID and Friend Nickname fields.');
        return;
      }
      const userId = auth.currentUser.uid;
      const userDisplayName = auth.currentUser.displayName;

      const requestExistsQuerySnapshot = await firestore
        .collection('friends')
        .where('userId', '==', userId)
        .where('friendId', '==', friendId)
        .get();

      if (requestExistsQuerySnapshot.empty) {
        await firestore.collection('friends').add({
          userId,
          userDisplayName,
          friendId,
          friendNickname,
          status: 'pending',
        });

        Alert.alert('Friend Request Sent');
        setFriendRequestSent(true);
        setFriendIdInput('');
        setFriendNicknameInput('');
      } else {
        Alert.alert('Friend Request Already Sent');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send friend request. Please try again.');
    }
  };

  const renderFriendRequestItem = ({ item }) => (
    <View style={styles.friendRequest}>
      <Text style={styles.friendRequestId}>{item.userDisplayName}</Text>
      <TouchableOpacity
        style={styles.acceptButton}
        onPress={() => acceptFriendRequest(item.id)}
      >
        <Text style={styles.acceptButtonText}>Accept</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFriendItem = ({ item }) => {
    const isFriendRequester = item.userId === auth.currentUser.uid;
    const displayName = isFriendRequester ? item.friendNickname : item.userDisplayName;

    const navigateToFriendAchievements = () => {
        navigation.navigate("Friend's Achievements", { friendId: item.friendId, userId: item.userId, friendName: item.friendNickname, userName: item.userDisplayName });
    };
      
    return (
      <TouchableOpacity style={styles.friendItem} onPress={navigateToFriendAchievements}>
        <Text style={styles.friendName}>{displayName}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Friends</Text>

      {friends.length > 0 ? (
        <FlatList
          data={friends}
          renderItem={renderFriendItem}
          keyExtractor={(item) => item.friendId}
          style={styles.friendList}
        />
      ) : (
        <Text style={styles.emptyText}>No friends found.</Text>
      )}
    
      <View style={styles.friendRequestListContainer}>
        <Text style={styles.sectionTitle}>Friend Requests</Text>
          {friendRequests.length > 0 ? (
              <FlatList
              data={friendRequests}
              renderItem={renderFriendRequestItem}
              keyExtractor={(item) => item.id}
              style={styles.friendRequestsList}
            />            
          ) : (
              <Text style={styles.emptyText}>No friend requests.</Text>
        )}
      <View style={styles.friendRequestAdd}>
        <Text style={styles.sectionTitle}>Add Friend</Text>
        <TextInput
            style={styles.input}
            placeholder="Enter Friend's Nickname"
            placeholderTextColor="#777"
            onChangeText={setFriendNicknameInput}
            value={friendNicknameInput}
        />
        <TextInput
            style={styles.input}
            placeholder="Enter Friend's ID"
            placeholderTextColor="#777"
            onChangeText={setFriendIdInput}
            value={friendIdInput}
        />
        <TouchableOpacity
            style={styles.button}
            onPress={() => sendFriendRequest(friendIdInput, friendNicknameInput)}
            disabled={friendRequestSent}
        >
            <Text style={styles.buttonText}>{friendRequestSent ? 'Request Sent' : 'Add Friend'}</Text>
        </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E1F7E0',
  },
  title: {
    fontSize: 24,
    fontFamily: 'popSemiBold',
    marginBottom: 20,
  },
  friendList: {
    flex: 1,
    marginBottom: 20,
  },
  friendItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  friendName: {
    fontSize: 16,
    fontFamily: 'popSemiBold',
  },
  friendRequestListContainer: {
    flex: 1,
  },
  friendRequestsList: {
    flex: 1,
  },
  friendRequest: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  friendRequestId: {
    fontSize: 16,
    marginRight: 10,
    fontFamily: 'popRegular',
  },
  acceptButton: {
    backgroundColor: '#478C5C',
    padding: 5,
    borderRadius: 5,
  },
  acceptButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'popSemiBold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    fontFamily: 'popRegular',
  },
  button: {
    backgroundColor: '#478C5C',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  friendRequestAdd: {
    backgroundColor:'#ffffff',
    padding: 20,
    borderRadius: 20,
    marginTop: 70,
  }
});

export default FriendsScreen;
