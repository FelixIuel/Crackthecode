const express = require('express');
const router = express.Router();
const Puzzle = require('../models/Puzzle');
const Hint = require('../models/Hint');

// Get a random puzzle
router.get('/puzzle', async (req, res) => {
  const count = await Puzzle.countDocuments();
  const random = Math.floor(Math.random() * count);
  const puzzle = await Puzzle.findOne().skip(random);
  res.json(puzzle);
});

// Get a random bogus hint
router.get('/hint', async (req, res) => {
  const count = await Hint.countDocuments();
  const random = Math.floor(Math.random() * count);
  const hint = await Hint.findOne().skip(random);
  res.json(hint);
});

module.exports = router;
