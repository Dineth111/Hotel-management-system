require('dotenv').config();
const mongoose = require('mongoose');
const HotelSettings = require('./models/HotelSettings');
const connectDB = require('./config/db');

const updateSettings = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB...');

    // Update settings
    const result = await HotelSettings.updateMany({}, {
      $set: {
        phone: "+94 71 142 4377",
        email: "dinethsanjula647@gmail.com",
        whatsapp: "+94 71 142 4377"
      }
    });

    console.log(`Settings updated successfully. Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
    mongoose.connection.close();
  } catch (error) {
    console.error('Error updating settings:', error);
    process.exit(1);
  }
};

updateSettings();
