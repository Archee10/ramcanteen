const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcryptjs');


// Express app setup
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: 'mongodb+srv://Archee:Archee10042005@ramcanteen.nbhhi.mongodb.net/',
    }),
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.get('/test', (req, res) => {
  console.log('Session ID:', req.sessionID); // This should work here
  res.send('Session ID logged');
});

// MongoDB connection
const dbUri = 'mongodb+srv://Archee:Archee10042005@ramcanteen.nbhhi.mongodb.net/';
mongoose
  .connect(dbUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// User Schema and Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  userClass: { type: String, required: true },
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
});

// No need to manually define _id. Mongoose will handle this.
const Item = mongoose.model('Item', itemSchema);
module.exports = Item;

// Wishlist schema
const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  createdAt: { type: Date, default: Date.now },
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;

// Orders schema
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User schema
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true }, // Reference to Item schema
      quantity: { type: Number, required: true }, // Quantity of the item ordered
      price: { type: String, required: true }, // Price of the item
    },
  ],
  totalAmount: { type: String, required: true }, // Total order amount
  orderStatus: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' }, // Status of the order
  orderDate: { type: Date, default: Date.now }, // Date when the order was placed
});

const Order = mongoose.model('Order', orderSchema);

const reviewSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  item: { type: String, required: true },
  review: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  created_at: { type: Date, default: Date.now },
});

const Review = mongoose.model('Review', reviewSchema);



