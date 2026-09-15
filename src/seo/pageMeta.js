// Per-route title/description copy for every static page. Dynamic pages
// (service, industry, why-us detail pages) build their own metadata from
// the underlying data object instead — see each page component.
export const pageMeta = {
  home: {
    path: '/',
    title: 'Orian Teleservices | Bulk SMS, Voice & WhatsApp API',
    description:
      "Orian Teleservices is a bulk SMS provider and API platform offering voice API, WhatsApp Business API and DLT registration across 1,200+ carrier routes.",
  },
  about: {
    path: '/about',
    title: 'About Orian Teleservices | A Bulk SMS API Provider',
    description:
      'Orian Teleservices is built by messaging industry veterans with 15+ years handling OTT, enterprise and aggregator SMS, voice and WhatsApp API traffic.',
  },
  services: {
    path: '/services',
    title: 'Bulk SMS, Voice, DLT & WhatsApp API Services | Orian',
    description:
      "Explore Orian's bulk SMS service, voice API, DLT registration and WhatsApp API solutions — one enterprise messaging suite built on a carrier-grade network.",
  },
  industries: {
    path: '/industries',
    title: 'Industries We Serve with Bulk SMS & Voice API | Orian',
    description:
      "See how banks, hospitals, retailers and 20+ other industries use Orian's bulk SMS, voice API and WhatsApp API to reach customers reliably at scale.",
  },
  whyUs: {
    path: '/why-us',
    title: 'Why Choose Orian Teleservices for Bulk SMS Delivery?',
    description:
      'Six reasons enterprises stay with Orian: 24/7 support, best-price guarantee, instant DLT setup, a strong carrier network and high-speed SMS delivery.',
  },
  careers: {
    path: '/careers',
    title: 'Careers at Orian Teleservices | Join Our Team Today',
    description:
      "Join Orian Teleservices and help build the next carrier messaging backbone. We're scouting telecom routing, cloud and AI engineering talent for what's next.",
  },
  contact: {
    path: '/contact',
    title: 'Contact Orian Teleservices, Your Bulk SMS Provider',
    description:
      'Reach Orian Teleservices 24x7 by phone, email or our Nagpur office to start with bulk SMS, voice API, DLT registration or WhatsApp API services today.',
  },
  assistant: {
    path: '/assistant',
    title: 'Ask Orian AI | Live Bulk SMS & Voice API Assistant',
    description:
      "Ask Orian's AI assistant about bulk SMS pricing, DLT compliance, voice API or WhatsApp API onboarding and get a straight answer in under 10 seconds, 24/7.",
  },
};

// Hand-written, keyword-targeted title/description per service slug (these
// are the primary "bulk sms api" / "voice API" / "DLT registration" /
// "WhatsApp API" keyword pages). Falls back to an auto-generated pair in
// ServiceDetailPage.jsx for any future service slug added to data/services.js
// that isn't listed here yet.
export const serviceMeta = {
  'bulk-sms-otp-gateways': {
    title: 'Bulk SMS & OTP Gateway API Provider | Orian Teleservices',
    description:
      "Send bulk SMS and OTPs in under a second with Orian's bulk SMS API — 1,200+ operator routes, 99.98% delivery rate, and same-day sandbox access.",
  },
  'voice-sms-ivr': {
    title: 'Voice API, IVR & Voice Broadcasting | Orian Teleservices',
    description:
      "Orian's voice API powers automated voice broadcasting, OBD and interactive voice response at carrier scale — 10,000+ concurrent calls, 15+ languages.",
  },
  'dlt-compliance': {
    title: 'DLT Registration & TRAI Compliance | Orian Teleservices',
    description:
      'Get TRAI DLT registration handled end-to-end by Orian — entity, header and template filing so your bulk SMS campaigns launch fully compliant, fast.',
  },
  'whatsapp-business-api': {
    title: 'WhatsApp Business API Provider | Orian Teleservices',
    description:
      'Launch on the WhatsApp API with Orian: verified business setup, approved templates, chatbot flows and two-way conversations synced to your CRM.',
  },
};

export const notFoundMeta = {
  path: '/404',
  title: 'Page Not Found | Orian Teleservices',
  description: "The page you're looking for doesn't exist or has moved. Find bulk SMS, voice API and WhatsApp API resources from our homepage instead.",
};
 