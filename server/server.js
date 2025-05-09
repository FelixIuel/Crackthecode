const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const puzzleRoutes = require('./routes/puzzleRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', puzzleRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log(' Connected to MongoDB');
  app.listen(5000, () => console.log('Server running on port 5000'));
}).catch(err => console.error(err));

// Optional root route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});