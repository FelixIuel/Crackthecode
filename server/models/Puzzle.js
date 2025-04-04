const mongoose = require('mongoose');

const puzzleSchema = new mongoose.Schema({
  sentence: String,
  category: String,
  hint: String,
  prefilledIndices: [Number]
});

module.exports = mongoose.model('Puzzle', puzzleSchema);
