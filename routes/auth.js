const express = require ("express");
const router = express.Router();

router.post("/register", async (req, res) => {
    const { email, password, fullName } = req.body;
  
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "Email, password, and full name are required" });
    }
  
    try {
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: fullName,
      });
  
      const token = await auth.createCustomToken(userRecord.uid);
  
      res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
  
    try {
    
      const user = await auth.getUserByEmail(email);
      const token = await auth.createCustomToken(user.uid);
  
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });
  
  module.exports = router;