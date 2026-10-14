const Swap = require('../models/Swap');
const ClothingItem = require('../models/ClothingItem');

// @desc    Create a swap request
// @route   POST /api/swaps
// @access  Private
const createSwapRequest = async (req, res) => {
  try {
    const { offeredItemId, requestedItemId } = req.body;

    const offeredItem = await ClothingItem.findById(offeredItemId);
    const requestedItem = await ClothingItem.findById(requestedItemId);

    if (!offeredItem || !requestedItem) {
      return res.status(404).json({ message: 'One or both items not found' });
    }

    // Ensure the requester actually owns the offered item
    if (offeredItem.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only offer items you own' });
    }

    // Ensure users don't request their own items
    if (requestedItem.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot request your own item' });
    }

    // Calculate value difference (optional fairness check)
    const valueDifference = offeredItem.estimatedValue - requestedItem.estimatedValue;

    const swap = await Swap.create({
      requester: req.user._id,
      owner: requestedItem.owner,
      offeredItem: offeredItemId,
      requestedItem: requestedItemId,
      valueDifference
    });

    res.status(201).json(swap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's swap requests (Incoming & Outgoing)
// @route   GET /api/swaps
// @access  Private
const getUserSwaps = async (req, res) => {
  try {
    // Find swaps where the user is either the requester or the owner receiving the request
    const swaps = await Swap.find({
      $or: [{ requester: req.user._id }, { owner: req.user._id }]
    })
      .populate('offeredItem', 'title images clothingType condition')
      .populate('requestedItem', 'title images clothingType condition')
      .populate('requester', 'name location')
      .populate('owner', 'name location')
      .sort({ createdAt: -1 });

    res.json(swaps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept or Reject a swap request
// @route   PUT /api/swaps/:id
// @access  Private
const updateSwapStatus = async (req, res) => {
  try {
    const { status } = req.body; // Expects 'accepted' or 'rejected'
    const swap = await Swap.findById(req.params.id);

    if (!swap) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Only the owner of the requested item can accept/reject
    if (swap.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this swap' });
    }

    swap.status = status;
    await swap.save();

    // If accepted, update both items' status so they no longer show in the open marketplace
    if (status === 'accepted') {
      await ClothingItem.findByIdAndUpdate(swap.offeredItem, { status: 'swapped' });
      await ClothingItem.findByIdAndUpdate(swap.requestedItem, { status: 'swapped' });
    }

    res.json(swap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSwapRequest,
  getUserSwaps,
  updateSwapStatus
};