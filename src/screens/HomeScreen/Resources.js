import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Text, StyleSheet, Linking } from 'react-native';
import { firestore } from '../../../firebase.js';

const db = firestore

const MentalHealthScreen = () => {
  const [articles, setArticles] = useState([]);
  const [filter, setFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const snapshot = await db.collection('Articles').get();
        const fetchedArticles = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setArticles(fetchedArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  const handleFilterChange = (text) => {
    setFilter(text);
  };

  const handleSearchQueryChange = (text) => {
    setSearchQuery(text);
  };

  const handleArticlePress = (url) => {
    Linking.openURL(url);
  };

  const renderArticleItem = ({ item }) => {
    let categoryColor = '#888888'; // Default color
    switch (item.Category) {
      case 'Mental Health Literacy':
        categoryColor = '#A6B0FF';
        break;
      case 'Relationships':
        categoryColor = '#FFB0E0';
        break;
      case 'School & Work':
        categoryColor = '#E2C6FF';
        break;
      // Add more cases for each category
    }
  
    return (
      <TouchableOpacity
        style={styles.articleContainer}
        onPress={() => handleArticlePress(item.Url)}
      >
        <Text style={[styles.articleCategory, { color: categoryColor }]}>
          {item.Category}
        </Text>
        <Text style={[styles.articleTitle]}>
          {item.Title}
        </Text>
      </TouchableOpacity>
    );
  };
  
  

  const filterArticles = () => {
    let filteredArticles = articles;

    if (filter !== '') {
      filteredArticles = filteredArticles.filter((article) => article.Category === filter);
    }

    if (searchQuery !== '') {
      filteredArticles = filteredArticles.filter((article) =>
        article.Title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filteredArticles;
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
      <TouchableOpacity
          style={[
            styles.filterButton,
            filter === '' && styles.filterButtonSelected,
            filter === '' && { backgroundColor: '#478C5C' },
          ]}
          onPress={() => setFilter('')}
        >
          <Text style={styles.filterButtonText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'Mental Health Literacy' && styles.filterButtonSelected,
            filter === 'Mental Health Literacy' && { backgroundColor: '#A6B0FF' },
          ]}
          onPress={() => setFilter('Mental Health Literacy')}
        >
          <Text style={styles.filterButtonText}>Mental Health Literacy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'Relationships' && styles.filterButtonSelected,
            filter === 'Relationships' && { backgroundColor: '#FFB0E0' },
          ]}
          onPress={() => setFilter('Relationships')}
        >
          <Text style={styles.filterButtonText}>Relationships</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'School & Work' && styles.filterButtonSelected,
            filter === 'School & Work' && { backgroundColor: '#E2C6FF' },
          ]}
          onPress={() => setFilter('School & Work')}
        >
          <Text style={styles.filterButtonText}>School & Work</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by title"
        value={searchQuery}
        onChangeText={handleSearchQueryChange}
      />
      <FlatList
        data={filterArticles()}
        renderItem={renderArticleItem}
        keyExtractor={(item) => item.id}
        style={styles.articleList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#BFCAB4',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-evenly',
  },
  filterButton: {
    backgroundColor: '#dddddd',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 8,
    justifyContent: 'center',
    flex: 1,
    margin:2,
  },
  filterButtonSelected: {
    backgroundColor: 'blue',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 8,
    justifyContent: 'center',
    flex: 1,
    margin: 2,
  },
  filterButtonText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'popSemiBold',
    fontSize: 11,
  },
  searchInput: {
    height: 40,
    borderColor: 'grey',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    fontFamily: 'popRegular',
    borderRadius: 20,
    backgroundColor: 'white',
  },
  articleList: {
    flex: 1,
  },
  articleContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  articleTitle: {
    fontSize: 18,
    fontFamily: 'popSemiBold',
    marginBottom: 8,
  },
  articleCategory: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 8,
    fontFamily: 'popRegular',
  },
  articleLink: {
    fontSize: 14,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default MentalHealthScreen;
