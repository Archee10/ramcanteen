import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Define the item type
export type Item = { id?: number; name: string; price: string; image: any }; // Include _id in the type

// Define the context types
export type FavoritesContextType = {
  favorites: Item[];
  addToFavorites: (item: Item) => void;
  removeFromFavorites: (item: Item) => void;
  isFavorite: (item: Item) => boolean;
  fetchFavorites: (userId: string) => void;
};

// Create the context
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

type FavoritesProviderProps = { children: ReactNode };

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Item[]>([]);
  const [userId, setUserId] = useState<string | null>(null); // Store userId in state

  // Function to get userId from AsyncStorage
  const getUserIdFromAsyncStorage = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id'); // Replace with your actual key
      if (userId) {
        setUserId(userId); // Set the userId in state
      }
    } catch (error) {
      console.error('Error fetching userId from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    getUserIdFromAsyncStorage(); // Get userId when the component mounts
  }, []);

  const fetchFavorites = async (userId: string) => {
    try {
      const response = await axios.get(`http://192.168.2.7:5000/api/wishlist/${userId}`);
      if (response.data && response.data.wishlist) {
        // Assuming response.data.wishlist contains an array of items with full details
        setFavorites(response.data.wishlist.map((w: any) => ({
          ...w.item_, 
          userId: userId // Attach userId to each item
        })));
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching favorites:', error);
        alert(`Error: ${error.response?.data.error}`);
      } else {
        console.error('Unexpected error:', error);
        alert('Network error occurred while fetching favorites');
      }
    }
  };
  

  useEffect(() => {
    if (userId) {
      fetchFavorites(userId); // Fetch favorites only if userId is available
    }
  }, [userId]);

  const addToFavorites = async (item: Item) => {
    console.log(item);
    try {
        if (!userId) {
            throw new Error('User ID is missing');
        }

        if (!item.name) {
            throw new Error('Item name is missing');
        }

        // Fetch the item ID from the database using item.name
        const response = await axios.get(`http://192.168.2.7:5000/api/fetch?name=${encodeURIComponent(item.name)}`);
        const dbItem = response.data;

        if (!dbItem || !dbItem.id) {
            throw new Error('Item not found in the database');
        }

        const itemId = dbItem.id; // Retrieve the ID from the database

        console.log(itemId);

        // Proceed with adding to the wishlist
        await axios.post('http://192.168.2.7:5000/api/wishlist', { userId, itemId });
        setFavorites((prevFavorites) => [...prevFavorites, item]);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error('Error adding to favorites:', error);
            alert(`Error: ${error.response?.data.error}`);
        } else {
            console.error('Unexpected error:', error);
            alert('Network error occurred while adding to favorites');
        }
    }
};


  const removeFromFavorites = async (item: Item) => {
    try {
      const response = await axios.get(`http://192.168.2.7:5000/api/fetch?name=${encodeURIComponent(item.name)}`);
        const dbItem = response.data;

        if (!dbItem || !dbItem.id) {
            throw new Error('Item not found in the database');
        }

        const itemID = dbItem.id; // Retrieve the ID from the database

      if (!userId || !itemID) {
        throw new Error('User ID or Item ID is missing');
      }

      // Ensure item.id is treated as a string
      const itemId = typeof item.id === 'string' ? item.id : String(item.id);

      await axios.delete('http://192.168.2.7:5000/api/wishlist', { data: { userId, itemId } });
      setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.id !== item.id));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error removing from favorites:', error);
        alert(`Error: ${error.response?.data.error}`);
      } else {
        console.error('Unexpected error:', error);
        alert('Network error occurred while removing from favorites');
      }
    }
  };

  const isFavorite = (item: Item) => {
    return favorites.some((fav) => fav.id === item.id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite, fetchFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
