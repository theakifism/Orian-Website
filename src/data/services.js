// Central content source for every service. Adding a new service here
// automatically creates a new card on /services and a new detail page at
// /services/:slug — no routing changes needed.

export const services = [
  {
    slug: 'bulk-sms-otp-gateways',
    title: 'Bulk SMS & OTP Gateways',
    tagline: 'Transactional and promotional messaging that lands in under a second.',
    desc: 'Low-latency transactional & promotional SMS routing with high throughput delivery.',
    accentColor: '#22D3EE',
    accentClass: 'cyan',
    tagColor: 'text-cyan-400 bg-cyan-400/10',
    borderHover: 'hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]',
    textAccent: 'group-hover:text-cyan-400',
    glow: 'rgba(34, 211, 238, 0.35)',
    icon: 'gateway',
    stats: [
      { label: 'Msgs / second', value: '100,000+' },
      { label: 'Avg. delivery time', value: '< 1 sec' },
      { label: 'Success rate', value: '99.98%' },
    ],
    overview:
      "Orian's SMS gateway pushes OTPs, alerts, and promotional blasts through more than 1,200 direct operator connects, so messages reach a handset in milliseconds instead of queuing behind third-party aggregators. Every route is monitored in real time and automatically fails over to the next-best carrier path the moment congestion or latency creeps up.",
    features: [
      'Direct SMPP binds to 1,200+ operator routes across 180+ countries',
      'Smart least-cost and least-latency routing with automatic failover',
      'Separate transactional (OTP) and promotional throughput lanes',
      'Real-time delivery reports (DLR) and click-level analytics dashboard',
      'REST & SMPP APIs with sandbox keys issued the same day',
    ],
    howItWorks: [
      { title: 'Connect', desc: 'Plug in via our REST API or an SMPP bind — client libraries are ready for Node, PHP, Java and Python.' },
      { title: 'Register your template', desc: 'We handle DLT content template and header registration with TRAI on your behalf.' },
      { title: 'Go live', desc: 'Send a test blast to your sandbox number and flip to production the same day.' },
      { title: 'Monitor', desc: 'Track delivery, click-through and carrier-level performance from your live dashboard.' },
    ],
    useCases: ['Banking', 'Retail', 'Healthcare & Hospitals', 'IT Services'],
    faqs: [
      { q: 'How fast is OTP delivery?', a: 'Transactional OTPs are prioritized on a dedicated throughput lane and typically land in under a second on major Indian and international networks.' },
      { q: 'Do you handle DLT registration?', a: 'Yes — our compliance team files your entity, header and template registrations with TRAI so your first campaign isn\u2019t held up by paperwork.' },
      { q: 'Can I send both transactional and promotional SMS from one account?', a: 'Yes, the two message classes run on separate routing lanes so promotional volume never slows down your OTPs.' },
    ],
  },
  {
    slug: 'voice-sms-ivr',
    title: 'Voice SMS & IVR Solutions',
    tagline: 'Automated voice broadcasting and interactive response, at carrier scale.',
    desc: 'Automated voice broadcasting, OBD, and interactive voice response systems.',
    accentColor: '#C084FC',
    accentClass: 'purple',
    tagColor: 'text-purple-400 bg-purple-400/10',
    borderHover: 'hover:border-purple-400 hover:shadow-[0_0_25px_rgba(168,85,247,0.3)]',
    textAccent: 'group-hover:text-purple-400',
    glow: 'rgba(192, 132, 252, 0.35)',
    icon: 'waveform',
    stats: [
      { label: 'Concurrent calls', value: '10,000+' },
      { label: 'Languages supported', value: '15+' },
      { label: 'Setup time', value: '< 48 hrs' },
    ],
    overview:
      'From outbound dialing (OBD) campaigns to full interactive voice response (IVR) trees, Orian\u2019s voice stack lets you reach a customer\u2019s phone directly — no app, no internet connection required. Campaigns can be scheduled, looped on no-answer, and reported on down to the individual call leg.',
    features: [
      'Outbound dialing (OBD) for reminders, alerts and voice OTP',
      'Drag-and-drop IVR flow builder with DTMF & speech input',
      'Multi-language text-to-speech and pre-recorded prompt support',
      'Call recording, live barge-in and detailed CDR reporting',
      'Auto-retry logic for busy, no-answer and switched-off numbers',
    ],
    howItWorks: [
      { title: 'Design the flow', desc: 'Sketch your IVR tree or OBD script with our team, including fallback and retry rules.' },
      { title: 'Upload your list', desc: 'Import your number list via CSV or push it programmatically through the API.' },
      { title: 'Launch the campaign', desc: 'Calls go out on schedule with concurrency limits matched to your use case.' },
      { title: 'Review call analytics', desc: 'Every leg is logged — duration, DTMF input captured, and outcome — in your dashboard.' },
    ],
    useCases: ['Banking', 'Hotels & Hospitality', 'Educational Institutes', 'Power & Energy'],
    faqs: [
      { q: 'Can I use voice OTP as a fallback to SMS?', a: 'Yes, many clients trigger a voice OTP automatically if an SMS OTP isn\u2019t acknowledged within a set window.' },
      { q: 'Do you support regional languages?', a: 'Our TTS engine and prompt library cover 15+ languages including Hindi, Marathi, Tamil, Telugu and Bengali.' },
      { q: 'What happens on a no-answer?', a: 'You configure the retry count and gap — the system automatically re-attempts and logs every outcome.' },
    ],
  },
  {
    slug: 'dlt-compliance',
    title: 'DLT Assistance & Compliance',
    tagline: 'Full TRAI DLT registration, handled end-to-end by our compliance desk.',
    desc: 'Complete TRAI DLT template registration, header support, and compliance management.',
    accentColor: '#FBBF24',
    accentClass: 'amber',
    tagColor: 'text-amber-400 bg-amber-400/10',
    borderHover: 'hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]',
    textAccent: 'group-hover:text-amber-400',
    glow: 'rgba(251, 191, 36, 0.35)',
    icon: 'shield',
    stats: [
      { label: 'Entities onboarded', value: '500+' },
      { label: 'Template approval', value: '24\u201348 hrs' },
      { label: 'Compliance record', value: '100%' },
    ],
    overview:
      "TRAI's Distributed Ledger Technology (DLT) framework requires every business sender in India to register their entity, sender headers and message templates before a single SMS can legally go out. Orian's compliance desk manages that entire process for you — from entity registration on the operator DLT portals to keeping your template library audit-ready.",
    features: [
      'Entity registration across Jio, Airtel, Vi and BSNL DLT platforms',
      'Header (Sender ID) registration and approval tracking',
      'Content template drafting that matches TRAI\u2019s variable-format rules',
      'Ongoing template refresh when campaigns or messaging copy change',
      'Audit-ready compliance documentation on request',
    ],
    howItWorks: [
      { title: 'Share your business documents', desc: 'PAN, GST and a few standard KYC documents are all we need to start.' },
      { title: 'We file your entity', desc: 'Our team submits your entity across every major operator\u2019s DLT portal.' },
      { title: 'Templates get approved', desc: 'We draft and submit your message templates in TRAI\u2019s required format.' },
      { title: 'Start sending, fully compliant', desc: 'Once approved, templates map directly to your live SMS account.' },
    ],
    useCases: ['Banking', 'Corporates', 'Real Estate', 'Retail'],
    faqs: [
      { q: 'How long does DLT registration take?', a: 'Entity registration typically clears in 2\u20133 business days, with template approvals following in 24\u201348 hours once submitted correctly the first time.' },
      { q: 'What if my template gets rejected?', a: 'Our compliance desk revises and resubmits at no extra cost until it\u2019s approved.' },
      { q: 'Is DLT registration a one-time thing?', a: 'Entity registration is one-time, but every new message template needs its own approval before use.' },
    ],
  },
  {
    slug: 'whatsapp-business-api',
    title: 'WhatsApp Business API',
    tagline: 'Verified green-tick messaging, chatbots and broadcast at scale.',
    desc: 'Verified WhatsApp green tick, chatbots, broadcast messaging, and dynamic webhooks.',
    accentColor: '#34D399',
    accentClass: 'emerald',
    tagColor: 'text-emerald-400 bg-emerald-400/10',
    borderHover: 'hover:border-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]',
    textAccent: 'group-hover:text-emerald-400',
    glow: 'rgba(52, 211, 153, 0.35)',
    icon: 'chat',
    stats: [
      { label: 'Open rate', value: '~95%' },
      { label: 'Green-tick approval', value: 'Assisted' },
      { label: 'Webhook latency', value: '< 2 sec' },
    ],
    overview:
      "WhatsApp remains the highest-engagement channel available today, and Orian's Business API integration gets you there properly — official green-tick verification, template-approved broadcast messaging, and two-way chatbot conversations, all wired into your existing systems through dynamic webhooks.",
    features: [
      'Assisted Meta Business verification and official green-tick badge',
      'Broadcast messaging on approved template categories',
      'No-code and API-driven chatbot flows with quick-reply buttons',
      'Rich media support — images, PDFs, location and product catalogues',
      'Dynamic webhooks for real-time delivery, read-receipt and reply events',
    ],
    howItWorks: [
      { title: 'Verify your business', desc: 'We guide your Meta Business Manager setup and submit for official verification.' },
      { title: 'Approve your templates', desc: 'Message templates are submitted to WhatsApp for category approval.' },
      { title: 'Build your chatbot flow', desc: 'Design automated replies, menus and handoff-to-agent rules.' },
      { title: 'Broadcast & integrate', desc: 'Connect the webhook to your CRM or helpdesk and start two-way conversations.' },
    ],
    useCases: ['Retail', 'Hotels & Hospitality', 'Healthcare & Hospitals', 'Real Estate'],
    faqs: [
      { q: 'How long does green-tick verification take?', a: 'Meta\u2019s review typically takes 1\u20133 weeks once documentation is submitted correctly; our team handles the paperwork to avoid rejections.' },
      { q: 'Can customers reply and reach a human agent?', a: 'Yes — chatbot flows include a hand-off rule that routes a conversation to a live agent whenever needed.' },
      { q: 'Does this replace regular SMS?', a: 'Most clients run WhatsApp alongside SMS and voice — each channel picks up where the others have lower reach or engagement.' },
    ],
  },
];

export const getServiceBySlug = (slug) => services.find((s) => s.slug === slug);
