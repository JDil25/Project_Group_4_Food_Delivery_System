// import
import express from "express";

// create express app and define port
const app = express();
const port = 3000;

// set up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const restaurants = [
  {
    name: "Pasta Palace",
    cuisine: "Italian",
    delivery_time: 30,
    address: "123 Main St",
  },
  {
    name: "Sushi Central",
    cuisine: "Japanese",
    delivery_time: 25,
    address: "456 Ocean Blvd",
  },
  {
    name: "Taco Town",
    cuisine: "Mexican",
    delivery_time: 20,
    address: "789 Fiesta Ave",
  },
];

// define route for homepage
app.get("/", (req, res) => {
  // render the index.ejs template
  res.render("welcome.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  res.render("index.ejs", { restaurants });
});

app.post("/signup", (req, res) => {
  const { email, password } = req.body;
  res.render("index.ejs", { restaurants });
});

// listen for requests
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
