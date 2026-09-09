export const whyUsData = [
  {
    id: '01',
    slug: 'support-247',
    title: '24/7 Customer Support',
    desc: 'Our team is on call around the clock — for your work and your peace of mind.',
    color: '#00AEEF',
    glow: 'rgba(0, 174, 239, 0.35)',
    icon: 'headset',
    detail:
      'Messaging outages don\u2019t wait for business hours, so neither do we. A dedicated support desk is staffed round the clock across voice, email and WhatsApp, with senior engineers on rotation for anything that needs a hands-on fix rather than a script.',
    points: [
      'Live phone support on three dedicated helpline numbers',
      'Priority escalation path for enterprise accounts',
      'Average first-response time under 10 minutes',
      'Dedicated account manager for high-volume clients',
    ],
    stat: { value: '< 10 min', label: 'avg. first response' },
  },
  {
    id: '02',
    slug: 'best-price-guarantee',
    title: 'Best Price Guarantee',
    desc: 'We always price to fit your budget, with the same premium routing quality for every customer.',
    color: '#E8A23D',
    glow: 'rgba(232, 162, 61, 0.35)',
    icon: 'tag',
    detail:
      'Volume shouldn\u2019t be the only way to earn a good rate. Orian prices every plan — from a startup\u2019s first thousand messages to an enterprise\u2019s millions — on the same premium routing tier, with transparent, no-surprise billing.',
    points: [
      'Transparent per-message pricing with no hidden setup fees',
      'Same route quality regardless of monthly volume',
      'Custom enterprise slabs for high-throughput accounts',
      'Free sandbox credits to test before you commit',
    ],
    stat: { value: '0', label: 'hidden fees' },
  },
  {
    id: '03',
    slug: 'safe-effective-delegation',
    title: 'Safe & Effective Delegation',
    desc: 'Hand off your communication needs and reach your global audience safely and quickly.',
    color: '#A855F7',
    glow: 'rgba(168, 85, 247, 0.35)',
    icon: 'shield',
    detail:
      'Handing your customer communication to a third party only works if that party takes security as seriously as you do. Every message on Orian\u2019s network is encrypted in transit, access is role-based, and full audit trails are available on request.',
    points: [
      'Encrypted transit for every message and API call',
      'Role-based access control on your dashboard',
      'Full audit trail and exportable delivery logs',
      'Data handling aligned with TRAI and enterprise compliance norms',
    ],
    stat: { value: '100%', label: 'encrypted transit' },
  },
  {
    id: '04',
    slug: 'instant-dlt-quick-setup',
    title: 'Instant DLT & Quick Setup',
    desc: 'New to Orian? We get your Sender IDs and messaging systems up and running fast.',
    color: '#10B981',
    glow: 'rgba(16, 185, 129, 0.35)',
    icon: 'bolt',
    detail:
      'Most new clients lose their first week to DLT paperwork before sending a single message. Orian\u2019s compliance desk files entity and header registrations the same day documents are received, so onboarding rarely takes longer than 48 hours end to end.',
    points: [
      'Sandbox API key issued within minutes of sign-up',
      'Entity and Sender ID registration filed the same day',
      'Guided template drafting that avoids common rejection reasons',
      'A named onboarding engineer for your first campaign',
    ],
    stat: { value: '< 48 hrs', label: 'to first live send' },
  },
  {
    id: '05',
    slug: 'strong-carrier-network',
    title: 'Strong Carrier Network',
    desc: 'Network issues are negligible — our SMPP infrastructure is built to hold extreme traffic.',
    color: '#EC4899',
    glow: 'rgba(236, 72, 153, 0.35)',
    icon: 'tower',
    detail:
      'Redundancy is the whole point of a carrier network. Orian maintains direct SMPP binds to over 1,200 operator routes across 180+ countries, with automatic failover so a single carrier\u2019s congestion never becomes your customer\u2019s dropped message.',
    points: [
      '1,200+ direct operator routes across 180+ countries',
      'Automatic failover to the next-best route on congestion',
      'Load balanced across multiple SMPP binds per operator',
      'Real-time route health monitoring dashboard',
    ],
    stat: { value: '1,200+', label: 'carrier routes' },
  },
  {
    id: '06',
    slug: 'high-speed-delivery',
    title: 'High-Speed Delivery',
    desc: 'We move quickly, delivering transactional OTPs with sub-second route precision.',
    color: '#3B82F6',
    glow: 'rgba(59, 130, 246, 0.35)',
    icon: 'trend',
    detail:
      'An OTP that arrives after the checkout page has already timed out helps no one. Transactional traffic runs on a dedicated, priority throughput lane, separate from promotional volume, so speed never degrades under load.',
    points: [
      'Dedicated throughput lane for transactional messages',
      'Sub-second average delivery on major networks',
      'Priority queuing that\u2019s never shared with bulk promotional sends',
      'Real-time delivery reports (DLR) on every message',
    ],
    stat: { value: '99.99%', label: 'uptime SLA' },
  },
];

export const getWhyUsBySlug = (slug) => whyUsData.find((w) => w.slug === slug);
