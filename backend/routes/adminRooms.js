const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Room = require('../models/Room');
const { isLoggedIn, isAdmin } = require('../middleware/auth');

// Protect all routes under /api/admin/rooms
router.use(isLoggedIn, isAdmin);

// 1. Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
  }
});

// 2. Configure Multer File Filtering & Size Limits
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
 * Helper to parse amenities input from form body
 */
const parseAmenities = (amenitiesInput) => {
  if (!amenitiesInput) return ['AC', 'WiFi', 'TV', 'Hot Water'];
  if (Array.isArray(amenitiesInput)) return amenitiesInput;
  if (typeof amenitiesInput === 'string') {
    try {
      return JSON.parse(amenitiesInput);
    } catch (e) {
      return amenitiesInput.split(',').map(item => item.trim());
    }
  }
  return ['AC', 'WiFi', 'TV', 'Hot Water'];
};

/**
 * @route   POST /api/admin/rooms
 * @desc    Create a new room listing
 * @access  Admin only
 */
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const { roomNumber, name, type, pricePerNight, capacity, bedType, size, description, status } = req.body;

    if (!roomNumber || !name || !type || !pricePerNight || !capacity || !bedType || !size || !description) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const roomExists = await Room.findOne({ roomNumber });
    if (roomExists) {
      return res.status(400).json({ message: 'Room number already exists' });
    }

    const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const room = await Room.create({
      roomNumber,
      name,
      type,
      pricePerNight,
      capacity,
      bedType,
      size,
      amenities: parseAmenities(req.body.amenities),
      images: imagePaths,
      description,
      status: status || 'Available'
    });

    res.status(201).json({ message: 'Room created successfully', room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/admin/rooms/:id
 * @desc    Update an existing room details & handle image replacement
 * @access  Admin only
 */
router.put('/:id', upload.array('images', 5), async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const { roomNumber, name, type, pricePerNight, capacity, bedType, size, description, status } = req.body;

    // Parse existing images to keep
    let existingImages = [];
    if (req.body.existingImages) {
      try {
        existingImages = typeof req.body.existingImages === 'string' 
          ? JSON.parse(req.body.existingImages) 
          : req.body.existingImages;
      } catch (e) {
        existingImages = [req.body.existingImages];
      }
    }

    // Find deleted images and remove from file system
    const deletedImages = room.images.filter(img => !existingImages.includes(img));
    deletedImages.forEach(img => {
      const relativePath = img.replace(/^\//, '');
      const fullPath = path.join(__dirname, '..', relativePath);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (err) {
          console.error(`Failed to delete file: ${fullPath}`, err);
        }
      }
    });

    // Parse newly uploaded images
    const newImages = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    const updatedImages = [...existingImages, ...newImages];

    // Update room fields
    room.roomNumber = roomNumber || room.roomNumber;
    room.name = name || room.name;
    room.type = type || room.type;
    room.pricePerNight = pricePerNight || room.pricePerNight;
    room.capacity = capacity || room.capacity;
    room.bedType = bedType || room.bedType;
    room.size = size || room.size;
    room.amenities = req.body.amenities ? parseAmenities(req.body.amenities) : room.amenities;
    room.description = description || room.description;
    room.status = status || room.status;
    room.images = updatedImages;

    await room.save();
    res.json({ message: 'Room updated successfully', room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   DELETE /api/admin/rooms/:id
 * @desc    Delete a room listing & delete image files
 * @access  Admin only
 */
router.delete('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Delete image files from storage
    room.images.forEach(img => {
      const relativePath = img.replace(/^\//, '');
      const fullPath = path.join(__dirname, '..', relativePath);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (err) {
          console.error(`Failed to delete file: ${fullPath}`, err);
        }
      }
    });

    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
