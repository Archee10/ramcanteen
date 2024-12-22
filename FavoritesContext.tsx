import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the item type
export type Item = { name: string; price: string; image: any };

// Define the context types
export type FavoritesContextType = {
  favorites: Item[];
  addToFavorites: (item: Item) => void;
  removeFromFavorites: (item: Item) => void;
  isFavorite: (item: Item) => boolean;
};

// Create the context
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Define the props for the FavoritesProvider
type FavoritesProviderProps = {
  children: ReactNode;
};

// Create a provider component
export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Item[]>([]);

  // Function to add item to favorites
  const addToFavorites = (item: Item) => {
    setFavorites((prevFavorites) => {
      // Prevent duplicates by checking if the item already exists
      if (prevFavorites.some(fav => fav.name === item.name)) {
        return prevFavorites; // Item already in favorites, don't add again
      }
      return [...prevFavorites, item];
    });
  };

  // Function to remove item from favorites
  const removeFromFavorites = (item: Item) => {
    setFavorites((prevFavorites) => prevFavorites.filter(fav => fav.name !== item.name));
  };

  // Function to check if item is in favorites
  const isFavorite = (item: Item) => {
    return favorites.some(fav => fav.name === item.name);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook to use the favorites context
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};