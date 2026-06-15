require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const adminRoomRoutes = require('./routes/adminRooms');
const bookingRoutes = require('./routes/bookings');
const adminBookingRoutes = require('./routes/adminBookings');
const contactRoutes = require('./routes/contact');
const adminContactRoutes = require('./routes/adminContact');
const settingsRoutes = require('./routes/settings');
const adminSettingsRoutes = require('./routes/adminSettings');
const couponRoutes = require('./routes/coupons');
const reviewsRoutes = require('./routes/reviews');

// Initialize express app
const app = express();

// Initialize WhatsApp Client for automated notifications
const { initWhatsApp } = require('./utils/whatsappService');
initWhatsApp();

// Create uploads folder if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Connect to MongoDB Database
connectDB();

// CORS Middleware Configuration
app.use(cors({
  origin: 'http://localhost:5173', // Frontend local dev URL
  credentials: true // Crucial for session cookies to be sent/received
}));

// Body parser middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder statically
app.use('/uploads', express.static(uploadsDir));

// Express Session Middleware Setup (Session-based Auth)
app.use(session({
  secret: process.env.SESSION_SECRET || 'hotel_lanka_fallback_secret_xyz',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    httpOnly: true, // Prevents client-side JS from accessing the cookie
    secure: false, // Set to true in production if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // Cookie expiration: 24 hours
  }
}));

// Route Middlewares
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/admin/rooms', adminRoomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin/bookings', adminBookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin/contact-messages', adminContactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin/settings', adminSettingsRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewsRoutes);

// Welcome / Status Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Hotel Lanka Pro API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An internal server error occurred' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
