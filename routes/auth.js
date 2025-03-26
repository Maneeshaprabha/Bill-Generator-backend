const express = require("express");
const router = express.Router();
const { auth, db } = require("../config/firebase"); // Firebase Admin SDK

// Register a new user
router.post("/register", async (req, res) => {
    try {
        console.log("[/register] Received request:", req.body);

        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            console.log("[/register] Missing required fields");
            return res.status(400).json({ error: "Missing full name, email, or password" });
        }

        // Create user in Firebase Authentication
        const userRecord = await auth.createUser({
            email,
            password,
        });

        // Save user details in Firestore
        await db.collection("users").doc(userRecord.uid).set({
            fullName,
            email,
            createdAt: new Date(),
        });

        console.log("[/register] User created successfully:", userRecord.uid);
        res.status(201).json({ message: "User created successfully", userId: userRecord.uid });

    } catch (error) {
        console.error("[/register] Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Login (Handled on frontend)
router.post("/login", async (req, res) => {
    return res.status(400).json({ error: "Login should be handled on the frontend using Firebase Client SDK." });
});

module.exports = router;
