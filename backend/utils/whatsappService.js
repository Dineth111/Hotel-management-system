const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let whatsappClient = null;
let isReady = false;

const initWhatsApp = () => {
  whatsappClient = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ],
    }
  });

  whatsappClient.on('qr', (qr) => {
    console.log('\n========================================');
    console.log('  📱 WHATSAPP SETUP - SCAN QR CODE BELOW');
    console.log('========================================');
    console.log('Open WhatsApp → Settings → Linked Devices → Link a Device\n');
    qrcode.generate(qr, { small: true });
    console.log('========================================\n');
  });

  whatsappClient.on('ready', () => {
    console.log('✅ [WhatsApp] Client is ready! Automated WhatsApp messages are now active.');
    isReady = true;
  });

  whatsappClient.on('authenticated', () => {
    console.log('🔐 [WhatsApp] Authenticated successfully.');
  });

  whatsappClient.on('auth_failure', msg => {
    console.error('❌ [WhatsApp] Authentication failure:', msg);
    isReady = false;
  });

  whatsappClient.on('disconnected', (reason) => {
    console.log('⚠️  [WhatsApp] Client disconnected:', reason);
    isReady = false;
  });

  whatsappClient.initialize().catch(err => {
    console.error('❌ [WhatsApp] Failed to initialize:', err.message);
  });
};

const sendWhatsAppMessage = async (phone, message) => {
  if (!whatsappClient || !isReady) {
    console.log('\n--- WHATSAPP NOT READY (MOCK LOG) ---');
    console.log(`To: ${phone}`);
    console.log(`Message: ${message}`);
    console.log(`-------------------------------------\n`);
    return { success: false, reason: 'Client not ready' };
  }

  try {
    // Remove all non-digits
    let cleanPhone = phone.replace(/\D/g, '');

    // Handle Sri Lanka local numbers starting with 0 (e.g. 0711234567 → 94711234567)
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '94' + cleanPhone.substring(1);
    } else if (cleanPhone.length === 9) {
      // Local number without leading 0 (e.g. 711234567)
      cleanPhone = '94' + cleanPhone;
    }

    const chatId = `${cleanPhone}@c.us`;

    await whatsappClient.sendMessage(chatId, message);
    console.log(`✅ [WhatsApp SUCCESS] Message sent to +${cleanPhone}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ [WhatsApp ERROR] Failed to send message to ${phone}:`, error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  initWhatsApp,
  sendWhatsAppMessage
};
