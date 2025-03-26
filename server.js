const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

const authRoutes = require("./routes/auth");
// const billRoutes = require("./routes/bills");

const PORT = process.env.PORT || 5000;

// Middleware to log requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// CORS configuration - Replace with your frontend URL
app.use(cors({
    origin: "http://localhost:3000",  // Replace with your frontend URL
    methods: ["POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

console.log("Server starting...");

app.use("/api/auth", authRoutes);
// app.use("/api/bills", billRoutes);

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
