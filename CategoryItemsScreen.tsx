import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { useFavorites } from './FavoritesContext'; // Context for Favorites
import { useCart } from './CartContext'; // Context for Cart

// Define a type for the categories data
type CategoryData = {
  [key: string]: { name: string; price: string; image: any }[];
};

const categoriesData: CategoryData = {
  Juice: [
    { name: 'Orange Juice', price: '₹65', image: require('./orangejuice.jpeg') },
    { name: 'Watermelon Juice', price: '₹65', image: require('./watermelonjuice.jpeg') },
    { name: 'Oreo Milkshake', price: '₹80', image: require('./oreomilkshake.jpeg') },
    { name: 'Chocolate Milkshake', price: '₹80', image: require('./chocolatemilkshake.jpeg') },
    { name: 'Banana Milkshake', price: '₹75', image: require('./bananamilkshake.jpeg') },
    { name: 'Nutella Milkshake', price: '₹80', image: require('./nutellamilkshake.jpeg') },
    { name: 'Cold Coffee', price: '₹60', image: require('./coldcofee.jpeg') },
    { name: 'Cold Coffee with Chocolate Shake', price: '₹90', image: require('./coldcofeechocolate.jpeg') },
  ],
  Snacks: [
    { name: 'Tea', price: '18', image: require('./tea.jpeg') },
    { name: 'Coffee', price: '25', image: require('./coffee1.jpg') },
    { name: 'Daal Rice', price: '50', image: require('./dalrice.jpeg') },
    { name: 'Idli Vada', price: '45', image: require('./idlivada.jpeg') },
    {name: 'Poha', price: '35', image: require('./poha.jpg') },
    { name: 'Samosa Chat', price: '45', image: require('./samosachat.jpg') },
    { name: 'Samosa', price: '₹20', image: require('./samosa.jpeg') },
    { name: 'Vada Pav', price: '₹15', image: require('./vadapav.jpeg') },
    { name: 'Bread Pakoda', price: '20', image: require('./breadpakoda.jpg') },
    { name: 'Bun Maska', price: '25', image: require('./bunmaska.jpeg') },
    { name: 'Schez. Samosa Pav', price: '35', image: require('./samosa.jpeg') },
    { name: 'Schez. Vada Pav', price: '35', image: require('./vadapav.jpeg') },
  ],
  Sandwich: [
    { name: 'Veg Sandwich', price: '₹40', image: require('./vegsandwich.jpeg') },
    { name: 'Toast Sandwich', price: '₹50', image: require('./toastsandwich.jpeg') },
    { name: 'Masala Sandwich', price: '₹60', image: require('./masalasandwich.jpeg') },
    { name: 'Cheese Masala Toast', price: '₹70', image: require('./cheesemasalatoast.jpeg') },
    { name: 'Samosa Toast', price: '₹60', image: require('./samosatoast.jpeg') },
    { name: 'Samosa Cheese Toast', price: '₹70', image: require('./samosatoast.jpeg') },
    { name: 'Bread Butter Toast', price: '₹30', image: require('./breadbutter.jpeg') },
    { name: 'Plain Cheese Toast', price: '₹50', image: require('./cheesetoast.jpeg') },
    { name: 'Mayo Grill Sandwich', price: '₹65', image: require('./mayogrill.jpeg') },
    { name: 'Plain Cheese Sandwich', price: '₹45', image: require('./plaincheesesandwich.jpeg') },
    { name: 'Jam Toast', price: '₹35', image: require('./jamtoast.jpeg') },
    { name: 'Jam Cheese Toast', price: '₹45', image: require('./jamcheese.jpeg') },
    { name: 'Aloo Sandwich', price: '₹50', image: require('./aloosandwich.jpeg') },
    { name: 'Veg Chili Toast', price: '₹55', image: require('./chillitoast.jpeg') },
    { name: 'Chili Cheese Sandwich', price: '₹85', image: require('./chillicheesesandwich.jpeg') },
    { name: 'Corn Chili Cheese Toast', price: '₹80', image: require('./cornchillitoast.jpeg') },
    { name: 'Veg Cheese Toast', price: '₹85', image: require('./vegcheesetoast.jpeg') },
    { name: 'Veg Chili Mayo Toast', price: '₹85', image: require('./chillitoast.jpeg') },
    { name: 'Cheese Chili Paneer Toast', price: '₹65', image: require('./chillipaneertoast.jpeg') },
    { name: 'Veg Mayo Paneer Cheese', price: '₹90', image: require('./paneersandwich.jpeg') },
    { name: 'Brown Bread Sandwich', price: '₹100', image: require('./brownbread.jpeg') },
    { name: 'Nutella Chocolate Sandwich', price: '₹50', image: require('./nutellasandwich.jpeg') },
    { name: 'Nutella Oreo Sandwich', price: '₹65', image: require('./nutellasandwich.jpeg') },
    { name: 'Cheese Manchurian Toast Sandwich', price: '₹75', image: require('./manchriantoast.jpeg') },
    { name: 'Cheese Pasta Toast Sandwich', price: '₹80', image: require('./pastasandwich.jpeg') },
    { name: 'Chips Cheese Sandwich', price: '₹80', image: require('./chipssandwich.jpeg') },
    { name: 'Chips Noodles Toast Sandwich', price: '₹80', image: require('./noodlessandwich.jpeg') },
    { name: 'Russian Salad Cheese Sandwich', price: '₹80', image: require('./russiansaladsandwich.jpeg') },
],

  Pasta: [
    { name: 'Red Pasta', price: '₹130', image: require('./redpasta.jpeg') },
  { name: 'White Pasta', price: '₹130', image: require('./whitepasta.jpeg') },
  { name: 'Mix Pasta', price: '₹130', image: require('./mixpasta.jpeg') },
  { name: 'Corn Pasta', price: '₹130', image: require('./cornpasta.jpeg') },
  { name: 'Cheese Pasta', price: '₹130', image: require('./cheesepasta.jpeg') },
  { name: 'Desi Risotto', price: '₹130', image: require('./desiriscotti.jpeg') },
  ],
  Rolls: [
    { name: 'Paneer Tikka Bread Roll', price: '₹100', image: require('./paneertikkabreadroll.jpeg') },
    { name: 'Veg Bread Roll', price: '₹70', image: require('./vegrbreadroll.jpeg') },
    { name: 'Veg Cheese Bread Roll', price: '₹80', image: require('./cheesebreadroll.jpeg') },
    { name: 'Paneer Cheese Bread Roll', price: '₹120', image: require('./paneertikkabreadroll.jpeg') },
    { name: 'Chilli Cheese Bread Roll', price: '₹110', image: require('./chillicheeseroll.webp') },
    { name: 'Pasta Cheese Bread Roll', price: '₹100', image: require('./vegrbreadroll.jpeg') },
    { name: 'Corn Cheese Mayo Bread Roll', price: '₹90', image: require('./vegrbreadroll.jpeg') },
    { name: 'Noodle Cheese Bread Roll', price: '₹90', image: require('./vegrbreadroll.jpeg') },
    { name: 'Manchurian Cheese Bread Roll', price: '₹95', image: require('./vegrbreadroll.jpeg') },
    { name: 'Mix Cheese Bread Roll', price: '₹130', image: require('./vegrbreadroll.jpeg') },
    { name: 'Veg Cheese Mayo Bread Roll', price: '₹130', image: require('./vegrbreadroll.jpeg') },
    { name: 'Garlic Paneer Cheese Bread Roll', price: '₹140', image: require('./vegrbreadroll.jpeg') },
    { name: 'Russian Salad Bread Roll', price: '₹85', image: require('./vegrbreadroll.jpeg') },
    { name: 'Russian Salad Cheese Bread Roll', price: '₹90', image: require('./vegrbreadroll.jpeg') },
    { name: 'Corn Garlic Paneer Bread Roll', price: '₹140', image: require('./vegrbreadroll.jpeg') },
],

  Chinese: [
    { name: 'Fried / Schezwan Rice', price: '₹100', image: require('./schezwanrice.jpeg') },
  { name: 'Hakka / Schezwan Noodles', price: '₹130', image: require('./schezwannoodles.jpeg') },
  { name: 'Paneer Rice', price: '₹140', image: require('./paneerrice.jpeg') },
  { name: 'Melon Paneer Rice', price: '₹120', image: require('./paneerrice.jpeg') },
  { name: 'Triple Schezwan Rice', price: '₹140', image: require('./tripleschezwanrice.jpeg') },
  { name: 'Manchurian - Gravy / Dry', price: '₹120', image: require('./manchurian.jpeg') },
  { name: 'Corn Fried Rice', price: '₹110', image: require('./cornfriedrice.jpeg') },
  { name: 'Garlic Corn Rice', price: '₹120', image: require('./cornfriedrice.jpeg') },
  { name: 'Lemon Garlic Rice', price: '₹140', image: require('./lemongarlicrice.jpeg') },
  { name: 'Paneer Schezwan Rice / Chilly', price: '₹130', image: require('./paneerchilli.jpeg') },
  { name: 'Manchurian Noodles / Rice', price: '₹120', image: require('./paneerchilli.jpeg') },
  { name: 'Chilly Garlic Noodles', price: '₹130', image: require('./chilligarlicnoodles.jpeg') },
  { name: 'Garlic Paneer Noodles', price: '₹120', image: require('./garlicpaneernoodles.jpeg') },
  { name: 'Hot Chinese Bhel', price: '₹120', image: require('./chinesebhel..jpeg') },
  ],
  Frankie: [
    { name: 'Veg Frankie', price: '₹45', image: require('./vegfrankie.jpeg') },
  { name: 'Paneer Cheese Frankie', price: '₹90', image: require('./paneercheesefrankie.jpeg') },
  { name: 'Noodles Frankie', price: '₹70', image: require('./noodlesfrankie.jpeg') },
  { name: 'Pasta Cheese Frankie', price: '₹90', image: require('./pastafrankie.jpeg') },
  { name: 'Cheese Manchurian Frankie', price: '₹80', image: require('./manchurianfrankie.jpeg') },
  { name: 'Samosa Cheese Frankie', price: '₹70', image: require('./samosafrankie.jpeg') },
  { name: 'Schezwan Cheese Frankie', price: '₹70', image: require('./schezwanfrankie.jpeg') },
  { name: 'Cheese Noodles Schezwan Frankie', price: '₹70', image: require('./noodlesfrankie.jpeg') },
  { name: 'Mayo Schezwan Frankie', price: '₹60', image: require('./schezwanfrankie.jpeg') },
  { name: 'Mayo Cheese Schezwan Frankie', price: '₹70', image: require('./schezwanfrankie.jpeg') },
  { name: 'Mix Spl. Frankie', price: '₹90', image: require('./mixfrankie.jpeg') },
  { name: 'Chinese Bhel Frankie', price: '₹100', image: require('./chinesebhelfrankie.jpeg') },
  { name: 'Manchurian Schezwan Frankie', price: '₹70', image: require('./manchurianfrankie.jpeg') },
  { name: 'Cheese Manchurian Schezwan Frankie', price: '₹80', image: require('./manchurianfrankie.jpeg') },
  { name: 'Paneer Schezwan Frankie', price: '₹80', image: require('./paneerschezwanfrankie.jpeg') },
  { name: 'Cheese Paneer Schezwan Frankie', price: '₹90', image: require('./paneerschezwanfrankie.jpeg') },
  ],
  Pizza: [
    { name: 'Plain Cheese Pizza', price: '₹110', image: require('./plaincheesepizza.jpeg') },
  { name: 'Capsicum Cheese Pizza', price: '₹120', image: require('./capsicumcheesepizza.jpeg') },
  { name: 'Veg. Cheese Pizza', price: '₹130', image: require('./vegcheesepizza.jpeg') },
  { name: 'Paneer Cheese Pizza', price: '₹130', image: require('./paneercheesepizza.jpeg') },
  { name: 'Spl. Cheese Mix', price: '₹140', image: require('./mixpizza.jpeg') },
  { name: 'Garlic Cheese Pizza', price: '₹150', image: require('./garliccheesepizza.jpeg') },
  { name: 'Paneer Chilli Cheese', price: '₹150', image: require('./paneerchillipizza.jpeg') },
  { name: 'Manchurian Cheese Pizza', price: '₹150', image: require('./manchuriancheesepizza.jpeg') },
  { name: 'Noodles Cheese Pizza', price: '₹130', image: require('./noodlespizza.jpeg') },
  { name: 'Pasta Cheese Pizza', price: '₹130', image: require('./pastapizza.jpeg') },
  ],
  'Energy Zone': [
    { name: 'Red Bull', price: '₹125', image: require('./redbull.jpeg') },
  ],
  'Garlic Bread': [
    { name: 'Garlic Cheese Bread', price: '₹100', image: require('./garlicbread.jpeg') },
  { name: 'Garlic Corn Cheese Bread', price: '₹110', image: require('./garliccornbread.jpeg') },
  { name: 'Garlic Paneer Cheese Bread', price: '₹130', image: require('./garlicpaneerbread.jpeg') },
  { name: 'Garlic Corn Paneer Cheese Bread', price: '₹140', image: require('./garliccornpaneerbread.jpeg') },
  { name: 'Garlic Corn Paneer Mayo Cheese Bread', price: '₹150', image: require('./garliccornpaneerbread.jpeg') },
  ],
};

const CategoryItemsScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  // Ensure `categoryName` is one of the keys in `categoriesData`
  const { categoryName } = route.params as { categoryName: keyof typeof categoriesData };
  const items = categoriesData[categoryName] || [];

  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { addToCart } = useCart();
  const [customizations, setCustomizations] = useState<{ [key: string]: string }>({});

  const handleCustomizationChange = (text: string, itemName: string) => {
    setCustomizations({ ...customizations, [itemName]: text });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{categoryName}</Text>
      {items.length > 0 ? (
        <FlatList
          data={items}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => {
            const favorited = isFavorite(item);
            return (
              <View style={styles.itemContainer}>
                <Image source={item.image} style={styles.itemImage} />
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>{item.price}</Text>
                <TextInput
                  placeholder="Customization (optional)"
                  value={customizations[item.name] || ''}
                  onChangeText={(text) => handleCustomizationChange(text, item.name)}
                  style={styles.customizationInput}
                />
                <TouchableOpacity
                  style={styles.addToCartButton}
                  onPress={() => {
                    addToCart({ ...item, customization: customizations[item.name] });
                    navigation.navigate('Cart');
                  }}
                >
                  <Text style={styles.addToCartButtonText}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.wishlistButton}
                  onPress={() => {
                    favorited ? removeFromFavorites(item) : addToFavorites(item);
                  }}
                >
                  <Text style={styles.wishlistButtonText}>{favorited ? 'Wishlisted' : 'Wishlist'}</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      ) : (
        <Text style={styles.noItemsText}>No items available for this category.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  headerText: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  itemContainer: { backgroundColor: '#fff', padding: 15, marginBottom: 15, borderRadius: 10 },
  itemImage: { width: '100%', height: 200, marginBottom: 10, borderRadius: 10 },
  itemName: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  itemPrice: { fontSize: 16, marginBottom: 10, color: '#d2691e' },
  customizationInput: { height: 40, borderColor: '#ddd', borderWidth: 1, borderRadius: 5, paddingLeft: 10, marginBottom: 10 },
  addToCartButton: { backgroundColor: '#d2691e', padding: 12, borderRadius: 5, marginBottom: 10 },
  addToCartButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  wishlistButton: { backgroundColor: '#ff6347', padding: 10, borderRadius: 5 },
  wishlistButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  noItemsText: { textAlign: 'center', fontSize: 16, color: '#888' },
});

export default CategoryItemsScreen;
