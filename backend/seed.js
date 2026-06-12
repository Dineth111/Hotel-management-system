require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Room = require('./models/Room');
const Booking = require('./models/Booking');
const Review = require('./models/Review');
const HotelSettings = require('./models/HotelSettings');
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();
    console.log('Seeding database...');

    // 1. Seed Admin & Customer Users
    const salt = await bcrypt.genSalt(10);
    const pass123 = await bcrypt.hash('123', salt);

    let admin = await User.findOne({ email: 'admin@gmail.com' });
    if (!admin) {
      admin = await User.create({
        name: 'System Admin',
        email: 'admin@gmail.com',
        password: pass123,
        phone: '+94 77 123 4567',
        role: 'admin'
      });
      console.log('✔ Admin seeded (admin@gmail.com / 123)');
    }

    let customer = await User.findOne({ email: 'customer@gmail.com' });
    if (!customer) {
      customer = await User.create({
        name: 'Dineth Sanjula',
        email: 'customer@gmail.com',
        password: pass123,
        phone: '+94 71 142 4377',
        role: 'customer'
      });
      console.log('✔ Customer seeded (customer@gmail.com / 123)');
    }

    // 2. Seed Settings
    const settingsCount = await HotelSettings.countDocuments();
    if (settingsCount === 0) {
      await HotelSettings.create({
        hotelName: "Hotel Lanka Pro",
        address: "No 123, Galle Road, Kalagedihena, LK",
        phone: "+94 71 142 4377",
        email: "dinethsanjula647@gmail.com",
        whatsapp: "+94 71 142 4377",
        googleMapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.0433282245224!2d80.0544523758364!3d7.1209930160293345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2fb878b31a31d%3A0xe5a3f2d21faecf27!2sKalagedihena%20Junction!5e0!3m2!1sen!2slk!4v1718210000000!5m2!1sen!2slk",
        aboutText: "Welcome to Hotel Lanka Pro, your premium tropical getaway nestled along the beautiful coastline of Sri Lanka. We offer standard, deluxe, and suite rooms equipped with all modern amenities for a relaxing stay.",
        aboutImages: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80"
        ]
      });
      console.log('✔ Settings seeded');
    }

    // 3. Seed Rooms
    const roomsCount = await Room.countDocuments();
    let rooms = [];
    if (roomsCount === 0) {
      const sampleRooms = [
        {
          roomNumber: '101',
          name: 'Cosy Cozy Standard',
          type: 'Standard',
          pricePerNight: 5000,
          capacity: 2,
          bedType: 'Double',
          size: 250,
          amenities: ['WiFi', 'TV', 'Hot Water'],
          images: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80'],
          description: 'A cozy budget-friendly room perfect for solo travelers or couples.',
          status: 'Available'
        },
        {
          roomNumber: '201',
          name: 'Deluxe Ocean Vista',
          type: 'Deluxe',
          pricePerNight: 10000,
          capacity: 3,
          bedType: 'Queen',
          size: 350,
          amenities: ['AC', 'WiFi', 'TV', 'Hot Water'],
          images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80'],
          description: 'Spacious air-conditioned deluxe room offering beautiful coastal breeze views.',
          status: 'Available'
        }
      ];
      rooms = await Room.insertMany(sampleRooms);
      console.log('✔ Rooms seeded');
    } else {
      rooms = await Room.find();
    }

    // 4. Seed Bookings & Reviews
    const bookingsCount = await Booking.countDocuments();
    if (bookingsCount === 0 && rooms.length >= 2) {
      const b1 = await Booking.create({
        bookingId: 'BK-SAMPLE-101',
        userId: customer._id,
        roomId: rooms[0]._id,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        checkIn: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        checkOut: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        nights: 2,
        guests: 2,
        totalAmount: 10000,
        status: 'CheckedOut'
      });

      const b2 = await Booking.create({
        bookingId: 'BK-SAMPLE-201',
        userId: customer._id,
        roomId: rooms[1]._id,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        checkIn: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        checkOut: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        nights: 2,
        guests: 2,
        totalAmount: 20000,
        status: 'CheckedOut'
      });
      console.log('✔ Sample CheckedOut Bookings seeded');

      // Seed approved review for Room 101
      await Review.create({
        userId: customer._id,
        roomId: rooms[0]._id,
        bookingId: b1._id,
        customerName: customer.name,
        rating: 5,
        comment: 'Amazing stay! The room was very clean, Cozy, and the tropical breeze was refreshing.',
        isApproved: true
      });

      // Seed pending review for Room 201
      await Review.create({
        userId: customer._id,
        roomId: rooms[1]._id,
        bookingId: b2._id,
        customerName: customer.name,
        rating: 4,
        comment: 'Very beautiful ocean view and clean facilities. The front desk staff was very helpful.',
        isApproved: false
      });
      console.log('✔ Sample Reviews seeded (1 Approved, 1 Pending)');
    }

    console.log('Database seeding completed successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
