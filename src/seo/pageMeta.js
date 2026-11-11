import { whyUsData } from '../data/whyUs.js';

const NUMBER_WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
export const whyUsCountWord = NUMBER_WORDS[whyUsData.length] || String(whyUsData.length);

// Per-route title/description copy for every static page. Dynamic pages
// (service, industry, why-us detail pages) build their own metadata from
// the underlying data object instead — see each page component.
export const pageMeta = {
  home: {
    path: '/',
    title: 'Orian Teleservices | Bulk SMS Provider & API Gateway',
    description:
      "Explore bulk SMS and OTP services from Orian Teleservices, with direct operator routes, API integration, 24/7 support and delivery reports for every message.",
  },
  about: {
    path: '/about',
    title: 'About Orian Teleservices | A Bulk SMS API Provider',
    description:
      'Learn about Orian Teleservices and its business messaging services, direct operator routes, API integration and 24/7 support.',
  },
  services: {
    path: '/services',
    title: 'Bulk SMS, Voice, DLT, WhatsApp, Marketing & IT | Orian',
    description:
      "Explore Orian's bulk SMS, voice, DLT assistance, WhatsApp Business API, digital marketing and IT services. Ask our team which options fit your requirements.",
  },
  industries: {
    path: '/industries',
    title: 'Industries We Serve with Bulk SMS & Voice API | Orian',
    description:
      "See how banks, hospitals, retailers and other industries use Orian's bulk SMS, voice API and WhatsApp API to reach customers reliably at scale.",
  },
  whyUs: {
    path: '/why-us',
    title: 'Why Choose Orian Teleservices for Bulk SMS Delivery?',
    description:
      `${whyUsCountWord} topics to review with Orian: customer support, security questions, DLT assistance, SMS routing and delivery reporting.`,
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
      'Contact Orian Teleservices 24/7 by phone, email or WhatsApp, or visit the Nagpur office for messaging and communication services.',
  },
  assistant: {
    path: '/assistant',
    title: 'Ask Orian AI | Bulk SMS and Messaging Assistant',
    description:
      "Ask Orian's AI assistant general questions about bulk SMS, DLT compliance, voice and WhatsApp services, or contact the team about your requirements.",
  },
  privacy: {
    path: '/privacy',
    title: 'Privacy Policy | Orian Teleservices',
    description:
      'Read how Orian Teleservices collects, uses and protects the personal data you share through our website, messaging platform and support channels.',
  },
  terms: {
    path: '/terms',
    title: 'Terms of Service | Orian Teleservices',
    description:
      "The terms and conditions that govern use of Orian Teleservices' website, bulk SMS, voice API, WhatsApp API and other messaging services.",
  },
  helpCenter: {
    path: '/help-center',
    title: 'Help Center | Orian Teleservices Support',
    description:
      'Find answers on bulk SMS, voice API, WhatsApp Business API, DLT compliance and billing — or reach the Orian support team directly.',
  },
  useCases: {
    path: '/use-cases',
    title: 'Bulk SMS Use Cases: OTP, Alerts, Campaigns | Orian',
    description: 'OTP and verification, transactional alerts, promotional campaigns and reminders: how each type of SMS is set up and sent with Orian Teleservices.',
  },
  compliance: {
    path: '/compliance',
    title: 'DLT Registration and SMS Compliance Centre | Orian',
    description: 'DLT registration, sender IDs, message templates and consent for SMS in India, with a step-by-step onboarding guide from Orian Teleservices.',
  },
  developers: {
    path: '/developers',
    title: 'Messaging Integration Enquiries | Orian Teleservices',
    description: 'Explore Orian’s messaging API options, request technical documentation and sandbox access, and discuss delivery reports and integration support with our team.',
  },
  status: {
    path: '/status',
    title: 'Platform Metrics | Orian Teleservices',
    description: 'View Orian Teleservices reported uptime and message delivery metrics, and contact the support team about a service issue.',
  },
  resources: {
    path: '/resources',
    title: 'Resources & Guides | Orian Teleservices',
    description:
      'Guides on bulk SMS, WhatsApp Business API setup, DLT registration and voice/IVR — practical notes from the Orian Teleservices team.',
  },
};

// Hand-written, keyword-targeted title/description per service slug (these
// are the primary "bulk sms api" / "voice API" / "DLT registration" /
// "WhatsApp API" keyword pages). Falls back to an auto-generated pair in
// ServiceDetailPage.jsx for any future service slug added to data/services.js
// that isn't listed here yet.
export const serviceMeta = {
  'social-media-handling': {
    title: 'Social Media Handling Services | Orian Teleservices',
    description:
      'Content planning, scheduling and community replies for your business pages, handled by one team alongside your SMS and WhatsApp messaging.',
  },
  'bulk-sms-otp-gateways': {
    title: 'Bulk SMS and OTP Messaging | Orian Teleservices',
    description:
      'Orian bulk SMS and OTP services include API integration, direct operator routes, 24/7 support and delivery reports for every message.',
  },
  'voice-sms-ivr': {
    title: 'Voice API, IVR & Voice Broadcasting | Orian Teleservices',
    description:
      "Orian's voice API powers automated voice broadcasting, OBD and interactive voice response at carrier scale, with call logs for every leg.",
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
  'it-solutions': {
    title: 'Managed IT Solutions & Infrastructure | Orian Teleservices',
    description:
      'Discuss managed IT solutions from Orian, including cloud hosting, network setup, security services and helpdesk support for your business.',
  },
};

export const notFoundMeta = {
  path: '/404',
  title: 'Page Not Found | Orian Teleservices',
  description: "The page you're looking for doesn't exist or has moved. Find bulk SMS, voice API and WhatsApp API resources from our homepage instead.",
};
