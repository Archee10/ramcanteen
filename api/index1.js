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
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
});
const Item = mongoose.model('Item', itemSchema);

// Wishlist schema
const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  createdAt: { type: Date, default: Date.now },
});
const Wishlist = mongoose.model('Wishlist', wishlistSchema);

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



// Default items to be added automatically if they don't already exist
const defaultItems = [
  // Juices
  { id: 1, name: 'Orange Juice', price: '₹65', image: 'orangejuice.jpeg' },
  { id: 2, name: 'Watermelon Juice', price: '₹65', image: 'watermelonjuice.jpeg' },
  { id: 3, name: 'Oreo Milkshake', price: '₹80', image: 'oreomilkshake.jpeg' },
  { id: 4, name: 'Chocolate Milkshake', price: '₹80', image: 'chocolatemilkshake.jpeg' },
  { id: 5, name: 'Banana Milkshake', price: '₹75', image: 'bananamilkshake.jpeg' },
  { id: 6, name: 'Nutella Milkshake', price: '₹80', image: 'nutellamilkshake.jpeg' },
  { id: 7, name: 'Cold Coffee', price: '₹60', image: 'coldcofee.jpeg' },
  { id: 8, name: 'Cold Coffee with Chocolate Shake', price: '₹90', image: 'coldcofeechocolate.jpeg' },

  // Snacks
  { id: 9, name: 'Tea', price: '₹18', image: 'tea.jpeg' },
  { id: 10, name: 'Coffee', price: '₹25', image: 'coffee1.jpg' },
  { id: 11, name: 'Daal Rice', price: '₹50', image: 'dalrice.jpeg' },
  { id: 12, name: 'Idli Vada', price: '₹45', image: 'idlivada.jpeg' },
  { id: 13, name: 'Poha', price: '₹35', image: 'poha.jpg' },
  { id: 14, name: 'Samosa Chat', price: '₹45', image: 'samosachat.jpg' },
  { id: 15, name: 'Samosa', price: '₹20', image: 'samosa.jpeg' },
  { id: 16, name: 'Vada Pav', price: '₹15', image: 'vadapav.jpeg' },
  { id: 17, name: 'Bread Pakoda', price: '₹20', image: 'breadpakoda.jpg' },
  { id: 18, name: 'Bun Maska', price: '₹25', image: 'bunmaska.jpeg' },
  { id: 19, name: 'Schez. Samosa Pav', price: '₹35', image: 'samosa.jpeg' },
  { id: 20, name: 'Schez. Vada Pav', price: '₹35', image: 'vadapav.jpeg' },

  // Sandwiches
  { id: 21, name: 'Veg Sandwich', price: '₹40', image: 'vegsandwich.jpeg' },
  { id: 22, name: 'Toast Sandwich', price: '₹50', image: 'toastsandwich.jpeg' },
  { id: 23, name: 'Masala Sandwich', price: '₹60', image: 'masalasandwich.jpeg' },
  { id: 24, name: 'Cheese Masala Toast', price: '₹70', image: 'cheesemasalatoast.jpeg' },
  { id: 25, name: 'Samosa Toast', price: '₹60', image: 'samosatoast.jpeg' },
  { id: 26, name: 'Samosa Cheese Toast', price: '₹70', image: 'samosatoast.jpeg' },
  { id: 27, name: 'Bread Butter Toast', price: '₹30', image: 'breadbutter.jpeg' },
  { id: 28, name: 'Plain Cheese Toast', price: '₹50', image: 'cheesetoast.jpeg' },
  { id: 29, name: 'Mayo Grill Sandwich', price: '₹65', image: 'mayogrill.jpeg' },
  { id: 30, name: 'Plain Cheese Sandwich', price: '₹45', image: 'plaincheesesandwich.jpeg' },
  { id: 31, name: 'Jam Toast', price: '₹35', image: 'jamtoast.jpeg' },
  { id: 32, name: 'Jam Cheese Toast', price: '₹45', image: 'jamcheese.jpeg' },
  { id: 33, name: 'Aloo Sandwich', price: '₹50', image: 'aloosandwich.jpeg' },
  { id: 34, name: 'Veg Chili Toast', price: '₹55', image: 'chillitoast.jpeg' },
  { id: 35, name: 'Chili Cheese Sandwich', price: '₹85', image: 'chillicheesesandwich.jpeg' },
  { id: 36, name: 'Corn Chili Cheese Toast', price: '₹80', image: 'cornchillitoast.jpeg' },
  { id: 37, name: 'Veg Cheese Toast', price: '₹85', image: 'vegcheesetoast.jpeg' },
  { id: 38, name: 'Veg Chili Mayo Toast', price: '₹85', image: 'chillitoast.jpeg' },
  { id: 39, name: 'Cheese Chili Paneer Toast', price: '₹65', image: 'chillipaneertoast.jpeg' },
  { id: 40, name: 'Veg Mayo Paneer Cheese', price: '₹90', image: 'paneersandwich.jpeg' },
  { id: 41, name: 'Brown Bread Sandwich', price: '₹100', image: 'brownbread.jpeg' },
  { id: 42, name: 'Nutella Chocolate Sandwich', price: '₹50', image: 'nutellasandwich.jpeg' },
  { id: 43, name: 'Nutella Oreo Sandwich', price: '₹65', image: 'nutellasandwich.jpeg' },
  { id: 44, name: 'Cheese Manchurian Toast Sandwich', price: '₹75', image: 'manchriantoast.jpeg' },
  { id: 45, name: 'Cheese Pasta Toast Sandwich', price: '₹80', image: 'pastasandwich.jpeg' },
  { id: 46, name: 'Chips Cheese Sandwich', price: '₹80', image: 'chipssandwich.jpeg' },
  { id: 47, name: 'Chips Noodles Toast Sandwich', price: '₹80', image: 'noodlessandwich.jpeg' },
  { id: 48, name: 'Russian Salad Cheese Sandwich', price: '₹80', image: 'russiansaladsandwich.jpeg' },

  // Rolls
  { id: 49, name: 'Paneer Tikka Bread Roll', price: '₹100', image: 'paneertikkabreadroll.jpeg' },
  { id: 50, name: 'Veg Bread Roll', price: '₹70', image: 'vegrbreadroll.jpeg' },
  { id: 51, name: 'Veg Cheese Bread Roll', price: '₹80', image: 'cheesebreadroll.jpeg' },
  { id: 52, name: 'Paneer Cheese Bread Roll', price: '₹120', image: 'paneertikkabreadroll.jpeg' },
  { id: 53, name: 'Chilli Cheese Bread Roll', price: '₹110', image: 'chillicheeseroll.webp' },
  { id: 54, name: 'Pasta Cheese Bread Roll', price: '₹100', image: 'vegrbreadroll.jpeg' },
  { id: 55, name: 'Corn Cheese Mayo Bread Roll', price: '₹90', image: 'vegrbreadroll.jpeg' },
  { id: 56, name: 'Noodle Cheese Bread Roll', price: '₹90', image: 'vegrbreadroll.jpeg' },
  { id: 57, name: 'Manchurian Cheese Bread Roll', price: '₹95', image: 'vegrbreadroll.jpeg' },
  { id: 58, name: 'Mix Cheese Bread Roll', price: '₹130', image: 'vegrbreadroll.jpeg' },
  { id: 59, name: 'Veg Cheese Mayo Bread Roll', price: '₹130', image: 'vegrbreadroll.jpeg' },
  { id: 60, name: 'Garlic Paneer Cheese Bread Roll', price: '₹140', image: 'vegrbreadroll.jpeg' },
  { id: 61, name: 'Russian Salad Bread Roll', price: '₹85', image: 'vegrbreadroll.jpeg' },
  { id: 62, name: 'Russian Salad Cheese Bread Roll', price: '₹90', image: 'vegrbreadroll.jpeg' },
  { id: 63, name: 'Corn Garlic Paneer Bread Roll', price: '₹140', image: 'vegrbreadroll.jpeg' },
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

// Add Items API
app.post('/api/items/add', async (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid input. Provide an array of items.' });
  }

  try {
    // Bulk insert items into the database
    const newItems = await Item.insertMany(items, { ordered: false });
    res.status(201).json({ message: 'Items added successfully', newItems });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ error: 'Some items already exist in the database', details: error.keyValue });
    } else {
      res.status(500).json({ error: 'Server error: ' + error.message });
    }
  }
});

