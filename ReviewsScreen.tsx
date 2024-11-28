import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './AppNavigator'; // Import your RootStackParamList

// Define the type for the navigation props
type ReviewsScreenProps = NativeStackScreenProps<RootStackParamList, 'Reviews'>;

const ReviewsScreen: React.FC<ReviewsScreenProps> = ({ navigation }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(1); // Rating from 1 to 5
  const [item, setItem] = useState('');

  // Fetch reviews when component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      const userId = await AsyncStorage.getItem('user_id'); // Get user ID from AsyncStorage
      if (userId) {
        const response = await fetch(`https://your-api-url/reviews/${userId}`);
        const data = await response.json();
        setReviews(data); // Set reviews state with fetched data
      }
    };

    fetchReviews();
  }, []);

  const handleAddReview = async () => {
    const userId = await AsyncStorage.getItem('user_id'); // Get user ID from AsyncStorage

    if (newReview.trim() && item.trim() && userId) {
      const newReviewData = {
        user_id: userId,
        item: item,
        review: newReview,
        rating: rating,
      };

      try {
        const response = await fetch('https://your-api-url/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newReviewData),
        });

        const data = await response.json();
        if (data.message === 'Review added successfully') {
          // Update the UI to show the new review
          setReviews([...reviews, newReviewData]);
          setNewReview('');
          setItem('');
          setRating(1);
        } else {
          Alert.alert('Error', 'There was an issue adding your review');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'There was an issue connecting to the server');
      }
    } else {
      Alert.alert('Please fill all fields');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reviews</Text>

      {/* Show Existing Reviews */}
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <Text style={styles.reviewText}>
              <Text style={styles.italic}>{item.item}</Text>
            </Text>
            <Text style={styles.reviewText}>Rating: {item.rating} stars</Text>
            <Text style={styles.reviewText}>{item.review}</Text>
          </View>
        )}
      />

      {/* Add New Review Section */}
      <TextInput
        style={styles.input}
        placeholder="Item Name"
        value={item}
        onChangeText={(text) => setItem(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Your Review"
        value={newReview}
        onChangeText={(text) => setNewReview(text)}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Rating (1-5)"
        value={rating.toString()}
        keyboardType="numeric"
        onChangeText={(text) => setRating(Number(text))}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddReview}>
        <Text style={styles.buttonText}>Add Review</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  reviewCard: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  reviewText: {
    fontSize: 16,
    color: '#333',
  },
  italic: {
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#d2691e',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReviewsScreen;
