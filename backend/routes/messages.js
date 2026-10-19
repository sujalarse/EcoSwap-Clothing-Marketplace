const express = require('express');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

const router = express.Router();

// Get Messages for a Specific Swap Request
router.get('/:swapRequestId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ swapRequest: req.params.swapRequestId })
      .populate('sender', 'name')
      .sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching chat messages' });
  }
});

module.exports = router;