const express = require('express');
const User = require('../models/User');
const Clothing = require('../models/Clothing');
const SwapRequest = require('../models/SwapRequest');
const auth = require('../middleware/auth');

const router = express.Router();

// Admin Middleware Check
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin privileges required' });
  }
};

// Platform Analytics & Stats
router.get('/stats', auth, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalListings = await Clothing.countDocuments();
    const activeListings = await Clothing.countDocuments({ status: 'available' });
    const successfulSwaps = await SwapRequest.countDocuments({ status: 'completed' });

    res.json({ totalUsers, totalListings, activeListings, successfulSwaps });
  } catch (err) {
    res.status(500).json({ message: 'Error loading admin stats' });
  }
});

// Remove Inappropriate Listing
router.delete('/listings/:id', auth, adminOnly, async (req, res) => {
  try {
    await Clothing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Listing removed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing listing' });
  }
});

module.exports = router;