import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types
type CartItem = {
  name: string;
  price: string;
  customization?: string;
  image: any;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
};

// Create CartContext
const CartContext = createContext<CartContextType | undefined>(undefined);

// CartProvider to wrap around components
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  const removeFromCart = (item: CartItem) => {
    setCart((prevCart) => prevCart.filter((cartItem) => cartItem.name !== item.name));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use CartContext
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
