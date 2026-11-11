// TODO(content): confirm before relying on the industry pages (these notes are not shown on the site):
//  - which industries have live Orian customers, languages supported per route, escalation contacts
//  - whether voice/IVR and WhatsApp are offered for each scenario described
// TODO(review): the compliance notes are general summaries. Have your compliance lead confirm the
//  current TRAI/DLT, RBI and DPDP Act wording (permitted hours, link rules, category names) before publishing.
// One entry per sector shown in the About page's "Sectors We Serve" cloud.
// Each sector gets its own detail page at /industries/:slug built from this data.

export const industries = [
  {
    slug: 'banking',
    metaTitle: 'BFSI & Fintech Bulk SMS & OTP API | Orian Teleservices',
    metaDescription: 'Send 2FA OTPs, transaction alerts and EMI reminders on DLT-compliant routes with delivery reports. Talk to Orian about SMS for banks, NBFCs and fintechs.',
    name: 'BFSI & Fintech',
    color: 'cyan',
    hover: 'hover:bg-[#00AEEF]/20 hover:border-[#00AEEF] hover:text-[#00AEEF]',
    blurb: 'Use cases include 2FA OTPs, fraud alerts and transactional notices. Confirm delivery and compliance requirements for your service.',
    overview: 'Banks, payment providers and NBFCs use messages for authentication, account notices and fraud alerts. Discuss delivery requirements, data handling and supported integration options with Orian before selecting a service.',
    useCases: [
      'Sub-3s 2FA authentication OTPs',
      'Real-time transaction debits & credit balance alerts',
      'Suspicious login & card freeze warnings',
      'EMI schedule & automated loan recovery reminders',
    ],
    services: ['bulk-sms-otp-gateways', 'dlt-compliance', 'voice-sms-ivr'],
  },
  {
    slug: 'retail',
    metaTitle: 'E-Commerce & Retail Bulk SMS API | Orian Teleservices',
    metaDescription: 'Explore SMS and WhatsApp use cases for retail, including verification, order updates and promotions. Ask Orian about registration and integration options.',
    name: 'E-Commerce & Retail',
    color: 'emerald',
    hover: 'hover:bg-emerald-500/20 hover:border-emerald-400 hover:text-emerald-300',
    blurb: 'Instant delivery OTPs, order dispatches, and high-throughput promotional broadcasts.',
    overview: 'Retail teams use messages for order updates, verification and promotions. Share your expected traffic and customer journey with Orian to discuss available services and onboarding.',
    useCases: [
      'Cash-on-Delivery (COD) verification & delivery OTPs',
      'Order confirmation, tracking link, and dispatch SMS',
      'High-volume festive promotional broadcasts',
      'Automated cart recovery nudges via WhatsApp & SMS',
    ],
    services: [
      'bulk-sms-otp-gateways',
      'whatsapp-business-api',
      'dlt-compliance',
      'social-media-handling',
    ],
  },
  {
    slug: 'healthcare-hospitals',
    metaTitle: 'Healthcare & Diagnostics SMS API | Orian Teleservices',
    metaDescription: 'Automate appointment confirmations, lab report alerts and refill reminders by DLT-compliant SMS and voice. Ask Orian about messaging for hospitals and labs.',
    name: 'Healthcare & Diagnostics',
    color: 'rose',
    hover: 'hover:bg-[#00AEEF]/20 hover:border-[#00AEEF] hover:text-[#00AEEF]',
    blurb: 'Appointment confirmations, diagnostic report alerts, and medicine reminders.',
    overview: 'Healthcare teams may use messages for appointment reminders and schedule changes. Discuss patient-data handling, consent, integration and delivery requirements with your compliance team and Orian.',
    useCases: [
      'Automated doctor visit confirmations & reschedule alerts',
      'Diagnostic lab test ready SMS with short-link downloads',
      'Critical health advisories & vaccination follow-ups',
      'Pharmacy order & prescription refill reminders',
    ],
    services: ['bulk-sms-otp-gateways', 'dlt-compliance', 'voice-sms-ivr'],
  },
  {
    slug: 'educational-institutes',
    metaTitle: 'Education & EdTech Bulk SMS API | Orian Teleservices',
    metaDescription: 'Send attendance alerts, exam notices and fee reminders to parents and students by DLT-compliant SMS. Set up school and EdTech messaging with Orian today.',
    name: 'Education & EdTech',
    color: 'purple',
    hover: 'hover:bg-[#00AEEF]/20 hover:border-[#00AEEF] hover:text-[#00AEEF]',
    blurb: 'Exam alerts, parent notifications, and attendance updates sent instantly.',
    overview: 'Education teams use messages for attendance updates, exam notices and schedule changes. Orian supports API and dashboard integration, delivery reports and sandbox testing.',
    useCases: [
      'Daily student attendance & absence alerts to parents',
      'Exam dates, hall ticket dispatches, and result notices',
      'Fee payment due alerts with integrated payment links',
      'Urgent campus closure & emergency notifications',
    ],
    services: [
      'bulk-sms-otp-gateways',
      'voice-sms-ivr',
      'dlt-compliance',
      'social-media-handling',
    ],
  },
  {
    slug: 'corporates',
    metaTitle: 'Enterprise Bulk SMS & Login OTP API | Orian Teleservices',
    metaDescription: 'Deliver SSO and VPN login OTPs, vendor payment confirmations and staff broadcast alerts by DLT-compliant SMS. Speak to Orian about enterprise messaging.',
    name: 'Corporates & Enterprise',
    color: 'blue',
    hover: 'hover:bg-[#00AEEF]/20 hover:border-[#00AEEF] hover:text-[#00AEEF]',
    blurb: 'Multi-factor login authentication, shift updates, and vendor notifications.',
    overview: 'Large corporate organizations route enterprise logins, HR communications, and vendor verification alerts through Orian’s reliable gateway APIs, ensuring high deliverability without vendor lock-in.',
    useCases: [
      'Enterprise VPN and single sign-on (SSO) login OTPs',
      'Vendor invoice dispatch & payment confirmations',
      'Workforce shift updates & internal broadcast alerts',
      'Staff onboarding and security verification flows',
    ],
    services: [
      'bulk-sms-otp-gateways',
      'dlt-compliance',
      'whatsapp-business-api',
      'it-solutions',
      'social-media-handling',
    ],
  },
  {
    slug: 'it-services',
    metaTitle: 'IT & Cloud Platform SMS OTP API | Orian Teleservices',
    metaDescription: 'Explore OTP, password-reset and service-alert messaging for software products. Ask Orian about current integration and testing options.',
    name: 'IT & Cloud Platforms',
    color: 'indigo',
    hover: 'hover:bg-[#00AEEF]/20 hover:border-[#00AEEF] hover:text-[#00AEEF]',
    blurb: 'Developer API auth, critical server downtime alerts, and password recovery.',
    overview: 'Software teams may use messaging for registration, password resets and service alerts. Orian provides API integration and per-message delivery reports, with sandbox access for testing.',
    useCases: [
      'Product sign-up and password reset 2FA OTPs',
      'Real-time cloud server breach & downtime alerts',
      'Multi-tenant application alert triggers',
      'API-driven user authentication flows',
    ],
    services: [
      'bulk-sms-otp-gateways',
      'voice-sms-ivr',
      'dlt-compliance',
      'it-solutions',
    ],
  },
];

export const getIndustryBySlug = (slug) => industries.find((i) => i.slug === slug);
export const getAllIndustrySlugs = () => industries.map((i) => i.slug);
export const getOtherIndustries = (currentSlug, limit = 4) =>
  industries.filter((i) => i.slug !== currentSlug).slice(0, limit);

export default industries;
