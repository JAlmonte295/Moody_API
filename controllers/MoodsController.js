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

router.put("/:moodId", async (req,res) => {
  try {
    const mood = await Mood.findById(req.params.moodId);


    if (!mood) {
      return res.status(404).json({error: "Mood not found"});
    }

    if (!mood.author.equals(req.user._id)) {
      return res.status(403).json({error: "you are not allowed to do that"})
    }

    const updatedMood = await Mood.findByIdAndUpdate(
      req.params.moodId,
      req.body,
      {new: true}
    )

    updatedMood._doc.author = req.user

    res.status(200).json(updatedMood)
  } catch (error) {
    res.status(500).json({error: error.message})
  }
})

module.exports = router;
