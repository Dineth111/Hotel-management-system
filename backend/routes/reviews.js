const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const { isLoggedIn, isAdmin } = require('../middleware/auth');

// Get approved reviews for a room
router.get('/room/:roomId', async (req, res) => {
  try {
    const reviews = await Review.find({ roomId: req.params.roomId, isApproved: true })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit a review (Customer)
router.post('/', isLoggedIn, async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;
    if (!bookingId || !rating || !comment) {
      return res.status(400).json({ message: 'All review fields are required' });
    }

    // Verify booking exists, is CheckedOut, and belongs to the user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking record not found' });
    }

    if (booking.userId.toString() !== req.session.userId) {
      return res.status(403).json({ message: 'You can only review your own bookings' });
    }

    if (booking.status !== 'CheckedOut') {
      return res.status(400).json({ message: 'You can only review a room after checkout' });
    }

    // Check if review already exists for this booking
    const existing = await Review.findOne({ bookingId });
    if (existing) {
      return res.status(400).json({ message: 'You have already submitted a review for this stay' });
    }

    const review = await Review.create({
      userId: req.session.userId,
      roomId: booking.roomId,
      bookingId,
      customerName: booking.customerName,
      rating: Number(rating),
      comment
    });

    res.status(201).json({ message: 'Review submitted. Awaiting moderation.', review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin list all reviews
router.get('/admin', isLoggedIn, isAdmin, async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('roomId', 'name roomNumber')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin approve review
router.put('/admin/:id/approve', isLoggedIn, isAdmin, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review approved successfully', review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin delete/reject review
router.delete('/admin/:id', isLoggedIn, isAdmin, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review removed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
