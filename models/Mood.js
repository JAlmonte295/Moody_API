const mongoose = require("mongoose");

const moodSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: true,
    enum: ["Happy", "Sad", "Angry", "Excited", "Anxious", "Relaxed", "Other"],
  },
  intensity: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  dateRecorded: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Mood = mongoose.model("Mood", moodSchema);

module.exports = Mood;
