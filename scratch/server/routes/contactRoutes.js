const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST /api/contact — store a contact message
router.post('/', async (req, res) => {
  try {
    const { name, phone, message } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const contact = await Contact.create({ name, phone, message });
    res.status(201).json({ success: true, message: 'Message received', id: contact._id });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
