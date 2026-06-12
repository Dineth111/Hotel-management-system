const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const { isLoggedIn, isAdmin } = require('../middleware/auth');

// Protect all routes under /api/admin/contact-messages
router.use(isLoggedIn, isAdmin);

/**
 * @route   GET /api/admin/contact-messages
 * @desc    Get all contact messages (can filter by isRead, e.g. ?isRead=false)
 * @access  Admin only
 */
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.isRead !== undefined) {
      filter.isRead = req.query.isRead === 'true';
    }
    const messages = await ContactMessage.find(filter).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/admin/contact-messages/:id/read
 * @desc    Mark a contact message as read
 * @access  Admin only
 */
router.put('/:id/read', async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    message.isRead = true;
    await message.save();

    res.json({ message: 'Message marked as read', contactMsg: message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   DELETE /api/admin/contact-messages/:id
 * @desc    Delete a contact message
 * @access  Admin only
 */
router.delete('/:id', async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
