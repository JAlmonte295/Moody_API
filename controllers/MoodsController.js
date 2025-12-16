const express = require("express");
const Mood = require("../models/Mood");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");

router.use(isAuthenticated);

router.get("/", async (req, res) => {
  try {
    const userMoods = await Mood.find({ author: req.user._id })
      .populate("author", "username") 
      .sort({ dateRecorded: "desc" });
    res.status(200).json(userMoods);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get("/:moodId", async (req, res) => {
  try {
    const mood = await Mood.findOne({
      _id: req.params.moodId,
      author: req.user._id,
    }).populate("author", "username");

    if (!mood) {
      return res.status(404).json({ error: "Mood not found." });
    }
    res.status(200).json(mood);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});


router.post("/", async (req, res) => {
  try {
    const newMood = await Mood.create({
      ...req.body,
      author: req.user._id, 
    });
    res.status(201).json(newMood);
  } catch (error) {

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(". ") });
    }

    console.error(error);
    res.status(500).json({ error: "Failed to create mood entry." });
  }
});


router.put("/:moodId", async (req, res) => {
  try {
    
    const updatedMood = await Mood.findOneAndUpdate(
      { _id: req.params.moodId, author: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedMood) {
      return res
        .status(404)
        .json({ error: "Mood not found or you are not authorized to edit it." });
    }

    res.status(200).json(updatedMood);
  } catch (error) {
    res.status(500).json({ error: "Failed to update mood entry." });
  }
});


router.delete("/:moodId", async (req, res) => {
  try {
    const mood = await Mood.findOneAndDelete({
      _id: req.params.moodId,
      author: req.user._id, 
    });

    if (!mood) {
      return res
        .status(404)
        .json({ error: "Mood entry not found or unauthorized." });
    }

    res.status(200).json({ message: "Mood entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete mood entry." });
  }
});

module.exports = router;
