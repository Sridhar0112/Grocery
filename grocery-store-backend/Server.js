const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/grocery-store", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Product Schema
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  category: String,
});

const Product = mongoose.model("Product", ProductSchema);

// Order Schema
const OrderSchema = new mongoose.Schema({
  customerName: String,
  address: String,
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  totalAmount: Number,
  orderDate: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", OrderSchema);

// Cart Schema
const CartSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  category: String,
  Quantity: String,
});

const Cart = mongoose.model("Cart", CartSchema);

// Get all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    if (!products.length) {
      return res.status(404).json({ message: "No products found" });
    }
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update an existing product
// Update an existing product
app.put("/products", async (req, res) => {
  try {
    const { id, name, price, image, category } = req.body;

    if (!id || !name || !price || !image || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found!" });
    }

    existingProduct.name = name;
    existingProduct.price = price;
    existingProduct.image = image;
    existingProduct.category = category;

    await existingProduct.save();
    res.status(200).json(existingProduct);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add a new product
app.post("/products", async (req, res) => {
  try {
    const { name, price, image, category } = req.body;
    if (!name || !price || !image || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({ message: "Product already exists!" });
    }
    const newProduct = new Product({ name, price, image, category });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Place an order
app.post("/orders", async (req, res) => {
  try {
    const { customerName, address, products, totalAmount } = req.body;
    const validProducts = await Product.find({ _id: { $in: products } });
    if (validProducts.length !== products.length) {
      return res
        .status(400)
        .json({ message: "Some products are invalid or do not exist." });
    }
    const newOrder = new Order({
      customerName,
      address,
      products,
      totalAmount,
    });
    await newOrder.save();
    res
      .status(201)
      .json({ message: "Order placed successfully!", order: newOrder });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add a product to the cart
app.post("/Cart", async (req, res) => {
  try {
    const { name, price, image, category, Quantity } = req.body;
    if (!name || !price || !image || !category || !Quantity) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingCartItem = await Cart.findOne({ name });
    if (existingCartItem) {
      return res
        .status(400)
        .json({ message: "Product already exists in the cart!" });
    }
    const newCartItem = new Cart({ name, price, image, category, Quantity });
    await newCartItem.save();
    res.status(201).json(newCartItem);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/Cart", async (req, res) => {
  try {
    const cartItems = await Cart.find();
    if (cartItems.length === 0) {
      return res.status(404).json({ message: "No items found in the cart" });
    }
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.delete("/Cart", async (req, res) => {
  try {
    const { name } = req.body;

    // Check if the name field is provided
    if (!name) {
      return res.status(400).json({ message: "Product name is required" });
    }

    // Find the product by name and delete it
    const deletedProduct = await Cart.findOneAndDelete({ name });
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found in the cart" });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete a product by its ID (passed in the request body)
app.delete("/products", async (req, res) => {
  try {
    const { id } = req.body; // Extract the product ID from the request body

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(id); // Delete the product by ID
    res.status(200).json({ message: "Product deleted successfully", product });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Start the server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
