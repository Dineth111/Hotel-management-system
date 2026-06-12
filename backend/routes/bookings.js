const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const HotelSettings = require('../models/HotelSettings');
const { isLoggedIn } = require('../middleware/auth');

// Protect all routes in this file
router.use(isLoggedIn);

// Configure Nodemailer transporter using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Helper function to send email notification to admin upon booking creation
 */
const sendAdminNotification = async (booking, roomName) => {
  try {
    // Fetch hotel email from database settings, fallback to admin@gmail.com
    const settings = await HotelSettings.findOne();
    const adminEmail = settings ? settings.email : 'admin@gmail.com';

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: `New Booking Request - ${booking.bookingId}`,
      text: `Dear Admin,

A new booking request has been received on Hotel Lanka Pro.

Booking Details:
------------------------------------------
Booking ID:      ${booking.bookingId}
Customer Name:   ${booking.customerName}
Customer Email:  ${booking.customerEmail}
Customer Phone:  ${booking.customerPhone}
Room Name:       ${roomName}
Check-in Date:   ${new Date(booking.checkIn).toLocaleDateString()}
Check-out Date:  ${new Date(booking.checkOut).toLocaleDateString()}
Number of Guests:${booking.guests}
Nights:          ${booking.nights}
Total Amount:    LKR ${booking.totalAmount}
Status:          ${booking.status}

Please log in to the admin panel to Approve or Reject this request.

Regards,
Hotel Lanka Pro System`
    };

    await transporter.sendMail(mailOptions);
    console.log(`✔ Notification email sent successfully to ${adminEmail}`);
  } catch (error) {
    // Catch email errors silently so API doesn't fail if SMTP values in .env are dummy
    console.warn(`⚠ Failed to send email alert: ${error.message}`);
  }
};

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking (Customer)
 * @access  Customer (Logged In)
 */
router.post('/', async (req, res) => {
  try {
    const { roomId, customerName, customerPhone, customerEmail, checkIn, checkOut, guests, addOns, couponCode } = req.body;

    if (!roomId || !customerName || !customerPhone || !customerEmail || !checkIn || !checkOut || !guests) {
      return res.status(400).json({ message: 'All booking fields are required' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({ message: 'Invalid check-in or check-out date format' });
    }

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // Fetch room to validate capacity and price
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Selected room not found' });
    }

    if (room.status === 'Maintenance') {
      return res.status(400).json({ message: 'Selected room is currently undergoing maintenance' });
    }

    if (guests > room.capacity) {
      return res.status(400).json({ message: `Number of guests exceeds room capacity (${room.capacity})` });
    }

    // Calculate nights & base amount securely
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const baseRoomTotal = nights * room.pricePerNight;

    // Securely calculate Add-ons
    const ADD_ONS_CATALOG = {
      'Airport Transfer': 5000,
      'Half-Board Meals': 3500,
      'Romantic Welcome': 4000
    };
    let addOnsList = [];
    let addOnsTotal = 0;
    if (addOns && Array.isArray(addOns)) {
      addOns.forEach(addonName => {
        if (ADD_ONS_CATALOG[addonName] !== undefined) {
          let price = ADD_ONS_CATALOG[addonName];
          if (addonName === 'Half-Board Meals') {
            price = price * nights;
          }
          addOnsList.push({ name: addonName, price });
          addOnsTotal += price;
        }
      });
    }

    // Apply Coupon discount
    let discountAmount = 0;
    let appliedCouponCode = '';
    if (couponCode) {
      const Coupon = require('../models/Coupon');
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && (!coupon.expiresAt || new Date(coupon.expiresAt) >= new Date())) {
        if (coupon.discountType === 'percentage') {
          discountAmount = Math.round((baseRoomTotal * coupon.discountValue) / 100);
        } else {
          discountAmount = coupon.discountValue;
        }
        if (discountAmount > baseRoomTotal) {
          discountAmount = baseRoomTotal;
        }
        appliedCouponCode = coupon.code;
      }
    }

    const totalAmount = baseRoomTotal - discountAmount + addOnsTotal;

    // Create booking
    const booking = await Booking.create({
      userId: req.session.userId,
      roomId,
      customerName,
      customerPhone,
      customerEmail,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      nights,
      addOns: addOnsList,
      addOnsTotal,
      discountAmount,
      couponCode: appliedCouponCode,
      totalAmount,
      status: 'Pending'
    });

    // Send asynchronous email notification in background
    sendAdminNotification(booking, room.name);

    res.status(201).json({ message: 'Booking request submitted successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/my-bookings
 * @desc    Get booking history for currently logged in customer
 * @access  Customer (Logged In)
 */
router.get('/my-bookings', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.session.userId })
      .populate('roomId')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
