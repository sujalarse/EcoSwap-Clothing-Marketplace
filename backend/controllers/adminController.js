const User = require('../models/User');
const ClothingItem = require('../models/ClothingItem');
const Swap = require('../models/Swap');

// @desc    Get platform analytics & KPIs
// @route   GET /api/admin/stats
// @access  Private/Admin
const getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalListings = await ClothingItem.countDocuments();
    const totalSwaps = await Swap.countDocuments();
    const successfulSwaps = await Swap.countDocuments({ status: 'completed' });
    const acceptedSwaps = await Swap.countDocuments({ status: 'accepted' });

    // Swap Request Conversion Rate Calculation
    const conversionRate = totalSwaps > 0 
      ? Math.round(((successfulSwaps + acceptedSwaps) / totalSwaps) * 100) 
      : 0;

    res.json({
      totalUsers,
      totalListings,
      totalSwaps,
      successfulSwaps: successfulSwaps + acceptedSwaps,
      conversionRate: `${conversionRate}%`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all platform listings for admin moderation
// @route   GET /api/admin/items
// @access  Private/Admin
const getAllListingsAdmin = async (req, res) => {
  try {
    const items = await ClothingItem.find()
      .populate('owner', 'name email location')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsersAdmin = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPlatformStats,
  getAllListingsAdmin,
  getAllUsersAdmin
};