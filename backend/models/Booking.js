const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  customerName: {
    type: String,
    required: [true, 'Please provide customer name']
  },
  customerPhone: {
    type: String,
    required: [true, 'Please provide customer phone']
  },
  customerEmail: {
    type: String,
    required: [true, 'Please provide customer email']
  },
  checkIn: {
    type: Date,
    required: [true, 'Please provide check-in date']
  },
  checkOut: {
    type: Date,
    required: [true, 'Please provide check-out date']
  },
  guests: {
    type: Number,
    required: [true, 'Please provide number of guests']
  },
  nights: {
    type: Number,
    required: [true, 'Please provide number of nights']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Please provide total amount']
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Confirmed', 'CheckedIn', 'CheckedOut', 'Cancelled'],
    default: 'Pending'
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-generate booking ID (Format: HL-YYYY-XXXX)
bookingSchema.pre('save', async function (next) {
  if (!this.bookingId) {
    const year = new Date().getFullYear();
    // Count the number of current bookings to generate sequential sequence
    const count = await mongoose.model('Booking').countDocuments();
    const sequence = String(count + 1).padStart(4, '0');
    this.bookingId = `HL-${year}-${sequence}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
