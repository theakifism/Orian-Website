// TODO(review): the `sections` text added to each service is explanatory and general. Confirm the Orian-specific
//  statements are true before publishing: DLT (we review documents, link entity to delivery platform), voice (retry
//  rules, CDR reporting), WhatsApp (assisted verification), social media (approval workflow, reply hours),
//  IT (helpdesk hours, monitoring). Existing claim "100% notification reach" on voice-sms-ivr is unsubstantiated.
// Central content source for every service. Adding a new service here
// automatically creates a tile on /services, a detail page at
// /services/:slug, a nav entry and a footer link.
// Order matters: bulk SMS first (primary), then DLT, then the rest.

export const services = [
  {
    slug: 'bulk-sms-otp-gateways',
    title: 'Bulk SMS & OTP Gateways',
    tagline: 'OTP, transactional and promotional SMS with delivery reports and API integration.',
    desc: 'High-throughput transactional and promotional SMS with delivery reports for every message.',
    accentColor: '#00AEEF',
    accentClass: 'accent',
    tagColor: 'text-[#00AEEF] bg-[#00AEEF]/10',
    borderHover: 'hover:border-[#00AEEF]/60',
    textAccent: 'group-hover:text-[#00AEEF]',
    glow: 'rgba(0, 0, 0, 0.6)',
    icon: 'gateway',
    stats: [
      { label: 'Message types', value: 'OTP, alerts, promo' },
      { label: 'Delivery reports', value: 'Every message' },
      { label: 'Integration', value: 'API and dashboard' },
    ],
  },
  {
    slug: 'dlt-compliance',
    title: 'DLT Assistance & Compliance',
    tagline: 'Guidance for DLT registration and messaging compliance.',
    desc: 'Discuss entity, header, and template registration requirements with our team.',
    accentColor: '#00AEEF',
    accentClass: 'accent',
    tagColor: 'text-[#00AEEF] bg-[#00AEEF]/10',
    borderHover: 'hover:border-[#00AEEF]/60',
    textAccent: 'group-hover:text-[#00AEEF]',
    glow: 'rgba(0, 0, 0, 0.6)',
    icon: 'shield',
    stats: [
      { label: 'Scope', value: 'Entity to templates' },
      { label: 'Filing', value: 'Handled with you' },
      { label: 'Sender IDs', value: 'Headers supported' },
    ],
  },
  {
    slug: 'voice-sms-ivr',
    title: 'Voice SMS & IVR Solutions',
    tagline: 'Voice broadcasting and interactive response options for business communication.',
    desc: 'Automated voice broadcasting, OBD, and interactive voice response systems.',
    accentColor: '#00AEEF',
    accentClass: 'accent',
    tagColor: 'text-[#00AEEF] bg-[#00AEEF]/10',
    borderHover: 'hover:border-[#00AEEF]/60',
    textAccent: 'group-hover:text-[#00AEEF]',
    glow: 'rgba(0, 0, 0, 0.6)',
    icon: 'waveform',
    stats: [
      { label: 'Formats', value: 'Voice SMS, IVR, OBD' },
      { label: 'Call logs', value: 'Available' },
      { label: 'Input', value: 'Discuss your requirements' },
    ],
  },
  {
    slug: 'whatsapp-business-api',
    title: 'WhatsApp Business API',
    tagline: 'WhatsApp Business messaging options for customer communication.',
    desc: 'Discuss templates, onboarding, and integration options with our team.',
    accentColor: '#00AEEF',
    accentClass: 'accent',
    tagColor: 'text-[#00AEEF] bg-[#00AEEF]/10',
    borderHover: 'hover:border-[#00AEEF]/60',
    textAccent: 'group-hover:text-[#00AEEF]',
    glow: 'rgba(0, 0, 0, 0.6)',
    icon: 'chat',
    stats: [
      { label: 'Messaging', value: 'Templates and replies' },
      { label: 'Verification', value: 'Assisted' },
      { label: 'Integration', value: 'WhatsApp Business API' },
    ],
  },
  {
    slug: 'social-media-handling',
    title: 'Social Media Handling',
    tagline: 'Content, scheduling and community replies, handled by one team.',
    desc: 'Planning, posting and community management for your business pages, run alongside your messaging.',
    accentColor: '#00AEEF',
    accentClass: 'accent',
    tagColor: 'text-[#00AEEF] bg-[#00AEEF]/10',
    borderHover: 'hover:border-[#00AEEF]/60',
    textAccent: 'group-hover:text-[#00AEEF]',
    glow: 'rgba(0, 0, 0, 0.6)',
    icon: 'social',
    stats: [
      { label: 'Scope', value: 'Plan, post, reply' },
      { label: 'Reporting', value: 'Regular summaries' },
      { label: 'Channels', value: 'Agreed with you at the start' },
    ],
  },
  {
    slug: 'it-solutions',
    title: 'IT Solutions',
    tagline: 'IT services scoped to your business requirements.',
    desc: 'Discuss hosting, network, security, and support requirements with our team.',
    accentColor: '#00AEEF',
    accentClass: 'accent',
    tagColor: 'text-[#00AEEF] bg-[#00AEEF]/10',
    borderHover: 'hover:border-[#00AEEF]/60',
    textAccent: 'group-hover:text-[#00AEEF]',
    glow: 'rgba(0, 0, 0, 0.6)',
    icon: 'code',
    stats: [
      { label: 'Scope', value: 'Hosting to helpdesk' },
      { label: 'Support', value: '24/7 helpdesk' },
      { label: 'Engagement', value: 'Agreed per client' },
    ],
  },
];

export const getServiceBySlug = (slug) => services.find((s) => s.slug === slug);
export const getAllServiceSlugs = () => services.map((s) => s.slug);
export const getOtherServices = (currentSlug, limit = 4) =>
  services.filter((s) => s.slug !== currentSlug).slice(0, limit);
