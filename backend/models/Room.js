const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, 'Please provide room number'],
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Please provide room name']
  },
  type: {
    type: String,
    enum: ['Standard', 'Deluxe', 'Suite'],
    required: [true, 'Please provide room type']
  },
  pricePerNight: {
    type: Number,
    required: [true, 'Please provide price per night']
  },
  capacity: {
    type: Number,
    required: [true, 'Please provide room guest capacity']
  },
  bedType: {
    type: String,
    required: [true, 'Please provide bed type']
  },
  size: {
    type: Number, // size in sq ft
    required: [true, 'Please provide room size']
  },
  amenities: {
    type: [String],
    default: ['AC', 'WiFi', 'TV', 'Hot Water']
  },
  images: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    required: [true, 'Please provide description']
  },
  status: {
    type: String,
    enum: ['Available', 'Maintenance'],
    default: 'Available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Room', roomSchema);
