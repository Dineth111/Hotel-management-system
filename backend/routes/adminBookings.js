const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { isLoggedIn, isAdmin } = require('../middleware/auth');

// Protect all routes under /api/admin/bookings
router.use(isLoggedIn, isAdmin);

/**
 * @route   GET /api/admin/bookings
 * @desc    Get bookings filtered by status (e.g. ?status=Pending)
 * @access  Admin only
 */
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const bookings = await Booking.find(filter)
      .populate('userId', 'name email phone')
      .populate('roomId')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/admin/bookings/all
 * @desc    Get all bookings (No filtering)
 * @access  Admin only
 */
router.get('/all', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email phone')
      .populate('roomId')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/admin/bookings/:id/approve
 * @desc    Approve a booking and check for conflicting overlapping bookings
 * @access  Admin only
 */
router.put('/:id/approve', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Availability overlap check logic:
    // Look for other bookings on the same room, excluding current booking,
    // which are approved/confirmed/checked-in and overlap the target date range.
    const conflict = await Booking.findOne({
      roomId: booking.roomId,
      _id: { $ne: booking._id },
      status: { $in: ['Approved', 'Confirmed', 'CheckedIn'] },
      checkIn: { $lt: booking.checkOut },
      checkOut: { $gt: booking.checkIn }
    });

    if (conflict) {
      return res.status(409).json({ message: 'Room is no longer available for these dates' });
    }

    // Approve booking
    booking.status = 'Approved';
    await booking.save();

    const { sendSMSNotification } = require('../utils/smsService');
    sendSMSNotification(booking.customerPhone, `Hello ${booking.customerName}, your booking ${booking.bookingId} has been APPROVED! We look forward to welcoming you on ${new Date(booking.checkIn).toLocaleDateString()}.`);

    res.json({ message: 'Booking approved successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/admin/bookings/:id/reject
 * @desc    Reject a booking and set a cancellation reason
 * @access  Admin only
 */
router.put('/:id/reject', async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    
    if (!rejectionReason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'Cancelled';
    booking.rejectionReason = rejectionReason;
    await booking.save();

    const { sendSMSNotification } = require('../utils/smsService');
    sendSMSNotification(booking.customerPhone, `Hello ${booking.customerName}, your booking ${booking.bookingId} was declined. Reason: ${rejectionReason}`);

    res.json({ message: 'Booking rejected successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/admin/bookings/:id/checkin
 * @desc    Set booking status to CheckedIn
 * @access  Admin only
 */
router.put('/:id/checkin', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'CheckedIn';
    await booking.save();

    const { sendSMSNotification } = require('../utils/smsService');
    sendSMSNotification(booking.customerPhone, `Hello ${booking.customerName}, welcome! You have successfully checked in to your stay ${booking.bookingId}.`);

    res.json({ message: 'Booking status updated to CheckedIn', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/admin/bookings/:id/checkout
 * @desc    Set booking status to CheckedOut
 * @access  Admin only
 */
router.put('/:id/checkout', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'CheckedOut';
    await booking.save();

    const { sendSMSNotification } = require('../utils/smsService');
    sendSMSNotification(booking.customerPhone, `Hello ${booking.customerName}, you have checked out successfully. Thank you for staying at Hotel Lanka Pro!`);

    res.json({ message: 'Booking status updated to CheckedOut', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
