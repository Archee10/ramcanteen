import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useCart } from './CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartScreen: React.FC = () => {
  const { cart, removeFromCart } = useCart();

  const handleConfirmOrder = async (item: any) => {
    try {
      // Retrieve existing orders from AsyncStorage
      const storedOrders = JSON.parse(await AsyncStorage.getItem('orders') || '[]');
      
      // Add the new item to the orders list
      const updatedOrders = [...storedOrders, item];
      await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));

      // Remove the item from the cart
      removeFromCart(item);

      Alert.alert('Success', 'Order Confirmed!');
    } catch (error) {
      console.error('Error confirming order:', error);
      Alert.alert('Error', 'Failed to confirm the order. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Your Cart</Text>
      {cart.length > 0 ? (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Image source={item.image} style={styles.itemImage} />
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>{item.price}</Text>
              {item.customization && (
                <Text style={styles.customizationText}>Customization: {item.customization}</Text>
              )}
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromCart(item)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => handleConfirmOrder(item)}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyCartText}>Your cart is empty.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  headerText: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  itemContainer: { backgroundColor: '#fff', padding: 15, marginBottom: 15, borderRadius: 10 },
  itemImage: { width: '100%', height: 200, marginBottom: 10 },
  itemName: { fontSize: 18, fontWeight: 'bold' },
  itemPrice: { fontSize: 16, marginBottom: 10 },
  customizationText: { fontSize: 14, marginBottom: 10 },
  removeButton: { padding: 10, backgroundColor: '#ff6347', alignItems: 'center' },
  removeButtonText: { color: '#fff', fontWeight: 'bold' },
  confirmButton: { padding: 10, backgroundColor: '#32CD32', alignItems: 'center', marginTop: 10 },
  confirmButtonText: { color: '#fff', fontWeight: 'bold' },
  emptyCartText: { fontSize: 18, textAlign: 'center', marginTop: 50, color: '#888' },
});

export default CartScreen;
