import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { firestore, auth } from '../../../firebase';

const FriendsScreen = ({ navigation }) => {
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendIdInput, setFriendIdInput] = useState('');
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
      
          const friendsData = friendsQuerySnapshot.docs.map((doc) => doc.data());
      
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

  const sendFriendRequest = async (friendId) => {
    try {
      const userId = auth.currentUser.uid;
      const userDisplayName = auth.currentUser.displayName;
  
      // Fetch the friend's display name
      const friendDoc = await firestore.collection('users').doc(friendId).get();
      const friendDisplayName = friendDoc.data().displayName;
  
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
          friendDisplayName,
          status: 'pending',
        });
  
        Alert.alert('Friend Request Sent');
        setFriendRequestSent(true);
      } else {
        Alert.alert('Friend Request Already Sent');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      Alert.alert('Error', 'Failed to send friend request. Please try again.');
    }
  };  

  const renderFriendRequestItem = ({ item }) => (
    <View style={styles.friendRequest}>
      <Text style={styles.friendRequestId}>{item.userId}</Text>
      <TouchableOpacity
        style={styles.acceptButton}
        onPress={() => acceptFriendRequest(item.id)}
      >
        <Text style={styles.acceptButtonText}>Accept</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFriendItem = ({ item }) => (
    <View style={styles.friendItem}>
      <Text style={styles.friendName}>{item.friendDisplayName}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends</Text>

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

      <Text style={styles.sectionTitle}>Add Friend</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Friend ID"
        onChangeText={setFriendIdInput}
        value={friendIdInput}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => sendFriendRequest(friendIdInput)}
        disabled={friendRequestSent}
      >
        <Text style={styles.buttonText}>{friendRequestSent ? 'Request Sent' : 'Add Friend'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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
  },
});

export default FriendsScreen;
