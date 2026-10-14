const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contact: { type: String, required: true },
    location: { type: String, required: true }, // e.g., "Nagpur", "Mumbai"
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    swapHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Swap' }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);