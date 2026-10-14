const express = require('express');
const router = express.Router();
const {
  getPlatformStats,
  getAllListingsAdmin,
  getAllUsersAdmin
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getPlatformStats);
router.get('/items', protect, admin, getAllListingsAdmin);
router.get('/users', protect, admin, getAllUsersAdmin);

module.exports = router;