const mongoose = require('mongoose');

const clothingSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  category: { type: String, required: true }, // e.g., Jacket, Jeans, T-Shirt, Dress
  brand: { type: String, required: true },
  size: { type: String, required: true }, // e.g., S, M, L, XL
  condition: { 
    type: String, 
    enum: ['New with tags', 'Like New', 'Good', 'Fair'], 
    required: true 
  },
  estimatedValue: { type: Number, required: true }, // Calculated via brand/condition
  location: { type: String, required: true },
  image: { type: String, default: 'https://via.placeholder.com/300' },
  status: { 
    type: String, 
    enum: ['available', 'pending', 'swapped'], 
    default: 'available' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Clothing', clothingSchema);