const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateUser } = require('../middleware/auth');

// Register or update user (called after Firebase auth)
router.post('/register', authenticateUser, async (req, res) => {
  try {
    const { uid, email, displayName, emailVerified } = req.user;

    // Check if user exists
    let user = await User.findOne({ uid });

    if (user) {
      // Update existing user
      user.email = email || user.email;
      user.displayName = displayName || user.displayName;
      user.emailVerified = emailVerified;
      await user.save();
    } else {
      // Create new user
      user = new User({
        uid,
        email,
        displayName: displayName || '',
        emailVerified
      });
      await user.save();
    }

    res.status(200).json({ 
      message: 'User registered successfully',
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Get current user info
router.get('/me', authenticateUser, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

module.exports = router;
