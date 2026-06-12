/**
 * SMS Notification Service
 * Fully structured for live integration with Twilio or local gateways.
 */
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
      // Fallback: log to backend console during local development or when credentials are dummy
      console.log(`\n--- MOCK SMS NOTIFICATION ---`);
      console.log(`To: ${customerPhone}`);
      console.log(`Message: ${message}`);
      console.log(`------------------------------\n`);
      return { mock: true, success: true };
    }
  } catch (error) {
    console.error(`[SMS ERROR] Failed to send SMS: ${error.message}`);
  }
};

module.exports = { sendSMSNotification };