// Get Items API
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json({ items });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Add Item to Wishlist API
app.post('/api/wishlist', async (req, res) => {
  const { userId, itemId } = req.body;

  if (!userId || !itemId) {
    return res.status(400).json({ error: 'User ID and Item ID are required' });
  }

  try {
    const existingWishlistItem = await Wishlist.findOne({ userId, itemId });
    if (existingWishlistItem) {
      return res.status(400).json({ error: 'Item already in wishlist' });
    }

    const wishlistItem = new Wishlist({ userId, itemId });
    await wishlistItem.save();
    res.status(201).json({ message: 'Item added to wishlist' });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Get Wishlist Items API
app.get('/api/wishlist/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const wishlist = await Wishlist.find({ userId }).populate('itemId');
    res.status(200).json({ wishlist });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// API to place an order
app.post('/place-order', async (req, res) => {
  try {
    const { userId, items, totalAmount, deliveryAddress, contactNumber } = req.body;

    // Create an order document
    const newOrder = new Order({
      userId,
      items,
      totalAmount,
    });

    // API to fetch orders for a user
app.get('/user-orders/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ userId })
      .populate('items.itemId') // Populate the item details
      .populate('userId'); // Populate user details
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
});

    // Save the order to MongoDB
    await newOrder.save();

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ error: 'Failed to place order', details: error.message });
  }
});



// Start server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
