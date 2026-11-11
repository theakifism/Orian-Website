// Use-case pages: /use-cases and /use-cases/:slug. Copy is practical and
// contains no performance claims or customer names.

export const useCases = [
  {
    slug: 'otp-verification',
    metaTitle: 'OTP & Verification SMS Use Case | Orian Teleservices',
    metaDescription: 'Learn about OTP SMS for sign-in, payments and account changes, then ask Orian about registration, integration and delivery reporting options.',
    title: 'OTP and verification',
    short: 'One-time passwords for sign-in, payments and account changes.',
    image: 'usecase-otp',
    services: ['bulk-sms-otp-gateways', 'dlt-compliance', 'voice-sms-ivr'],
    guides: ['otp-best-practices', 'bulk-sms-delivery-reports-explained'],
  },
  {
    slug: 'transactional-alerts',
    metaTitle: 'Transactional SMS Alerts Use Case | Orian Teleservices',
    metaDescription: 'Send order, payment and booking alerts triggered by your system, with registered templates and per-message delivery status. See how to set it up with Orian.',
    title: 'Transactional alerts',
    short: 'Order, payment, banking and account notifications.',
    image: 'usecase-alerts',
    services: ['bulk-sms-otp-gateways', 'dlt-compliance'],
    guides: [
      'bulk-sms-delivery-reports-explained',
      'promotional-vs-transactional-sms',
    ],
  },
  {
    slug: 'promotional-campaigns',
    metaTitle: 'Promotional SMS Campaigns Use Case | Orian Teleservices',
    metaDescription: 'Run consent-based promotional SMS campaigns with registered templates, CSV or API lists, scheduling and delivery reports. Plan your next send with Orian.',
    title: 'Promotional campaigns',
    short: 'Offers, launches and announcements to consenting customers.',
    image: 'usecase-campaigns',
    services: ['bulk-sms-otp-gateways', 'dlt-compliance', 'whatsapp-business-api'],
    guides: ['promotional-vs-transactional-sms', 'sms-segments-explained'],
  },
  {
    slug: 'reminders',
    metaTitle: 'SMS Reminders for Appointments & Dues | Orian Teleservices',
    metaDescription: 'Automate appointment, payment and renewal reminders by scheduled SMS, with optional voice follow-up for no-replies. See how to set it up with Orian.',
    title: 'Reminders',
    short: 'Appointments, renewals, due dates and scheduled notices.',
    image: 'usecase-reminders',
    services: ['bulk-sms-otp-gateways', 'voice-sms-ivr', 'whatsapp-business-api'],
    guides: ['dlt-template-basics', 'sender-id-approval-guide'],
  },
];

export const getUseCase = (slug) => useCases.find((u) => u.slug === slug);
