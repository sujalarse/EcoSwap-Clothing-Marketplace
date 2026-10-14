const ClothingItem = require('../models/ClothingItem');
const calculateSwapValue = require('../utils/valueCalculator');

// @desc    Create a new clothing listing
// @route   POST /api/items
// @access  Private
const createItem = async (req, res) => {
  try {
    const { title, clothingType, brandName, brandTier, size, condition, location, images } = req.body;

    if (!title || !clothingType || !brandName || !size || !condition || !location) {
      return res.status(400).json({ message: 'Please provide all required item details' });
    }

    // Automated swap value calculation
    const estimatedValue = calculateSwapValue(clothingType, brandTier, condition);

    const item = await ClothingItem.create({
      owner: req.user._id,
      title,
      clothingType,
      brandName,
      size,
      condition,
      estimatedValue,
      location,
      images: images && images.length > 0 ? images : ['https://via.placeholder.com/300']
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all available items (with search, category, and location filters)
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
  try {
    const { search, category, location } = req.query;
    let query = { status: 'available' };

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.clothingType = category;
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const items = await ClothingItem.find(query)
      .populate('owner', 'name location contact')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single item details
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res) => {
  try {
    const item = await ClothingItem.findById(req.params.id).populate(
      'owner',
      'name location contact'
    );

    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update listing
// @route   PUT /api/items/:id
// @access  Private
const updateItem = async (req, res) => {
  try {
    const item = await ClothingItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Verify ownership
    if (item.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    const updatedItem = await ClothingItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete listing
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = async (req, res) => {
  try {
    const item = await ClothingItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Verify ownership or admin privileges
    if (item.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await item.deleteOne();
    res.json({ message: 'Item removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem
};