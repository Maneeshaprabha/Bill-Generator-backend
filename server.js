const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: "*",
    methods: [ 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true 
  }));
app.use(bodyParser.json());
