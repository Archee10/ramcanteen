import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the type for a review
interface Review {
  _id: string;
  user_id: string;
  item: string;
  review: string;
  rating: number;
}

const ReviewsScreen = () => {
  const [reviews, setReviews] = useState<Review[]>([]); // Define the type for reviews array
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState<number>(1); // Ensure rating is a number
  const [item, setItem] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      const userId = await AsyncStorage.getItem('user_id');
      if (userId) {
        try {
          const response = await fetch(`http://192.168.2.7:5000/api/reviews/${userId}`);
          const data: Review[] = await response.json(); // Explicitly type the response
          setReviews(data);
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
      }
    };

    fetchReviews();
  }, []);

  const handleAddReview = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    if (!userId) {
      Alert.alert('Error', 'User not found. Please log in.');
      return;
    }

    const trimmedReview = newReview.trim();
    const trimmedItem = item.trim();

    if (trimmedReview && trimmedItem && rating) {
      const reviewData: Review = {
        _id: Math.random().toString(), // Temporary ID
        user_id: userId,
        item: trimmedItem,
        review: trimmedReview,
        rating,
      };

      try {
        const response = await fetch('http://192.168.2.7:5000/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reviewData),
        });
        const data = await response.json();

        if (data.message === 'Review added successfully') {
          setReviews([...reviews, reviewData]);
          setNewReview('');
          setItem('');
          setRating(1);
        } else {
          Alert.alert('Error', 'Failed to add review.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to connect to the server.');
      }
    } else {
      Alert.alert('Please fill all fields.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reviews</Text>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <Text style={styles.reviewText}>{item.item}</Text>
            <Text style={styles.reviewText}>Rating: {item.rating} stars</Text>
            <Text style={styles.reviewText}>{item.review}</Text>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Item Name"
        value={item}
        onChangeText={setItem}
      />
      <TextInput
        style={styles.input}
        placeholder="Your Review"
        value={newReview}
        onChangeText={setNewReview}
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
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 10 },
  reviewCard: { marginBottom: 15, backgroundColor: '#fff', padding: 10 },
  reviewText: { fontSize: 16 },
  button: { backgroundColor: '#007BFF', padding: 10 },
  buttonText: { color: '#fff', textAlign: 'center' },
});

export default ReviewsScreen;