const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Booking = require('../models/Booking');

/**
 * @route   GET /api/rooms
 * @desc    Get all rooms (Public)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/rooms/available
 * @desc    Get available rooms based on check-in, check-out dates and guest capacity
 * @access  Public
 */
router.get('/available', async (req, res) => {
  try {
    const { checkIn, checkOut, guests } = req.query;

    if (!checkIn || !checkOut || !guests) {
      return res.status(400).json({ message: 'Please provide checkIn, checkOut and guests' });
    }

    const reqIn = new Date(checkIn);
    const reqOut = new Date(checkOut);
    const guestCount = Number(guests);

    // Validate dates
    if (isNaN(reqIn.getTime()) || isNaN(reqOut.getTime())) {
      return res.status(400).json({ message: 'Invalid check-in or check-out date format' });
    }
    if (reqIn >= reqOut) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // Find all active bookings that overlap with requested dates
    // Booking overlap condition: requested checkIn < booking checkOut AND requested checkOut > booking checkIn
    // Room is blocked only if booking status is Approved, Confirmed, or CheckedIn
    const overlappingBookings = await Booking.find({
      status: { $in: ['Approved', 'Confirmed', 'CheckedIn'] },
      $or: [
        {
          checkIn: { $lt: reqOut },
          checkOut: { $gt: reqIn }
        }
      ]
    });

    // Extract blocked room IDs
    const blockedRoomIds = overlappingBookings.map(booking => booking.roomId.toString());

    // Find rooms that:
    // 1. Are not in the blocked room IDs array
    // 2. Have capacity greater than or equal to the requested guest count
    // 3. Have status set to 'Available' (not in maintenance)
    const availableRooms = await Room.find({
      _id: { $nin: blockedRoomIds },
      capacity: { $gte: guestCount },
      status: 'Available'
    });

    res.json(availableRooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/rooms/:id
 * @desc    Get single room details by ID (Public)
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
