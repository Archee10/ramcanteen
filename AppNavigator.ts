import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Define the type for items
export type Item = {
  name: string;
  price: string;
  image: any; // Use a specific type if applicable
};

// Define the stack navigator type
export type RootStackParamList = {
  SignUp: undefined;
  Login: undefined;
  Home: undefined;
  Profile: { wishlistItems: Item[] };
  Favorites: undefined;
  Cart: undefined;
  Orders: undefined;
  UserDetails: undefined;
  Snacks: undefined;
  Sandwich: undefined;
  CategoryItems: { categoryName: string,userID: string  };
  ItemDetails: { itemName: string };
  Reviews: undefined; 
  
};

// Export screen props for specific screens if needed
export type CategoryItemsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'CategoryItems'
>;
