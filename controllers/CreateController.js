const express = require("express");
const Mood = require("../models/Mood");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { title, description, category, intensity } = req.body || {};

    if (!title || !category || !intensity) {
      const missingFields = [];
      if (!title) missingFields.push("title");
      if (!category) missingFields.push("category");
      if (!intensity) missingFields.push("intensity");

      return res.status(400).json({
        error: `Missing reuired fields: ${missingFields.join(
          ", "
        )}. Please provide a valid ${
          missingFields.length > 1 ? "values" : "value"
        }.`,
      });
    }

    const moodData = {
      title,
      description,
      category,
      intensity,
      // author: req.user._id,
    };

    if (description) moodData.description = description;

    const newMood = await Mood.create(moodData);
    res.status(201).json(newMood);
  } catch (error) {
    console.error("Error creating mood entry:", error);

    if (error && error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ error: `Validation Error: ${messages.join(", ")}` });
    }

    res.status(500).json({
      error: "Failed to create a mood entry. Please try again later.",
    });
  }
});

module.exports = router;
