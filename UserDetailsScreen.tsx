import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  UserDetails: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'UserDetails'>;

const UserDetailsScreen: React.FC = () => {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const details = await AsyncStorage.getItem('userDetails');
        if (details) {
          setUserDetails(JSON.parse(details));
        } else {
          Alert.alert('No user details found, please log in.');
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6347" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>User Details</Text>
      {userDetails ? (
        <View style={styles.card}>
          <View style={styles.detailRow}>
            <Text style={styles.icon}>👤</Text>
            <Text style={styles.detailText}>Username: <Text style={styles.detailValue}>{userDetails.username}</Text></Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.icon}>📧</Text>
            <Text style={styles.detailText}>Email: <Text style={styles.detailValue}>{userDetails.email}</Text></Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.icon}>📞</Text>
            <Text style={styles.detailText}>Phone: <Text style={styles.detailValue}>{userDetails.phoneNumber}</Text></Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.icon}>💼</Text>
            <Text style={styles.detailText}>Department: <Text style={styles.detailValue}>{userDetails.department}</Text></Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.icon}>🏫</Text>
            <Text style={styles.detailText}>Class: <Text style={styles.detailValue}>{userDetails.userClass}</Text></Text>
          </View>
        </View>
      ) : (
        <Text style={styles.noDetailsText}>No details available.</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F8FF', // Light background color
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8DC', // Cream background while loading
  },
  loadingText: {
    fontSize: 18,
    color: '#ff6347',
    marginTop: 10,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff6347', // Purple color for header
    marginBottom: 30,
    textShadowColor: '#2c3e50',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    marginBottom: 30,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    fontSize: 24,
    color: '#2980b9', // Blue color for icons
  },
  detailText: {
    fontSize: 18,
    color: '#34495e', // Darker text for readability
    marginLeft: 10,
  },
  detailValue: {
    fontWeight: '600',
    color: '#2980b9', // Blue color for values
  },
  noDetailsText: {
    fontSize: 18,
    color: '#e74c3c', // Red color for errors
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#ff6347', // Orange color for button
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    elevation: 5,
    transform: [{ scale: 1 }],
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default UserDetailsScreen;
