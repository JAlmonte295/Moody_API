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


// DELETE /moods/:id - Delete a mood entry
router.delete("/:id", async (req, res) => {
  try {
    const mood = await Mood.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id, // Ensures the user can only delete their own moods
    });

    if (!mood) {
      return res.status(404).json({ error: "Mood entry not found or unauthorized" });
    }

    res.status(200).json({ message: "Mood entry deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete mood entry" });
  }
});

//GET /moods - display all moods logs
router.get("/", async (req, res) => {
  try {
    const findAllMoods = await Mood.find({})
    .populate("author")
    .sort({ createdAt: "desc" });
  res.status(200).json(findAllMoods);
  } catch(err) {
    res.status(500).json({ err: err.message });
  }
});

//GET /moods/:moodId - Mood Show Page diplay a single Mood
router.get("/:moodId", async (req, res) => {
  try {
    const findOneMood = await Mood.findById(req.params.moodId).populate("author");
    res.status(200).json(findOneMood);
  } catch(err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
