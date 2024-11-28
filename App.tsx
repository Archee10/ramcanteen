import React, { FC } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from './SignUpScreen';
import Loginpage from './Loginpage';
import Home from './Home';
import ProfileScreen from './ProfileScreen';
import CategoryItemsScreen from './CategoryItemsScreen';
import FavoritesScreen from './FavoritesScreen';
import CartScreen from './CartScreen';
import { RootStackParamList } from './AppNavigator';
import { CartProvider } from './CartContext';
import { FavoritesProvider } from './FavoritesContext';
import OrdersScreen from './OrdersScreen';
import UserDetailsScreen from './UserDetailsScreen';
import ReviewsScreen from './ReviewsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: FC = () => {
  return (
    <CartProvider>
      <FavoritesProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="SignUp">
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Login" component={Loginpage} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="CategoryItems" component={CategoryItemsScreen}/>
            <Stack.Screen name="Favorites" component={FavoritesScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Orders" component={OrdersScreen} />
            <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
            <Stack.Screen name="Reviews" component={ReviewsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </FavoritesProvider>
    </CartProvider>
  );
};

export default App;
