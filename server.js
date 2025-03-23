const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth");
// const billRoutes = require("./routes/bills");

const app = express();
const PORT = process.env.PORT || 3000;

// app.use(cors({
//     origin: "*",
//     methods: [ 'POST'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true 
//   }));
// app.use(bodyParser.json());



app.use("/api/auth", authRoutes);
// app.use("/api/bills", billRoutes);

// Start the server

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});