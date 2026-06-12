const express = require('express');
const router = express.Router();
const HotelSettings = require('../models/HotelSettings');

/**
 * @route   GET /api/settings
 * @desc    Get global hotel settings (Public)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    let settings = await HotelSettings.findOne();
    if (!settings) {
      // Create defaults if not exists
      settings = await HotelSettings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
