const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const ContactMessage = require('../models/ContactMessage');
const HotelSettings = require('../models/HotelSettings');

// Configure Nodemailer transporter using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Helper function to send email notification to admin upon new contact message
 */
const sendContactEmail = async (contactMsg) => {
  try {
    const settings = await HotelSettings.findOne();
    const adminEmail = settings ? settings.email : 'admin@gmail.com';

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: `New Contact Message - Hotel Lanka Pro`,
      text: `Dear Admin,

You have received a new contact message on Hotel Lanka Pro.

Sender Details:
------------------------------------------
Name:    ${contactMsg.name}
Email:   ${contactMsg.email}
Phone:   ${contactMsg.phone}
Subject: ${contactMsg.subject}

Message:
------------------------------------------
${contactMsg.message}

Please log in to the admin panel to view and manage this message.

Regards,
Hotel Lanka Pro System`
    };

    await transporter.sendMail(mailOptions);
    console.log(`✔ Contact message email sent successfully to ${adminEmail}`);
  } catch (error) {
    // Catch email errors silently so API doesn't fail if SMTP values in .env are dummy
    console.warn(`⚠ Failed to send contact email alert: ${error.message}`);
  }
};

/**
 * @route   POST /api/contact
 * @desc    Save a new contact message and email the admin
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const contactMsg = await ContactMessage.create({
      name,
      email,
      phone,
      subject,
      message
    });

    // Send email alert in background
    sendContactEmail(contactMsg);

    res.status(201).json({ message: 'Message sent successfully', contactMsg });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
