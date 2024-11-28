import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './AppNavigator'; // Adjust the path if needed
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

type HomeScreenNavigationProp = NavigationProp<RootStackParamList, 'Home'>;

const categories = [
  { name: 'Juice', image: require('./beverages.jpeg') },
  { name: 'Snacks', image: require('./snacks.jpeg') },
  { name: 'Sandwich', image: require('./sandwich.jpeg') },
  { name: 'Pasta', image: require('./pasta.jpeg') },
  { name: 'Rolls', image: require('./breadroll.jpeg') },
  { name: 'Chinese', image: require('./chinese.jpeg') },
  { name: 'Frankie', image: require('./roll.jpeg') },
  { name: 'Pizza', image: require('./pizza.jpeg') },
  { name: 'Energy Zone', image: require('./energy.jpeg') },
  { name: 'Garlic Bread', image: require('./breadroll.jpeg') },
];

const Home: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(categories);

  // Check user session when the screen loads
  useEffect(() => {
    const checkSession = async () => {
      const userSession = await AsyncStorage.getItem('userSession');
      const userDetails = await AsyncStorage.getItem('userDetails');

      if (!userSession || !userDetails) {
        navigation.navigate('Login');
      } else {
        const user = JSON.parse(userDetails);
        console.log('User Details:', user);
      }
    };
    checkSession();
  }, [navigation]);

  // Filter categories based on search query
  useEffect(() => {
    const results = categories.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCategories(results);
  }, [searchQuery]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>CanteenMate</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={require('./logo2.jpg')}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for menu items..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)} // Update search query on text input
        />
      </View>
      <Text style={styles.welcomeText}>Welcome to CanteenMate!</Text>
      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Menu Categories</Text>
        <View style={styles.categoriesGrid}>
          {filteredCategories.map((category) => (
            <TouchableOpacity
              key={category.name}
              style={styles.categoryContainer}
              onPress={() =>
                navigation.navigate('CategoryItems', { categoryName: category.name })
              }
            >
              <Image source={category.image} style={styles.categoryImage} />
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 15,
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#d2691e',
  },
  categoriesContainer: {
    marginBottom: 30,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryContainer: {
    width: '48%', // Ensures two containers per row
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2, // Adds shadow for Android
    shadowColor: '#000', // Adds shadow for iOS
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
  },
  categoryImage: {
    width: '100%',
    height: 120,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
    color: '#333',
  },
});

export default Home;
