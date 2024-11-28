import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrdersScreen: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const storedOrders = JSON.parse(await AsyncStorage.getItem('orders') || '[]');
      setOrders(storedOrders);
    };

    fetchOrders();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Your Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(item, index) => index.toString()} // Using index as the keyExtractor
        renderItem={({ item }) => (
          <View style={styles.orderContainer}>
            <Text style={styles.orderName}>{item.name}</Text>
            <Text style={styles.orderPrice}>{item.price}</Text>
            {item.customization && (
              <Text style={styles.customizationText}>Customization: {item.customization}</Text>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noOrdersText}>No Orders Yet</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  headerText: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  orderContainer: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 10 },
  orderName: { fontSize: 18, fontWeight: 'bold' },
  orderPrice: { fontSize: 16, marginTop: 5 },
  customizationText: { fontSize: 14, marginTop: 5 },
  noOrdersText: { textAlign: 'center', fontSize: 16, color: '#888' },
});

export default OrdersScreen;
