const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  highScore: { type: Number, default: 0 },
  friendRequests: [
    {
      username: { type: String, required: true },
      status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  sentRequests: [
    {
      username: { type: String, required: true }
    }
  ],
  friends: [
    {
      username: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
