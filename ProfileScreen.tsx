import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './AppNavigator'; // Adjust the path as needed
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFavorites } from './FavoritesContext';

// Define the type for props coming from navigation
type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { favorites } = useFavorites();
  const [orders, setOrders] = useState<any[]>([]);
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const storedOrders = JSON.parse(await AsyncStorage.getItem('orders') || '[]');
      setOrders(storedOrders);
      const details = await AsyncStorage.getItem('userDetails');
      setUserDetails(details ? JSON.parse(details) : null);
    };

    fetchOrders();    
  }, []);

  const handleLogout = async () => {
    try {
      // Clear session data and other relevant information
      await AsyncStorage.removeItem('userSession');
      await AsyncStorage.removeItem('userData'); // If you store user data in AsyncStorage, clear it as well
      await AsyncStorage.removeItem('userDetails');
      // Optionally, clear any other data related to the user (e.g., favorites, orders)
      await AsyncStorage.removeItem('favorites');
      await AsyncStorage.removeItem('orders');
  
      // Navigate to Login page after clearing data
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>My Profile</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UserDetails')}>
        <Text style={styles.buttonText}>User Details</Text>
      </TouchableOpacity>

      <TouchableOpacity
  style={styles.button}
  onPress={() => navigation.navigate('Orders')}
>
  <Text style={styles.buttonText}>Your Orders</Text>
</TouchableOpacity>

      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Favorites')}
      >
        <Text style={styles.buttonText}>Favorites ({favorites.length})</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Reviews')}>
  <Text style={styles.buttonText}>Reviews</Text>
</TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Cart')} // Navigate to CartScreen
      >
        <Text style={styles.buttonText}>Cart</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
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
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#d2691e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  orderName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderPrice: {
    fontSize: 16,
    marginTop: 5,
  },
  noOrdersText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
});

export default ProfileScreen;
