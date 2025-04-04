const mongoose = require('mongoose');

const hintSchema = new mongoose.Schema({
  message: String
});

module.exports = mongoose.model('Hint', hintSchema);
