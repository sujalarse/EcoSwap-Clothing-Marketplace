const mongoose = require('mongoose');

const swapSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    offeredItem: { type: mongoose.Schema.Types.ObjectId, ref: 'ClothingItem', required: true },
    requestedItem: { type: mongoose.Schema.Types.ObjectId, ref: 'ClothingItem', required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
      default: 'pending'
    },
    valueDifference: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Swap', swapSchema);