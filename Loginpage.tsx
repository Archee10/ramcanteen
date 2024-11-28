import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define your navigation stack parameter list
type RootStackParamList = {
  Home: undefined;
  Login: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const Loginpage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Use the typed navigation hook
  const navigation = useNavigation<LoginScreenNavigationProp>();

  // Handle the login process
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('All fields are required');
      return;
    }

    try {
      // API call to login user
      const response = await axios.post('http://192.168.209.68:5000/api/login', {
        username,
        password,
      });

      const user = response.data.user;

      if (user) {
        await AsyncStorage.setItem('userDetails', JSON.stringify(user)); // Store user details in AsyncStorage
        await AsyncStorage.setItem('userSession', 'true'); // Set a session key to indicate user is logged in
        Alert.alert(response.data.message); // Success message
        navigation.navigate('Home'); // Redirect to Home screen after login
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        Alert.alert(error.response.data.error); // Show error message from server
      } else {
        Alert.alert('An error occurred'); // Generic error message
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    borderRadius: 4,
  },
});

export default Loginpage;
