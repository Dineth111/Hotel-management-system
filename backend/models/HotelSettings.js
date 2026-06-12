const mongoose = require('mongoose');

const hotelSettingsSchema = new mongoose.Schema({
  hotelName: {
    type: String,
    default: "Hotel Lanka Pro"
  },
  address: {
    type: String,
    default: "No 123, Galle Road, Kalagedihena, LK"
  },
  phone: {
    type: String,
    default: "+94 77 123 4567"
  },
  email: {
    type: String,
    default: "admin@gmail.com"
  },
  whatsapp: {
    type: String,
    default: "+94 77 123 4567"
  },
  googleMapEmbedUrl: {
    type: String,
    default: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.58585978183!2d79.82118587127926!3d6.921837435265691!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2593cf65a1e9d%3A0xe13da4b800e27f01!2sColombo!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk"
  },
  aboutText: {
    type: String,
    default: "Welcome to Hotel Lanka Pro, your premium tropical getaway nestled along the beautiful coastline of Sri Lanka. We offer standard, deluxe, and suite rooms equipped with all modern amenities for a relaxing stay."
  },
  aboutImages: {
    type: [String],
    default: []
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp on changes
hotelSettingsSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('HotelSettings', hotelSettingsSchema);
