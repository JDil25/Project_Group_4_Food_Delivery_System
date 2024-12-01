// Import
import express from "express";

// Create express app and define port
const app = express();
const port = 3000;

// Set up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Sample data for restaurants
const restaurants = [
  {
    id: 1,
    name: "Pasta Palace",
    cuisine: "Italian",
    delivery_time: 30,
    address: "123 Main St",
    menu: [
      {
        name: "Spaghetti Carbonara",
        description: "Creamy pasta with bacon",
        price: 12.99,
      },
      {
        name: "Margherita Pizza",
        description: "Classic pizza with fresh mozzarella",
        price: 10.99,
      },
    ],
  },
  {
    id: 2,
    name: "Sushi Central",
    cuisine: "Japanese",
    delivery_time: 25,
    address: "456 Ocean Blvd",
    menu: [
      {
        name: "California Roll",
        description: "Crab, avocado, and cucumber",
        price: 8.99,
      },
      { name: "Tuna Sashimi", description: "Fresh tuna slices", price: 14.99 },
    ],
  },
  {
    id: 3,
    name: "Taco Town",
    cuisine: "Mexican",
    delivery_time: 20,
    address: "789 Fiesta Ave",
    menu: [
      {
        name: "Beef Taco",
        description: "Spiced beef in a soft shell",
        price: 3.99,
      },
      {
        name: "Chicken Quesadilla",
        description: "Grilled tortilla with chicken and cheese",
        price: 7.99,
      },
    ],
  },
];

// Cart storage
let cart = [];
// Scheduled Orders
let scheduledOrders = [];

// Routes

// Welcome Page
app.get("/", (req, res) => {
  res.render("welcome");
});

// Login Page
app.get("/login", (req, res) => {
  res.render("login");
});

// Signup Page
app.get("/signup", (req, res) => {
  res.render("signup");
});

// Homepage
app.get("/home", (req, res) => {
  res.render("index", { restaurants });
});

// Restaurant Details
app.get("/restaurants/:id", (req, res) => {
  const restaurantId = parseInt(req.params.id, 10);
  const restaurant = restaurants.find((r) => r.id === restaurantId);
  if (restaurant) {
    res.render("restaurant-details", { restaurant });
  } else {
    res.status(404).send("Restaurant not found");
  }
});

// Add to Cart
app.post("/cart/add", (req, res) => {
  const { name, price, quantity } = req.body;

  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantity += parseInt(quantity, 10);
  } else {
    cart.push({
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
    });
  }

  res.redirect("/cart");
});

// Remove from Cart
app.post("/cart/remove", (req, res) => {
  const { name } = req.body;
  cart = cart.filter((item) => item.name !== name);
  res.redirect("/cart");
});

// View Cart
app.get("/cart", (req, res) => {
  const totalCost = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  res.render("cart", { cart, totalCost });
});

// Checkout
app.post("/checkout", (req, res) => {
  const totalCost = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartForConfirmation = [...cart];
  cart = [];

  res.render("order-confirmation", { cart: cartForConfirmation, totalCost });
});

// Order Confirmation
app.get("/order-confirmation", (req, res) => {
  res.render("order-confirmation", { cart: [], totalCost: 0 });
});

// Schedule Order
app.post("/schedule-order", (req, res) => {
  const { deliveryDate, deliveryTime } = req.body;

  const totalCost = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const scheduledOrder = {
    cart: [...cart],
    totalCost,
    deliveryDate,
    deliveryTime,
  };

  scheduledOrders.push(scheduledOrder);
  cart = [];

  res.render("scheduled-confirmation", { scheduledOrder });
});

// Scheduled Confirmation
app.get("/scheduled-orders", (req, res) => {
  res.render("scheduled-orders", { scheduledOrders });
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
