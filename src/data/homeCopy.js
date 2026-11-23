// Homepage SEO copy. Edit wording here; the components in
// src/components/o2/HomeSeoSections.jsx only render it.
//
// Avoid publishing performance figures until they are backed by a defined,
// current measurement period and verifiable production telemetry.

export const homeFeatures = {
  eyebrow: 'Platform',
  title: 'Everything you need to send bulk SMS at scale',
  lead: 'Explore bulk SMS options for OTPs, transactional alerts and promotional campaigns, and discuss routing, compliance and reporting needs with the team.',
  items: [
    {
      h: 'Routing for your use case',
      p: 'Messages use direct operator routes, with failover to keep traffic moving when a route is interrupted.',
    },
    {
      h: 'Integration planning',
      p: 'Discuss messaging API or dashboard access with the team, then request sandbox access for testing.',
    },
    {
      h: 'Delivery reporting',
      p: 'Review the delivery status reported for messages through the API or dashboard. A delivery status is not proof that a person read a message.',
    },
    {
      h: 'DLT assistance',
      p: 'Get help understanding entity, sender ID and template registration steps for commercial SMS in India.',
    },
  ],
};

export const apiSection = {
  eyebrow: 'For developers',
  title: 'Plan your messaging integration',
  lead: 'Integrate through Orian’s API and test in the sandbox. Contact our team for technical documentation and access.',
};

export const comparison = {
  eyebrow: 'Use cases',
  title: 'Promotional vs. transactional SMS: pick the right route',
  lead: 'Transactional and promotional messages have different requirements. Confirm the right message type, route and timing for your use case before sending.',
  cols: ['Transactional alerts', 'Promotional campaigns'],
  rows: [
    ['Best for', 'OTPs, payment alerts, order and booking updates', 'Offers, launches, re-engagement'],
    ['Delivery handling', 'Direct operator routes with automatic failover', 'Direct operator routes with automatic failover'],
    ['DLT template type', 'Transactional / service', 'Promotional'],
    ['Do-Not-Disturb numbers', 'Service messages are delivered', 'Filtered unless consent is recorded'],
    ['Sending window', 'Round the clock', 'Restricted hours under TRAI rules'],
    ['Sender ID', 'Registered 6-character header', 'Registered promotional header'],
    ['Typical goal', 'Trust and completion', 'Conversion and revenue'],
  ],
};

export const whyOrian = {
  eyebrow: 'Why Orian Teleservices',
  title: 'Why choose Orian Teleservices over traditional SMS aggregators',
  items: [
    {
      h: 'One accountable partner, not a reseller chain',
    p: 'Get direct operator routes, 24/7 support, delivery reports and API integration through Orian.',
    },
    {
      h: 'Transparent delivery, not guesswork',
    p: 'Every SMS includes a delivery report with the message status for tracking and review.',
    },
    {
    h: 'Plan for peak usage',
    p: 'Our team will help plan capacity and setup around your expected volume and busiest sending periods.',
    },
    {
    h: 'DLT assistance',
    p: 'Our team can guide you through preparing and submitting the entity, sender ID and message templates. Operator review times vary; ask for current requirements and estimates.',
    },
    {
    h: '24/7 support',
    p: 'Reach the support desk by phone, email or WhatsApp at any time.',
  },
  {
    h: 'Fast onboarding',
    p: 'Plan your first live send with the team around your documents, integration and any required approvals.',
    },
  ],
};

export const finalCta = {
  title: 'Planning a messaging project?',
  lead: 'Ask the team about sandbox access, technical documentation and a practical onboarding plan for your first live send.',
};
