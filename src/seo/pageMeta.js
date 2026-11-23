import { whyUsData } from '../data/whyUs.js';

const NUMBER_WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
export const whyUsCountWord = NUMBER_WORDS[whyUsData.length] || String(whyUsData.length);

// Per-route title/description copy for every static page. Dynamic pages
// (service, industry, why-us detail pages) build their own metadata from
// the underlying data object instead — see each page component.
export const pageMeta = {
  home: {
    path: '/',
    title: 'Orian Teleservices | Bulk SMS Service Provider in India',
    description:
      'Find Orian Teleservices for bulk SMS in India: OTP, transactional alerts and campaigns, with API integration, delivery reports, voice and DLT guidance.',
  },
  about: {
    path: '/about',
    title: 'About Orian Teleservices | A Bulk SMS API Provider',
    description:
      'Learn about Orian Teleservices and its business communication services, including bulk SMS, OTP messaging, voice, WhatsApp Business API and DLT help.',
  },
  services: {
    path: '/services',
    title: 'Messaging, Email & Digital Services | Orian Teleservices',
    description:
      "Explore Orian's SMS, voice, WhatsApp, RCS and email services, along with digital solutions and IT support for businesses.",
  },
  industries: {
    path: '/industries',
    title: 'Industries We Serve with Bulk SMS & Voice API | Orian',
    description:
      "Explore messaging use cases for banking, healthcare, retail, education and other sectors, then discuss your organization's requirements with Orian.",
  },
  whyUs: {
    path: '/why-us',
    title: 'Why Choose Orian Teleservices for Bulk SMS Delivery?',
    description:
      `${whyUsCountWord} topics to review with Orian: customer support, security questions, DLT assistance, SMS routing and delivery reporting.`,
  },
  careers: {
    path: '/careers',
    title: 'Careers at Orian Teleservices | Open Applications',
    description:
      'No roles are currently listed. Learn about teams at Orian Teleservices and how to send an open application for future business communication roles.',
  },
  contact: {
    path: '/contact',
    title: 'Contact Orian Teleservices, Your Bulk SMS Provider',
    description:
      'Find Orian Teleservices phone, email and office details in Nagpur. Contact the team about bulk SMS, voice, WhatsApp Business API or DLT assistance.',
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
      'Browse answers about bulk SMS, voice API, WhatsApp Business API and DLT registration, or contact Orian Teleservices with a service question.',
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
    title: 'Service Information | Orian Teleservices',
    description: 'Learn what Orian message delivery reports can tell you, what can affect delivery, and how to contact support with a service question.',
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
  'email-services': {
    title: 'Email Services for Businesses | Orian Teleservices',
    description: 'Discuss business email campaigns, audience preparation, message design and reporting options with Orian Teleservices for your business.',
  },
  'digital-solutions': {
    title: 'Digital & IT Solutions for Businesses | Orian Teleservices',
    description: 'Explore websites, workflow improvements, integrations, hosting, network security and helpdesk support with Orian Teleservices.',
  },
  'rcs-business-messaging': {
    title: 'RCS Business Messaging | Orian Teleservices',
    description: 'Explore rich, branded RCS business messaging and discuss content, network availability and integration needs with Orian.',
  },
  'transaction-email': {
    title: 'Transaction Email Services | Orian Teleservices',
    description: 'Discuss automated transaction emails for receipts and account updates, including event triggers and application integration.',
  },
  'social-media-handling': {
    title: 'Social Media Handling Services | Orian Teleservices',
    description:
      'Learn about Orian social media handling for business pages, including content support and community management. Discuss channels and scope with the team.',
  },
  'bulk-sms-otp-gateways': {
    title: 'Bulk SMS API for OTP, Alerts & Campaigns | Orian',
    description:
      'Send OTP, transactional and promotional bulk SMS with Orian. Explore SMS API integration, delivery reports and setup support for businesses in India.',
  },
  'voice-sms-ivr': {
    title: 'Voice API, IVR & Voice Broadcasting | Orian Teleservices',
    description:
      'Explore Orian voice broadcasting, outbound voice calls and IVR options for business communication. Discuss routing, integration and reporting needs.',
  },
  'dlt-compliance': {
    title: 'DLT Registration & TRAI Compliance | Orian Teleservices',
    description:
      'Understand DLT registration for business SMS, including principal entities, sender headers and message templates, and discuss application support with Orian.',
  },
  'whatsapp-business-api': {
    title: 'WhatsApp Business API Provider | Orian Teleservices',
    description:
      'Explore WhatsApp Business API messaging, templates and integration options for customer conversations. Contact Orian to discuss onboarding requirements.',
  },
};

export const notFoundMeta = {
  path: '/404',
  title: 'Page Not Found | Orian Teleservices',
  description: "The page you're looking for doesn't exist or has moved. Find bulk SMS, voice API and WhatsApp API resources from our homepage instead.",
};
