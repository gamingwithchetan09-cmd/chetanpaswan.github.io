const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// GET /api/reviews — return ONLY approved reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true })
      .sort({ createdAt: -1 })
      .lean();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/review — store a new review (unapproved by default)
router.post('/', async (req, res) => {
  try {
    const { name, message, rating } = req.body;

    if (!name || !message || !rating) {
      return res.status(400).json({ error: 'Name, message, and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const review = await Review.create({ name, message, rating });
    res.status(201).json({ success: true, message: 'Review submitted for approval', id: review._id });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
