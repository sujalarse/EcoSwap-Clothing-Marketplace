const express = require('express');
const Clothing = require('../models/Clothing');
const auth = require('../middleware/auth');

const router = express.Router();

// Helper Function: Calculate Estimated Swap Value ($)
const calculateSwapValue = (category, brand, condition) => {
  const baseCategoryValues = {
    Jacket: 60,
    Coat: 80,
    Jeans: 40,
    Dress: 50,
    Shirt: 30,
    'T-Shirt': 20,
    Hoodie: 45,
    Shoes: 65,
    Accessory: 25
  };

  const conditionMultipliers = {
    'New with tags': 1.0,
    'Like New': 0.85,
    Good: 0.7,
    Fair: 0.5
  };

  const premiumBrands = ['Zara', 'Nike', 'Adidas', 'Levi\'s', 'H&M', 'Tommy Hilfiger'];
  const luxuryBrands = ['Gucci', 'Prada', 'Armani', 'Burberry'];

  let baseValue = baseCategoryValues[category] || 30;

  if (luxuryBrands.some(b => brand.toLowerCase().includes(b.toLowerCase()))) {
    baseValue *= 2.5;
  } else if (premiumBrands.some(b => brand.toLowerCase().includes(b.toLowerCase()))) {
    baseValue *= 1.4;
  }

  const multiplier = conditionMultipliers[condition] || 0.7;
  return Math.round(baseValue * multiplier);
};

// Create a Clothing Listing (Protected)
router.post('/', auth, async (req, res) => {
  try {
    const { title, category, brand, size, condition, location, image } = req.body;

    const estimatedValue = calculateSwapValue(category, brand, condition);

    const newClothing = new Clothing({
      owner: req.user.id,
      title,
      category,
      brand,
      size,
      condition,
      estimatedValue,
      location: location || 'Nagpur',
      image: image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format&fit=crop'
    });

    const savedItem = await newClothing.save();
    res.json(savedItem);
  } catch (err) {
    res.status(500).json({ message: 'Error creating listing' });
  }
});

// Get All Available Listings (Supports Location & Category Filters)
router.get('/', async (req, res) => {
  try {
    const { category, location, search } = req.query;
    let query = { status: 'available' };

    if (category) query.category = category;
    if (location) query.location = new RegExp(location, 'i');
    if (search) query.title = new RegExp(search, 'i');

    const items = await Clothing.find(query).populate('owner', 'name location email').sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching clothing listings' });
  }
});

// Get Single Item Detail
router.get('/:id', async (req, res) => {
  try {
    const item = await Clothing.findById(req.params.id).populate('owner', 'name location email');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching item' });
  }
});

module.exports = router;