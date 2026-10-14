const mongoose = require('mongoose');

const clothingItemSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    clothingType: { type: String, required: true }, // e.g., Shirt, Jacket, Jeans
    brandName: { type: String, required: true },
    size: { type: String, required: true }, // e.g., S, M, L, XL
    condition: {
      type: String,
      enum: ['New with tags', 'Like New', 'Good', 'Fair'],
      required: true
    },
    estimatedValue: { type: Number, required: true },
    location: { type: String, required: true },
    images: [{ type: String, required: true }],
    status: {
      type: String,
      enum: ['available', 'pending', 'swapped'],
      default: 'available'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ClothingItem', clothingItemSchema);