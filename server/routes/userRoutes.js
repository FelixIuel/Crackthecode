const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Login or create a user
router.post('/login', async (req, res) => {
  const { username } = req.body;

  if (!username || username.trim() === '') {
    return res.status(400).json({ error: 'Username is required' });
  }

  let user = await User.findOne({ username });

  if (!user) {
    // Create new user
    user = new User({ username });
    await user.save();
    console.log('👤 New user created:', username);
  } else {
    console.log('👤 User logged in:', username);
  }

  res.json({ success: true, user });
});

module.exports = router;
