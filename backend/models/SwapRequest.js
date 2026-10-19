const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemOffered: { type: mongoose.Schema.Types.ObjectId, ref: 'Clothing', required: true },
  itemRequested: { type: mongoose.Schema.Types.ObjectId, ref: 'Clothing', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'completed'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SwapRequest', swapRequestSchema);