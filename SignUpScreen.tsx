import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the type for your navigation routes
type RootStackParamList = {
  SignUp: undefined;
  Login: undefined;
  UserDetails: undefined; // Ensure UserDetails route is defined
};

// Define the navigation prop type
type SignUpScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SignUp'
>;

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [userClass, setUserClass] = useState<string>('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phoneNumber: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSignUp = async () => {
    if (
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      !phoneNumber ||
      !department ||
      !userClass
    ) {
      Alert.alert('Validation Error', 'All fields are required');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    try {
      // API call to register user
      const response = await axios.post('http://192.168.2.7:5000/api/signup', {
        username,
        email,
        password,
        phoneNumber,
        department,
        userClass,
      });

      Alert.alert('Success', response.data.message);

      // Store user details in AsyncStorage
      const userDetails = {
        username,
        email,
        phoneNumber,
        department,
        userClass,
      };
      await AsyncStorage.setItem('userDetails', JSON.stringify(userDetails));

      // Navigate to UserDetails screen
      navigation.navigate('Login');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'An error occurred';
      Alert.alert('Error', errorMessage);
      console.error('Error details:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        maxLength={10}
      />
      <TextInput
        style={styles.input}
        placeholder="Department"
        value={department}
        onChangeText={setDepartment}
      />
      <TextInput
        style={styles.input}
        placeholder="Class"
        value={userClass}
        onChangeText={setUserClass}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignUp} />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 12,
    borderRadius: 4,
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#007BFF',
  },
});

export default SignUpScreen;
