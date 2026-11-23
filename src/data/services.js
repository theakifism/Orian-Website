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
    slug: 'email-services',
    title: 'Email Services',
    tagline: 'Email campaigns and customer communications, planned around your audience and goals.',
    desc: 'Discuss campaign setup, message design, audience preparation and reporting options with our team.',
    accentColor: '#00AEEF', accentClass: 'accent', tagColor: 'text-[#00AEEF] bg-[#00AEEF]/10',
    borderHover: 'hover:border-[#00AEEF]/60', textAccent: 'group-hover:text-[#00AEEF]',
    glow: 'rgba(0, 0, 0, 0.6)', icon: 'email', hasPhoto: false,
    stats: [
      { label: 'Use', value: 'Customer email campaigns' },
      { label: 'Planning', value: 'Audience and content' },
      { label: 'Scope', value: 'Agreed for each project' },
    ],
  },
  {
    slug: 'digital-solutions',
    title: 'Digital & IT Solutions',
    tagline: 'Digital projects and IT support tailored to your business needs.',
    desc: 'Discuss websites, workflow improvements, integrations, hosting, network security and helpdesk support with our team.',
    accentColor: '#00AEEF', accentClass: 'accent', tagColor: 'text-[#00AEEF] bg-[#00AEEF]/10',
    borderHover: 'hover:border-[#00AEEF]/60', textAccent: 'group-hover:text-[#00AEEF]',
    glow: 'rgba(0, 0, 0, 0.6)', icon: 'digital', hasPhoto: false,
    stats: [
      { label: 'Focus', value: 'Digital and IT' },
      { label: 'Support', value: 'Hosting to helpdesk' },
      { label: 'Delivery', value: 'Scoped with your team' },
    ],
  },
  {
    slug: 'rcs-business-messaging',
    title: 'RCS Messaging',
    tagline: 'Explore richer, branded business messages on supported devices and networks.',
    desc: 'Discuss RCS messaging options, content and integration requirements with our team.',
    accentColor: '#00AEEF', accentClass: 'accent', tagColor: 'text-[#00AEEF] bg-[#00AEEF]/10',
    borderHover: 'hover:border-[#00AEEF]/60', textAccent: 'group-hover:text-[#00AEEF]',
    glow: 'rgba(0, 0, 0, 0.6)', icon: 'chat', hasPhoto: false,
    stats: [
      { label: 'Format', value: 'Rich business messages' },
      { label: 'Availability', value: 'Device and network dependent' },
      { label: 'Fallback', value: 'Discuss SMS options' },
    ],
  },
  {
    slug: 'transaction-email',
    title: 'Transaction Email',
    tagline: 'Automated emails for account activity, receipts and other customer updates.',
    desc: 'Discuss event-triggered email delivery, integration and reporting for your application.',
    accentColor: '#00AEEF', accentClass: 'accent', tagColor: 'text-[#00AEEF] bg-[#00AEEF]/10',
    borderHover: 'hover:border-[#00AEEF]/60', textAccent: 'group-hover:text-[#00AEEF]',
    glow: 'rgba(0, 0, 0, 0.6)', icon: 'email', hasPhoto: false,
    stats: [
      { label: 'Messages', value: 'Receipts and account updates' },
      { label: 'Trigger', value: 'Application events' },
      { label: 'Integration', value: 'Scope confirmed with you' },
    ],
  },
];

export const getServiceBySlug = (slug) => services.find((s) => s.slug === slug);
export const getAllServiceSlugs = () => services.map((s) => s.slug);
export const getOtherServices = (currentSlug, limit = 4) =>
  services.filter((s) => s.slug !== currentSlug).slice(0, limit);
