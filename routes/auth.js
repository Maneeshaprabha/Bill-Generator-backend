const express = require("express");
const router = express.Router();
const { auth } = require("../config/firebase"); 
const admin = require("firebase-admin"); 
require("dotenv").config();

// Register
router.post("/register", async (req, res) => {
    try {
        console.log("[/register] Received request");
        console.log("[/register] Request body:", req.body);

        const { email, password } = req.body;
        if (!email || !password) {
            console.log("[/register] Missing email or password ");
            return res.status(400).json({ error: "Missing email or password" });
        }

        console.log("[/register] Creating user in Firebase...");
        const user = await auth.createUser({ email, password });

        console.log("[/register]  User created successfully:", user);
        res.status(201).json({ message: "User created successfully", user });

    } catch (error) {
        console.error("[/register] Error creating user:", error.message);
        res.status(500).json({ error: error.message });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        
        const userCredential = await auth.signInWithEmailAndPassword(email, password);

        const user = userCredential.user;

        
        const token = await admin.auth().createCustomToken(user.uid);

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
