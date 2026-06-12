require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Room = require('./models/Room');
const HotelSettings = require('./models/HotelSettings');
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    console.log('Seeding database...');

    // 2. Seed Admin User
    const adminEmail = 'admin@gmail.com';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('123', 10);
      await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: hashedPassword,
        phone: '+94 77 123 4567',
        role: 'admin'
      });
      console.log('✔ Default Admin created (admin@gmail.com / 123)');
    } else {
      console.log('✔ Admin user already exists');
    }

    // 3. Seed Hotel Settings
    const settingsCount = await HotelSettings.countDocuments();
    if (settingsCount === 0) {
      await HotelSettings.create({
        hotelName: "Hotel Lanka Pro",
        address: "No 123, Galle Road, Kalagedihena, LK",
        phone: "+94 71 142 4377",
        email: "dinethsanjula647@gmail.com",
        whatsapp: "+94 71 142 4377",
        googleMapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.0433282245224!2d80.0544523758364!3d7.1209930160293345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2fb878b31a31d%3A0xe5a3f2d21faecf27!2sKalagedihena%20Junction!5e0!3m2!1sen!2slk!4v1718210000000!5m2!1sen!2slk",
        aboutText: "Welcome to Hotel Lanka Pro, your premium tropical getaway nestled along the beautiful coastline of Sri Lanka. We offer standard, deluxe, and suite rooms equipped with all modern amenities for a relaxing stay. Experience world-class hospitality, fine dining, and beautiful coastal views.",
        aboutImages: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80"
        ]
      });
      console.log('✔ Default Hotel Settings created');
    } else {
      console.log('✔ Hotel Settings already exists');
    }

    // 4. Seed Sample Rooms
    const roomsCount = await Room.countDocuments();
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
          description: 'A cozy budget-friendly room perfect for solo travelers or couples. Features a comfortable double bed, high-speed WiFi, television, and private bathroom with hot water.',
          status: 'Available'
        },
        {
          roomNumber: '102',
          name: 'Standard Twin Retreat',
          type: 'Standard',
          pricePerNight: 5500,
          capacity: 2,
          bedType: 'Twin',
          size: 280,
          amenities: ['WiFi', 'TV', 'Hot Water'],
          images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80'],
          description: 'Comfortable standard room equipped with two twin beds. Ideal for friends or business colleagues traveling together. High speed WiFi and hot water included.',
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
          description: 'Spacious air-conditioned deluxe room offering beautiful coastal breeze views. Features a plush Queen size bed, additional daybed, high speed internet, and flat-screen TV.',
          status: 'Available'
        },
        {
          roomNumber: '202',
          name: 'Deluxe King Sanctuary',
          type: 'Deluxe',
          pricePerNight: 9500,
          capacity: 2,
          bedType: 'King',
          size: 380,
          amenities: ['AC', 'WiFi', 'TV', 'Hot Water'],
          images: ['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=600&q=80'],
          description: 'Experience comfort in this air-conditioned room featuring an ultra-comfortable King size bed. Complete with writing desk, mini-fridge, high-speed WiFi, and modern bathroom.',
          status: 'Available'
        },
        {
          roomNumber: '301',
          name: 'Presidential Royal Suite',
          type: 'Suite',
          pricePerNight: 25000,
          capacity: 4,
          bedType: 'King',
          size: 600,
          amenities: ['AC', 'WiFi', 'TV', 'Hot Water'],
          images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80'],
          description: 'Our premium suite featuring a massive living area, master bedroom with King bed, modern layout, private balcony, and top-tier luxury amenities for a perfect vacation.',
          status: 'Available'
        },
        {
          roomNumber: '302',
          name: 'Honeymoon Luxury Suite',
          type: 'Suite',
          pricePerNight: 20000,
          capacity: 2,
          bedType: 'King',
          size: 500,
          amenities: ['AC', 'WiFi', 'TV', 'Hot Water'],
          images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80'],
          description: 'Elegantly decorated suite designed specifically for couples. Features special room configuration, a king-size bed, private balcony, luxury bathroom fixtures, and complementary setup.',
          status: 'Available'
        }
      ];

      await Room.insertMany(sampleRooms);
      console.log('✔ 6 Sample Rooms successfully seeded');
    } else {
      console.log('✔ Rooms already exist in database');
    }

    console.log('Database seeding completed successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
