// Resources / blog template data. Each guide renders at /resources/:slug.
// Add a guide by adding an object here: it gets a page, a card, JSON-LD and a sitemap entry.
// Guides are practical and general; they make no performance claims.
// Block types: { h: 'Heading' }, { p: 'Paragraph' }, { ul: ['item', ...] }.

// TODO(review): facts to confirm before relying on the new guides (kept here, not on the page):
//  - trai-dlt-registration-process: current document list, whether one operator portal suffices, timelines
//  - promotional-vs-transactional-sms: current category names, permitted promotional hours, consent rules
//  - sender-id-approval-guide: header length/format and the category suffix/prefix shown on handsets
//  - whatsapp-business-api-pricing-explained: Meta's current category definitions, 24-hour window rules, volume tiers
//  - bulk-sms-delivery-reports-explained: Orian's own DLR statuses, webhook signing, retry behaviour, billing of failed messages
//  - smpp-vs-rest-api: which interfaces Orian actually offers (REST, SMPP) and their throughput limits
// Fields: services = slugs for the "Related services" links; modified = optional update date used for lastmod/dateModified.
export const guides = [
  {
    slug: 'sms-segments-explained',
    metaTitle: 'How SMS Segments Work | Orian Teleservices',
    metaDescription: 'Learn why one SMS can count as two or three segments, how GSM-7 and Unicode limits differ, and how to keep each message to one segment and lower cost.',
    category: 'SMS',
    title: 'How SMS segments work: counting characters the right way',
    summary: 'Why one message can count as two or three, and how to keep it to one.',
    date: '2026-10-01',
    read: '4 min read',
    services: ['bulk-sms-otp-gateways', 'dlt-compliance'],
  },
  {
    slug: 'dlt-template-basics',
    metaTitle: 'DLT Template Basics and Rejections | Orian Teleservices',
    metaDescription: 'A plain guide to DLT templates, variables and categories, plus the common reasons templates are rejected and habits that help yours get approved first time.',
    category: 'Compliance',
    title: 'DLT templates: what to write and what gets rejected',
    summary: 'A plain guide to templates, variables and common reasons for rejection.',
    date: '2026-09-24',
    read: '5 min read',
    services: ['dlt-compliance', 'bulk-sms-otp-gateways'],
  },
  {
    slug: 'otp-best-practices',
    metaTitle: 'OTP SMS Best Practices | Orian Teleservices',
    metaDescription: 'Seven habits for OTP messages: put the code first, state the expiry, use a transactional template, allow resends and limit attempts to cut failed sign-ins.',
    category: 'OTP',
    title: 'OTP messages: seven habits that reduce failed sign-ins',
    summary: 'Wording, expiry and resend rules for one-time passwords.',
    date: '2026-09-15',
    read: '4 min read',
    services: ['bulk-sms-otp-gateways', 'voice-sms-ivr'],
  },
  {
    slug: 'trai-dlt-registration-process',
    category: 'Compliance',
    title: 'TRAI DLT registration process: a step-by-step guide',
    summary: 'The order of steps to register an entity, sender IDs and templates on DLT, and where applications usually stall.',
    date: '2026-10-14',
    read: '7 min read',
    metaTitle: 'TRAI DLT Registration Process Explained | Orian',
    metaDescription: 'Step-by-step TRAI DLT registration: principal entity, sender ID headers, content templates and consent, plus common delays and how to avoid them.',
    services: ['dlt-compliance', 'bulk-sms-otp-gateways'],
  },
  {
    slug: 'promotional-vs-transactional-sms',
    category: 'SMS',
    title: 'Promotional vs transactional SMS: what is the difference?',
    summary: 'How the two categories differ in content, consent, timing and delivery, and how to classify a message correctly.',
    date: '2026-10-14',
    read: '7 min read',
    metaTitle: 'Promotional vs Transactional SMS Explained | Orian',
    metaDescription: 'Understand promotional vs transactional SMS in India: content rules, consent, sending hours and routes, with examples to classify your messages correctly.',
    services: ['bulk-sms-otp-gateways', 'dlt-compliance'],
  },
  {
    slug: 'smpp-vs-rest-api',
    category: 'Developers',
    title: 'SMPP vs REST API for sending SMS: which should you use?',
    summary: 'How the two integration methods differ in throughput, complexity and reliability, and how to choose between them.',
    date: '2026-10-14',
    read: '7 min read',
    metaTitle: 'SMPP vs REST API for SMS: How to Choose | Orian',
    metaDescription: 'Compare SMPP and REST API for sending SMS: throughput, connection handling, delivery reports and complexity, with advice on which suits your system.',
    services: ['bulk-sms-otp-gateways', 'it-solutions'],
  },
  {
    slug: 'sender-id-approval-guide',
    category: 'Compliance',
    title: 'How to get an SMS sender ID approved in India',
    summary: 'What a sender ID is, how to choose one, what reviewers look for and the common reasons a header is rejected.',
    date: '2026-10-14',
    read: '6 min read',
    metaTitle: 'How to Get an SMS Sender ID Approved | Orian',
    metaDescription: 'Learn how SMS sender IDs (headers) are approved in India: naming rules, documents, common rejection reasons and tips to get your header cleared first time.',
    services: ['dlt-compliance', 'bulk-sms-otp-gateways'],
  },
  {
    slug: 'whatsapp-business-api-pricing-explained',
    category: 'WhatsApp',
    title: 'WhatsApp Business API pricing explained',
    summary: 'How WhatsApp message charges are structured, what affects the cost and how to estimate a monthly budget.',
    date: '2026-10-14',
    read: '7 min read',
    metaTitle: 'WhatsApp Business API Pricing Explained | Orian',
    metaDescription: 'Understand how WhatsApp Business API pricing works: message categories, the 24-hour service window, provider fees and how to estimate your monthly cost.',
    services: ['whatsapp-business-api', 'bulk-sms-otp-gateways'],
  },
  {
    slug: 'bulk-sms-delivery-reports-explained',
    category: 'SMS',
    title: 'Bulk SMS delivery reports explained',
    summary: 'What each delivery status means, why a delivered report is not always certain and how to use reports in your system.',
    date: '2026-10-14',
    read: '7 min read',
    metaTitle: 'Bulk SMS Delivery Reports Explained | Orian',
    metaDescription: 'Learn what SMS delivery reports (DLRs) mean: status values like delivered, failed and expired, why some are delayed, and how to act on them in your system.',
    services: ['bulk-sms-otp-gateways', 'voice-sms-ivr'],
  },
];

export const getGuide = (slug) => guides.find((g) => g.slug === slug);
