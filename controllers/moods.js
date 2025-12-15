const express = require("express");
const Mood = require("../models/Mood");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");

// All routes in this file are protected and require a valid token
router.use(isAuthenticated);

// POST /moods - Create a new mood entry
router.post("/", async (req, res) => {
  try {
    const newMood = await Mood.create({
      ...req.body,
      author: req.user._id, // Associate the mood with the logged-in user
    });
    res.status(201).json(newMood);
  } catch (error) {
    // Mongoose validation error
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(". ") });
    }

    // Other server errors
    console.error(error);
    res.status(500).json({ error: "Failed to create mood entry." });
  }
});

module.exports = router;
