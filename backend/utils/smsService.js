/**
 * Notification Service
 * Integrates automated WhatsApp notifications via whatsapp-web.js
 */
const { sendWhatsAppMessage } = require('./whatsappService');

const sendSMSNotification = async (customerPhone, message) => {
  try {
    const cleanPhone = customerPhone.replace(/\D/g, '');
    
    // Check if Twilio environment variables are configured
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
      const twilio = require('twilio');
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      
      // Ensure phone starts with '+' for global E.164 formatting
      const formattedPhone = customerPhone.startsWith('+') ? customerPhone : `+${cleanPhone}`;
      
      const response = await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedPhone
      });
      
      console.log(`[SMS SUCCESS] Message SID: ${response.sid} sent to ${formattedPhone}`);
      return response;
    } else {
      // If no Twilio configured, use WhatsApp automatically!
      return await sendWhatsAppMessage(customerPhone, message);
    }
  } catch (error) {
    console.error(`[NOTIFICATION ERROR] Failed to send message: ${error.message}`);
  }
};

module.exports = { sendSMSNotification };