// Default items to be added automatically if they don't already exist
const defaultItems = [
  // Juices
  { name: 'Orange Juice', price: '₹65', image: 'orangejuice.jpeg' },
  { name: 'Watermelon Juice', price: '₹65', image: 'watermelonjuice.jpeg' },
  { name: 'Oreo Milkshake', price: '₹80', image: 'oreomilkshake.jpeg' },
  { name: 'Chocolate Milkshake', price: '₹80', image: 'chocolatemilkshake.jpeg' },
  { name: 'Banana Milkshake', price: '₹75', image: 'bananamilkshake.jpeg' },
  { name: 'Nutella Milkshake', price: '₹80', image: 'nutellamilkshake.jpeg' },
  { name: 'Cold Coffee', price: '₹60', image: 'coldcofee.jpeg' },
  { name: 'Cold Coffee with Chocolate Shake', price: '₹90', image: 'coldcofeechocolate.jpeg' },

  // Snacks
  { name: 'Tea', price: '₹18', image: 'tea.jpeg' },
  { name: 'Coffee', price: '₹25', image: 'coffee1.jpg' },
  { name: 'Daal Rice', price: '₹50', image: 'dalrice.jpeg' },
  { name: 'Idli Vada', price: '₹45', image: 'idlivada.jpeg' },
  { name: 'Poha', price: '₹35', image: 'poha.jpg' },
  { name: 'Samosa Chat', price: '₹45', image: 'samosachat.jpg' },
  { name: 'Samosa', price: '₹20', image: 'samosa.jpeg' },
  { name: 'Vada Pav', price: '₹15', image: 'vadapav.jpeg' },
  { name: 'Bread Pakoda', price: '₹20', image: 'breadpakoda.jpg' },
  { name: 'Bun Maska', price: '₹25', image: 'bunmaska.jpeg' },
  { name: 'Schez. Samosa Pav', price: '₹35', image: 'samosa.jpeg' },
  { name: 'Schez. Vada Pav', price: '₹35', image: 'vadapav.jpeg' },

  // Sandwiches
  { name: 'Veg Sandwich', price: '₹40', image: 'vegsandwich.jpeg' },
  { name: 'Toast Sandwich', price: '₹50', image: 'toastsandwich.jpeg' },
  { name: 'Masala Sandwich', price: '₹60', image: 'masalasandwich.jpeg' },
  { name: 'Cheese Masala Toast', price: '₹70', image: 'cheesemasalatoast.jpeg' },
  { name: 'Samosa Toast', price: '₹60', image: 'samosatoast.jpeg' },
  { name: 'Samosa Cheese Toast', price: '₹70', image: 'samosatoast.jpeg' },
  { name: 'Bread Butter Toast', price: '₹30', image: 'breadbutter.jpeg' },
  { name: 'Plain Cheese Toast', price: '₹50', image: 'cheesetoast.jpeg' },
  { name: 'Mayo Grill Sandwich', price: '₹65', image: 'mayogrill.jpeg' },
  { name: 'Plain Cheese Sandwich', price: '₹45', image: 'plaincheesesandwich.jpeg' },
  { name: 'Jam Toast', price: '₹35', image: 'jamtoast.jpeg' },
  { name: 'Jam Cheese Toast', price: '₹45', image: 'jamcheese.jpeg' },
  { name: 'Aloo Sandwich', price: '₹50', image: 'aloosandwich.jpeg' },
  { name: 'Veg Chili Toast', price: '₹55', image: 'chillitoast.jpeg' },
  { name: 'Chili Cheese Sandwich', price: '₹85', image: 'chillicheesesandwich.jpeg' },
  { name: 'Corn Chili Cheese Toast', price: '₹80', image: 'cornchillitoast.jpeg' },
  { name: 'Veg Cheese Toast', price: '₹85', image: 'vegcheesetoast.jpeg' },
  { name: 'Veg Chili Mayo Toast', price: '₹85', image: 'chillitoast.jpeg' },
  { name: 'Cheese Chili Paneer Toast', price: '₹65', image: 'chillipaneertoast.jpeg' },
  { name: 'Veg Mayo Paneer Cheese', price: '₹90', image: 'paneersandwich.jpeg' },
  { name: 'Brown Bread Sandwich', price: '₹100', image: 'brownbread.jpeg' },
  { name: 'Nutella Chocolate Sandwich', price: '₹50', image: 'nutellasandwich.jpeg' },
  { name: 'Nutella Oreo Sandwich', price: '₹65', image: 'nutellasandwich.jpeg' },
  { name: 'Cheese Manchurian Toast Sandwich', price: '₹75', image: 'manchriantoast.jpeg' },
  { name: 'Cheese Pasta Toast Sandwich', price: '₹80', image: 'pastasandwich.jpeg' },
  { name: 'Chips Cheese Sandwich', price: '₹80', image: 'chipssandwich.jpeg' },
  { name: 'Chips Noodles Toast Sandwich', price: '₹80', image: 'noodlessandwich.jpeg' },
  { name: 'Russian Salad Cheese Sandwich', price: '₹80', image: 'russiansaladsandwich.jpeg' },

  // Rolls
  { name: 'Paneer Tikka Bread Roll', price: '₹100', image: 'paneertikkabreadroll.jpeg' },
  { name: 'Veg Bread Roll', price: '₹70', image: 'vegrbreadroll.jpeg' },
  { name: 'Veg Cheese Bread Roll', price: '₹80', image: 'cheesebreadroll.jpeg' },
  { name: 'Paneer Cheese Bread Roll', price: '₹120', image: 'paneertikkabreadroll.jpeg' },
  { name: 'Chilli Cheese Bread Roll', price: '₹110', image: 'chillicheeseroll.webp' },
  { name: 'Pasta Cheese Bread Roll', price: '₹100', image: 'vegrbreadroll.jpeg' },
  { name: 'Corn Cheese Mayo Bread Roll', price: '₹90', image: 'vegrbreadroll.jpeg' },
  { name: 'Noodle Cheese Bread Roll', price: '₹90', image: 'vegrbreadroll.jpeg' },
  { name: 'Manchurian Cheese Bread Roll', price: '₹95', image: 'vegrbreadroll.jpeg' },
  { name: 'Mix Cheese Bread Roll', price: '₹130', image: 'vegrbreadroll.jpeg' },
  { name: 'Veg Cheese Mayo Bread Roll', price: '₹130', image: 'vegrbreadroll.jpeg' },
  { name: 'Garlic Paneer Cheese Bread Roll', price: '₹140', image: 'vegrbreadroll.jpeg' },
  { name: 'Russian Salad Bread Roll', price: '₹85', image: 'vegrbreadroll.jpeg' },
  { name: 'Russian Salad Cheese Bread Roll', price: '₹90', image: 'vegrbreadroll.jpeg' },
  { name: 'Corn Garlic Paneer Bread Roll', price: '₹140', image: 'vegrbreadroll.jpeg' },

  // Pasta
  { name: 'Red Pasta', price: '₹130', image: 'redpasta.jpeg' },
  { name: 'White Pasta', price: '₹130', image: 'whitepasta.jpeg' },
  { name: 'Mix Pasta', price: '₹130', image: 'mixpasta.jpeg' },
  { name: 'Corn Pasta', price: '₹130', image: 'cornpasta.jpeg' },
  { name: 'Cheese Pasta', price: '₹130', image: 'cheesepasta.jpeg' },
  { name: 'Desi Risotto', price: '₹130', image: 'desiriscotti.jpeg' },

  // Chinese
  { name: 'Fried / Schezwan Rice', price: '₹100', image: 'schezwanrice.jpeg' },
  { name: 'Hakka / Schezwan Noodles', price: '₹130', image: 'schezwannoodles.jpeg' },
  { name: 'Paneer Rice', price: '₹140', image: 'paneerrice.jpeg' },
  { name: 'Melon Paneer Rice', price: '₹120', image: 'paneerrice.jpeg' },
  { name: 'Triple Schezwan Rice', price: '₹140', image: 'tripleschezwanrice.jpeg' },
  { name: 'Manchurian - Gravy / Dry', price: '₹120', image: 'manchurian.jpeg' },
  { name: 'Corn Fried Rice', price: '₹110', image: 'cornfriedrice.jpeg' },
  { name: 'Garlic Corn Rice', price: '₹120', image: 'cornfriedrice.jpeg' },
  { name: 'Lemon Garlic Rice', price: '₹140', image: 'lemongarlicrice.jpeg' },
  { name: 'Paneer Schezwan Rice / Chilly', price: '₹130', image: 'paneerchilli.jpeg' },
  { name: 'Manchurian Noodles / Rice', price: '₹120', image: 'paneerchilli.jpeg' },
  { name: 'Chilly Garlic Noodles', price: '₹130', image: 'chilligarlicnoodles.jpeg' },
  { name: 'Garlic Paneer Noodles', price: '₹120', image: 'garlicpaneernoodles.jpeg' },
  { name: 'Hot Chinese Bhel', price: '₹120', image: 'chinesebhel..jpeg' },

  // Frankie
  { name: 'Veg Frankie', price: '₹45', image: 'vegfrankie.jpeg' },
  { name: 'Paneer Cheese Frankie', price: '₹90', image: 'paneercheesefrankie.jpeg' },
  { name: 'Noodles Frankie', price: '₹70', image: 'noodlesfrankie.jpeg' },
  { name: 'Pasta Cheese Frankie', price: '₹90', image: 'pastafrankie.jpeg' },
  { name: 'Cheese Manchurian Frankie', price: '₹80', image: 'manchurianfrankie.jpeg' },
  { name: 'Samosa Cheese Frankie', price: '₹70', image: 'samosafrankie.jpeg' },
  { name: 'Schezwan Cheese Frankie', price: '₹70', image: 'schezwanfrankie.jpeg' },
  { name: 'Cheese Noodles Schezwan Frankie', price: '₹70', image: 'noodlesfrankie.jpeg' },
  { name: 'Mayo Schezwan Frankie', price: '₹60', image: 'schezwanfrankie.jpeg' },
  { name: 'Mayo Cheese Schezwan Frankie', price: '₹70', image: 'schezwanfrankie.jpeg' },
  { name: 'Mix Spl. Frankie', price: '₹90', image: 'mixfrankie.jpeg' },
  { name: 'Chinese Bhel Frankie', price: '₹100', image: 'chinesebhelfrankie.jpeg' },
  { name: 'Manchurian Schezwan Frankie', price: '₹70', image: 'manchurianfrankie.jpeg' },
  { name: 'Cheese Manchurian Schezwan Frankie', price: '₹80', image: 'manchurianfrankie.jpeg' },
  { name: 'Paneer Schezwan Frankie', price: '₹80', image: 'paneerschezwanfrankie.jpeg' },
  { name: 'Cheese Paneer Schezwan Frankie', price: '₹90', image: 'paneerschezwanfrankie.jpeg' },

  // Pizza
  { name: 'Plain Cheese Pizza', price: '₹110', image: 'plaincheesepizza.jpeg' },
  { name: 'Capsicum Cheese Pizza', price: '₹120', image: 'capsicumcheesepizza.jpeg' },
  { name: 'Veg. Cheese Pizza', price: '₹130', image: 'vegcheesepizza.jpeg' },
  { name: 'Paneer Cheese Pizza', price: '₹130', image: 'paneercheesepizza.jpeg' },
  { name: 'Spl. Cheese Mix', price: '₹140', image: 'mixpizza.jpeg' },
  { name: 'Garlic Cheese Pizza', price: '₹150', image: 'garliccheesepizza.jpeg' },
  { name: 'Paneer Chilli Cheese', price: '₹150', image: 'paneerchillipizza.jpeg' },
  { name: 'Manchurian Cheese Pizza', price: '₹150', image: 'manchuriancheesepizza.jpeg' },
  { name: 'Noodles Cheese Pizza', price: '₹130', image: 'noodlespizza.jpeg' },
  { name: 'Pasta Cheese Pizza', price: '₹130', image: 'pastapizza.jpeg' },

  // Energy Zone
  { name: 'Red Bull', price: '₹125', image: 'redbull.jpeg' },

  // Garlic Bread
  { name: 'Garlic Cheese Bread', price: '₹100', image: 'garlicbread.jpeg' },
  { name: 'Garlic Corn Cheese Bread', price: '₹110', image: 'garliccornbread.jpeg' },
  { name: 'Garlic Paneer Cheese Bread', price: '₹130', image: 'garlicpaneerbread.jpeg' },
  { name: 'Garlic Corn Paneer Cheese Bread', price: '₹140', image: 'garliccornpaneerbread.jpeg' },
  { name: 'Garlic Corn Paneer Mayo Cheese Bread', price: '₹150', image: 'garliccornpaneerbread.jpeg' }

];


