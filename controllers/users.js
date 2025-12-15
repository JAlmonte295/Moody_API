const express = require('express');
const router = express.Router();
const User = require('./models/User');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const users = await User.find({}, '-hashedPassword');

    res.json(users);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get('/me', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id, '-hashedPassword');

    if (!user) {
      return res.status(404).json({ err: 'User not found.' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get('/:userId', isAuthenticated, async (req, res) => {
  try {
    if (req.user._id !== req.params.userId){
      return res.status(403).json({ err: "Unauthorized"});
    }

    const user = await User.findById(req.params.userId, '-hashedPassword');

    if (!user) {
      return res.status(404).json({ err: 'User not found.'});
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;