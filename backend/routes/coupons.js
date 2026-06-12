const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const { isLoggedIn, isAdmin } = require('../middleware/auth');

// Public validation
router.post('/validate', isLoggedIn, async (req, res) => {
  try {
    const { code, roomPrice } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) {
      return res.status(400).json({ message: 'Invalid or inactive coupon code' });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ message: 'This coupon code has expired' });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((roomPrice * coupon.discountValue) / 100);
    } else {
      discountAmount = coupon.discountValue;
    }

    // Limit discount to not exceed roomPrice
    if (discountAmount > roomPrice) {
      discountAmount = roomPrice;
    }

    res.json({
      isValid: true,
      code: coupon.code,
      discountAmount,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin management
router.get('/admin', isLoggedIn, isAdmin, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/admin', isLoggedIn, isAdmin, async (req, res) => {
  try {
    const { code, discountType, discountValue, expiresAt } = req.body;
    if (!code || !discountType || !discountValue || !expiresAt) {
      return res.status(400).json({ message: 'All coupon fields are required' });
    }

    // Check if code exists
    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      expiresAt: new Date(expiresAt)
    });

    res.status(201).json({ message: 'Coupon created successfully', coupon });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/admin/:id', isLoggedIn, isAdmin, async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
