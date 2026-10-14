const Message = require('../models/Message');

// @desc    Get all messages for a specific swap
// @route   GET /api/messages/:swapId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ swapId: req.params.swapId })
      .populate('sender', 'name')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMessages };