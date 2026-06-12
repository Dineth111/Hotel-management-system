/**
 * Formats a phone number and message into a valid WhatsApp web/app link.
 * Handles Sri Lankan local formatting by replacing leading '0' with country code '94'.
 */
export const formatWhatsAppUrl = (phone, text = '') => {
  if (!phone) return '';
  let clean = phone.replace(/\D/g, ''); // Strip all non-digits
  
  // Replace local Sri Lankan leading '0' with international '94'
  if (clean.startsWith('0') && !clean.startsWith('00')) {
    clean = '94' + clean.slice(1);
  }
  
  return `https://wa.me/${clean}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
};
