const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const HotelSettings = require('../models/HotelSettings');
const { isLoggedIn, isAdmin } = require('../middleware/auth');

// Protect all routes under /api/admin/settings
router.use(isLoggedIn, isAdmin);

// 1. Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-about-' + file.originalname.replace(/\s+/g, '-'));
  }
});

// 2. Configure Multer Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Images only (jpeg, jpg, png, webp)'));
  }
});

/**
 * @route   GET /api/admin/settings
 * @desc    Get hotel settings
 * @access  Admin only
 */
router.get('/', async (req, res) => {
  try {
    let settings = await HotelSettings.findOne();
    if (!settings) {
      settings = await HotelSettings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/admin/settings
 * @desc    Update hotel settings and upload new about page images
 * @access  Admin only
 */
router.put('/', upload.array('aboutImages', 5), async (req, res) => {
  try {
    let settings = await HotelSettings.findOne();
    if (!settings) {
      settings = new HotelSettings();
    }

    const { hotelName, address, phone, email, whatsapp, googleMapEmbedUrl, aboutText } = req.body;

    // Parse existing images to keep
    let existingAboutImages = [];
    if (req.body.existingAboutImages) {
      try {
        existingAboutImages = typeof req.body.existingAboutImages === 'string'
          ? JSON.parse(req.body.existingAboutImages)
          : req.body.existingAboutImages;
      } catch (e) {
        existingAboutImages = [req.body.existingAboutImages];
      }
    }

    // Find and delete removed images from disk
    const deletedImages = settings.aboutImages.filter(img => !existingAboutImages.includes(img));
    deletedImages.forEach(img => {
      const relativePath = img.replace(/^\//, '');
      const fullPath = path.join(__dirname, '..', relativePath);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (err) {
          console.error(`Failed to delete setting image: ${fullPath}`, err);
        }
      }
    });

    // Parse newly uploaded images
    const newImages = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    const updatedImages = [...existingAboutImages, ...newImages];

    // Update settings fields
    settings.hotelName = hotelName || settings.hotelName;
    settings.address = address || settings.address;
    settings.phone = phone || settings.phone;
    settings.email = email || settings.email;
    settings.whatsapp = whatsapp || settings.whatsapp;
    settings.googleMapEmbedUrl = googleMapEmbedUrl || settings.googleMapEmbedUrl;
    settings.aboutText = aboutText || settings.aboutText;
    settings.aboutImages = updatedImages;

    await settings.save();
    res.json({ message: 'Hotel settings updated successfully', settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
