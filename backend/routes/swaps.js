const express = require('express');
const SwapRequest = require('../models/SwapRequest');
const Clothing = require('../models/Clothing');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a Swap Request
router.post('/', auth, async (req, res) => {
  try {
    const { receiverId, itemOfferedId, itemRequestedId } = req.body;

    if (itemOfferedId === itemRequestedId) {
      return res.status(400).json({ message: 'Cannot swap an item with itself' });
    }

    const swapRequest = new SwapRequest({
      sender: req.user.id,
      receiver: receiverId,
      itemOffered: itemOfferedId,
      itemRequested: itemRequestedId
    });

    await swapRequest.save();

    // Mark items as pending
    await Clothing.findByIdAndUpdate(itemOfferedId, { status: 'pending' });
    await Clothing.findByIdAndUpdate(itemRequestedId, { status: 'pending' });

    res.json(swapRequest);
  } catch (err) {
    res.status(500).json({ message: 'Error creating swap request' });
  }
});

// Get User's Swap Requests (Both Incoming & Outgoing)
router.get('/', auth, async (req, res) => {
  try {
    const requests = await SwapRequest.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }]
    })
      .populate('sender', 'name email location')
      .populate('receiver', 'name email location')
      .populate('itemOffered')
      .populate('itemRequested')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching swap requests' });
  }
});

// Update Swap Status (Accept / Reject / Complete)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body; // 'accepted', 'rejected', 'completed'
    const swap = await SwapRequest.findById(req.params.id);

    if (!swap) return res.status(404).json({ message: 'Swap request not found' });

    swap.status = status;
    await swap.save();

    if (status === 'completed') {
      await Clothing.findByIdAndUpdate(swap.itemOffered, { status: 'swapped' });
      await Clothing.findByIdAndUpdate(swap.itemRequested, { status: 'swapped' });
    } else if (status === 'rejected') {
      await Clothing.findByIdAndUpdate(swap.itemOffered, { status: 'available' });
      await Clothing.findByIdAndUpdate(swap.itemRequested, { status: 'available' });
    }

    res.json(swap);
  } catch (err) {
    res.status(500).json({ message: 'Error updating swap status' });
  }
});

module.exports = router;