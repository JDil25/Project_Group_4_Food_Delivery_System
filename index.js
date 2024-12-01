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

// Define route for welcome page
app.get("/", (req, res) => {
  res.render("welcome.ejs");
});

// Define route for login page
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

// Define route for signup page
app.get("/signup", (req, res) => {
  res.render("signup");
});

// Route for the main homepage (index.ejs)
app.get("/home", (req, res) => {
  res.render("index.ejs", { restaurants }); // Pass the restaurants array
});

// Post for Login
app.post("/login", (req, res) => {
  // Take in email and password
  const { email, password } = req.body;
  // Render homepage
  res.render("index.ejs", { restaurants });
});

// Post for Signup
app.post("/signup", (req, res) => {
  // Take in email and password
  const { email, password } = req.body;
  // Render homepage
  res.render("index.ejs", { restaurants });
});

// Route for restaurant details page
app.get("/restaurants/:id", (req, res) => {
  const restaurantId = parseInt(req.params.id);
  const restaurant = restaurants.find((r) => r.id === restaurantId);
  if (restaurant) {
    res.render("restaurant-details", { restaurant });
  } else {
    res.status(404).send("Restaurant not found");
  }
});

// Add item to the cart
app.post("/cart/add", (req, res) => {
  const { name, price, quantity } = req.body;

  // Check if item already exists in the cart
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    existingItem.quantity += parseInt(quantity);
  } else {
    cart.push({ name, price: parseFloat(price), quantity: parseInt(quantity) });
  }

  res.redirect("/cart");
});

// Remove item from the cart
app.post("/cart/remove", (req, res) => {
  const { name } = req.body;

  // Remove the item by filtering
  cart = cart.filter((item) => item.name !== name);

  res.redirect("/cart");
});

// View cart items
app.get("/cart", (req, res) => {
  const totalCost = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  res.render("cart", { cart, totalCost });
});

// Route to handle order submission
app.post("/checkout", (req, res) => {
  // Calculate the total cost of the cart items
  const totalCost = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Render order confirmation page with the cart details
  res.render("order-confirmation", { cart, totalCost });
});

// Route to get the order confirmation page
app.get("/order-confirmation", (req, res) => {
  // Calculate the total cost of the cart items
  const totalCost = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Render the order-confirmation page, passing cart and totalCost
  res.render("order-confirmation", { cart, totalCost });
});

// Listen for requests
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