// Function to add default items automatically if they don't exist
const addDefaultItems = async () => {
  try {
    for (const item of defaultItems) {
      const existingItem = await Item.findOne({ id: item.id });
      if (!existingItem) {
        await Item.create(item);
        console.log(`Item added: ${item.name}`);
      }
    }
    console.log('Default items checked and added if missing.');
  } catch (error) {
    console.error('Error adding default items:', error.message);
  }
};

// Call addDefaultItems when the server starts
mongoose
  .connect(dbUri)
  .then(() => {
    console.log('Connected to MongoDB');
    addDefaultItems(); // Add default items after database connection
  })
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Middleware to check session expiry
app.use((req, res, next) => {
  if (!req.session.userId && !['/api/login', '/api/signup'].includes(req.path)) {
    return res.status(401).json({ error: 'Session expired, please log in again' });
  }
  next();
});

// Signup API
app.post('/api/signup', async (req, res) => {
  const { username, email, password, phoneNumber, department, userClass } = req.body;

  if (!username || !email || !password || !phoneNumber || !department || !userClass) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }, { phoneNumber }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username, email, or phone number already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      department,
      userClass,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Login API
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to regenerate session' });
        }

        req.session.userId = user._id;

        res.status(200).json({
          message: 'Login successful',
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
            department: user.department,
            userClass: user.userClass,
          },
        });
      });
    } else {
      res.status(400).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

app.get('/api/fetch', async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'Item name is required' });
  }

  try {
    // Fetch the item by its name
    const item = await Item.findOne({ name });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Return the item's ID
    res.status(200).json({ id: item._id });
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Get item by ID
// Get item by ID (using MongoDB's _id)
app.get('/api/item/:id', async (req, res) => {
  const itemId = req.params.id;

  try {
    // Validate if itemId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ error: 'Invalid Item ID format' });
    }

    const item = await Item.findById(itemId); // MongoDB will return the item with _id field
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json(item); // The response will include the _id field as itemId
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's wishlist (populate itemId with full Item details)
app.get('/api/wishlist/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Validate if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid User ID format' });
    }

    console.log('Fetching wishlist for user:', userId);

    // Fetch wishlist and populate itemId with full Item details
    const wishlist = await Wishlist.find({ userId })
      .populate('itemId'); // Populate the itemId field with full Item details

    if (!wishlist || wishlist.length === 0) {
      return res.status(404).json({ error: 'Wishlist not found for this user' });
    }

    // Return the populated wishlist with item details
    res.status(200).json({ wishlist });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Add item to wishlist
app.post('/api/wishlist', async (req, res) => {
  const { userId, itemId } = req.body;

  if (!userId || !itemId) {
    return res.status(400).json({ error: 'User ID and Item ID are required' });
  }

  // Validate if itemId and userId are valid ObjectIds
  if (!mongoose.Types.ObjectId.isValid(itemId) || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }

  try {
    // Convert itemId and userId to ObjectId if they're not already
    const objectIdUserId = new mongoose.Types.ObjectId(userId);
    const objectIdItemId = new mongoose.Types.ObjectId(itemId);

    const existingWishlistItem = await Wishlist.findOne({ userId: objectIdUserId, itemId: objectIdItemId });
    if (existingWishlistItem) {
      return res.status(400).json({ error: 'Item already in wishlist' });
    }

    const wishlistItem = new Wishlist({ userId: objectIdUserId, itemId: objectIdItemId });
    await wishlistItem.save();
    res.status(201).json({ message: 'Item added to wishlist' });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Remove item from wishlist
app.delete('/api/wishlist', async (req, res) => {
  const { userId, itemId } = req.body;

  if (!userId || !itemId) {
    return res.status(400).json({ error: 'User ID and Item ID are required' });
  }

  try {
    const result = await Wishlist.deleteOne({ userId, itemId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Item not found in wishlist' });
    }
    res.status(200).json({ message: 'Item removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});


app.post('/place-order', async (req, res) => {
  const { userId, items, totalAmount, deliveryAddress, contactNumber } = req.body;

  if (!userId || !items || !totalAmount || !deliveryAddress || !contactNumber) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Create an order document
    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      deliveryAddress,
      contactNumber,
    });

    // Save the order to MongoDB
    await newOrder.save();

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ error: 'Failed to place order', details: error.message });
  }
});

// Fetch orders for a user API
app.get('/user-orders/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const orders = await Order.find({ userId })
      .populate('items.itemId') // Populate the item details
      .populate('userId'); // Populate user details
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
});

// Add Review API
app.post('/api/reviews', async (req, res) => {
  const { user_id, item, review, rating } = req.body;
  if (!user_id || !item || !review || !rating) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newReview = new Review({ user_id, item, review, rating });
    await newReview.save();
    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add review' });
  }
});
app.get('/api/reviews/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const reviews = await Review.find({ user_id: userId });
    res.json(reviews); // Ensure this sends a JSON array or object
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});


// Start server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});

