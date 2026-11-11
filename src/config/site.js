// Site-wide contact, status and image settings.

// Helpline numbers already published on the existing site.
export const PHONE_PRIMARY = '+919552556786';
export const PHONE_PRIMARY_DISPLAY = '+91 95525 56786';
export const EMAIL_SALES = 'orianteleservices@gmail.com';
export const EMAIL_SUPPORT = 'support@orian.in';

// Confirm this published contact number is registered on WhatsApp before relying on the link.
export const WHATSAPP_NUMBER = '919552556786';
export const whatsappLink = (text = 'Hello Orian, I would like to talk about bulk SMS.') =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

// Internal metrics page; this does not show live incident monitoring.
export const STATUS_PAGE_URL = '/status';

// Image slots. Set `src` once you generate the image (see the prompts you were given);
// until then a quiet labelled frame is shown. Sizes are the final display size.
export const IMAGE_SLOTS = {
  'usecase-otp': { src: 'o2/uc-otp.webp', w: 1600, h: 900, label: 'Use case: OTP and verification' },
  'usecase-alerts': { src: 'o2/uc-alerts.webp', w: 1600, h: 900, label: 'Use case: transactional alerts' },
  'usecase-campaigns': { src: 'o2/uc-campaigns.webp', w: 1600, h: 900, label: 'Use case: promotional campaigns' },
  'usecase-reminders': { src: 'o2/uc-reminders.webp', w: 1600, h: 900, label: 'Use case: reminders' },
};
