// Heavy detail fields for services entries, split out of services.js so that only the detail pages
// (which are lazy route chunks) download them. List pages, the home page and the nav use the light
// entries in services.js. Detail pages merge: { ...entry, ...serviceDetail[entry.slug] }.
// Keys moved here: overview, features, howItWorks, useCases, faqs, sections.
// TODO(content)/TODO(review) notes for this content live at the top of services.js.
export const serviceDetail = {
  'bulk-sms-otp-gateways': {
    overview: 'Orian offers SMS services for OTPs, transactional alerts and promotional campaigns, with direct operator routes, API integration and delivery reports for every message.',
    features: [
      'OTP and verification messages',
      'Transactional alerts and notifications',
      'Promotional SMS campaigns',
      'DLT registration assistance',
      'API integration and delivery reporting for every message',
    ],
    howItWorks: [
      {
        title: 'Connect',
        desc: 'Discuss available integration methods, authentication and technical requirements with the team.',
      },
      {
        title: 'Register your template',
        desc: 'Ask about assistance with DLT entity, sender ID and template registration.',
      },
      {
        title: 'Go live',
        desc: 'Test message flows and webhook handling in the Orian sandbox before production use.',
      },
      {
        title: 'Monitor',
        desc: 'Review delivery reports for each message.',
      },
    ],
    useCases: ['Banking', 'Retail', 'Healthcare & Hospitals', 'IT Services'],
    faqs: [
      {
        q: 'How fast is OTP delivery?',
        a: 'Delivery time depends on your integration, message configuration, operator and recipient handset. Ask the team for measured performance information relevant to your use case.',
      },
      {
        q: 'Do you handle DLT registration?',
        a: 'Orian offers DLT assistance. Contact the team to confirm which registration steps and documentation support are available.',
      },
      {
        q: 'Can I send both transactional and promotional SMS from one account?',
        a: 'Account configuration and message handling depend on the service. Ask the team how transactional and promotional traffic are handled for your account.',
      },
    ],
    sections: [
      {
        title: 'How a message travels from your system to the phone',
        p: 'Your application submits a message through the API, and each message receives a delivery report. Use the report to track status and investigate delivery issues.',
      },
      {
        title: 'Transactional and promotional traffic, kept apart',
        p: 'OTPs, alerts and campaigns have different delivery requirements. Discuss routing and traffic handling options with our team, and review [promotional vs transactional SMS](/resources/promotional-vs-transactional-sms) for guidance on classifying messages.',
      },
      {
        title: 'Ways to integrate',
        p: 'Integrate through the API or SMPP. Contact the team for technical documentation and credentials. Our guide to [SMPP versus REST](/resources/smpp-vs-rest-api) explains general protocol differences.',
      },
      {
        title: 'What to check before going live',
        p: 'Confirm your DLT registrations are approved, test every template on handsets from more than one operator, make sure your webhook handles repeated events safely, and decide what happens when a message fails. The [delivery reports guide](/resources/bulk-sms-delivery-reports-explained) and the [OTP best practices guide](/resources/otp-best-practices) cover both.',
      },
    ],
  },
  'dlt-compliance': {
    overview: 'Orian provides assistance with DLT registration steps for business entities, sender IDs and message templates. Contact the team to confirm the current scope of support and required documents.',
    features: [
      'Guidance on entity registration steps',
      'Sender ID and message template preparation',
      'Help understanding submission requirements',
      'Support scope confirmed for each request',
    ],
    howItWorks: [
      {
        title: 'Share your business documents',
        desc: 'PAN, GST and a few standard KYC documents are all we need to start.',
      },
      {
        title: 'We file your entity',
        desc: 'Our team submits your entity across every major operator’s DLT portal.',
      },
      {
        title: 'Templates get approved',
        desc: 'We draft and submit your message templates in TRAI’s required format.',
      },
      {
        title: 'Start sending, fully compliant',
        desc: 'Once approved, templates map directly to your live SMS account.',
      },
    ],
    useCases: ['Banking', 'Corporates', 'Retail', 'Healthcare & Hospitals'],
    faqs: [
      {
        q: 'How long does DLT registration take?',
        a: 'Review times are determined by the relevant operator portals and can vary. Contact the team for current guidance; no approval timeline can be guaranteed.',
      },
      {
        q: 'What if my template gets rejected?',
        a: 'Our compliance desk revises and resubmits at no extra cost until it’s approved.',
      },
      {
        q: 'Is DLT registration a one-time thing?',
        a: 'Entity registration is one-time, but every new message template needs its own approval before use.',
      },
    ],
    sections: [
      {
        title: 'What DLT registration involves',
        p: 'DLT is the system TRAI requires operators to run so that every commercial message can be checked against a registered sender and a registered template. Registration covers your business as a principal entity, each sender ID, each message template and, for promotional traffic, consent records. The pieces depend on each other, so the order in which they are filed matters.',
      },
      {
        title: 'What we prepare and file',
        p: 'We review your documents for mismatches before filing, suggest sender IDs that clearly relate to your business, draft templates in the right category with sensible variables, and track each application until it is approved. We also link your entity to the delivery platform so messages pass the final check. The full sequence is explained in our [DLT registration process guide](/resources/trai-dlt-registration-process).',
      },
      {
        title: 'What affects how long it takes',
        p: 'Approval times are set by the operators, not by us. What we can influence is the quality of the application: matching names across documents, relevant sender IDs and templates that follow the rules. Most delays come from avoidable rework, which is why checking before filing saves more time than anything else. Start the paperwork before your launch date is fixed.',
      },
      {
        title: 'After approval',
        p: 'Registration is ongoing. New message types need new templates, new brands may need new sender IDs, and rules change. We can keep a register of your approved templates and help you file new ones. Our guides on [sender IDs](/resources/sender-id-approval-guide) and [DLT templates](/resources/dlt-template-basics) explain what good looks like.',
      },
    ],
  },
  'voice-sms-ivr': {
    overview: 'Orian offers voice and IVR services for business communication. Contact the team to confirm available call flows, reporting and configuration options for your use case.',
    features: [
      'Outbound dialing (OBD) for reminders, alerts and voice OTP',
      'Automated Voice OTP fallback when SMS delivery delays occur',
      'Multi-language text-to-speech and pre-recorded prompt support',
      'Call recording, live retry logic and detailed CDR reporting',
      'Interactive DTMF multi-level response menus',
    ],
    howItWorks: [
      {
        title: 'Design the flow',
        desc: 'Sketch your IVR tree or OBD script with our team, including fallback and retry rules.',
      },
      {
        title: 'Upload your list',
        desc: 'Import your number list via CSV or push it programmatically through the API.',
      },
      {
        title: 'Launch the campaign',
        desc: 'Calls go out on schedule with concurrency limits matched to your use case.',
      },
      {
        title: 'Review call analytics',
        desc: 'Every leg is logged — duration, DTMF input captured, and outcome — in your dashboard.',
      },
    ],
    useCases: ['Banking', 'Educational Institutes', 'Retail', 'IT Services'],
    faqs: [
      {
        q: 'Can I use voice OTP as a fallback to SMS?',
        a: 'Yes, many clients trigger a voice OTP automatically if an SMS OTP isn’t acknowledged within a set window.',
      },
      {
        q: 'Do you support regional languages?',
        a: 'Our text-to-speech engine and prompt library support Indian regional languages. Tell us which ones you need and we will confirm.',
      },
      {
        q: 'What happens on a no-answer?',
        a: 'You configure the retry count and gap — the system automatically re-attempts and logs every outcome.',
      },
    ],
    sections: [
      {
        title: 'When a call works better than a message',
        p: 'Voice reaches people who do not read SMS reliably, and it is harder to miss. It is a sensible fallback for OTPs that were not delivered, a way to escalate urgent alerts such as a card block or a late delivery, and a practical channel for reminders to customers who prefer to speak. For routine information, SMS is cheaper and quicker, so most teams use voice to back SMS up rather than replace it.',
      },
      {
        title: 'How outbound dialing and IVR work',
        p: 'In an outbound campaign, a list of numbers is uploaded or pushed by API, and the platform places calls on a schedule, plays a recorded or text-to-speech message and retries unanswered calls according to your rules. An interactive voice response flow adds menus: the caller presses a key to confirm, reschedule or reach an agent, and each choice is recorded in the call detail records. Designing the script and the retry rules before launch avoids most problems.',
      },
      {
        title: 'Consent and calling hours',
        p: 'Commercial calls are regulated in India, including do-not-disturb preferences and restrictions on promotional calling. Service and transactional calls that customers expect are treated differently from promotional ones, so keep the purpose of each flow clear and confirm the current rules with your compliance contact. Our [DLT compliance service](/services/dlt-compliance) can help you classify them.',
      },
      {
        title: 'Using voice together with SMS',
        p: 'A common pattern is to send an SMS first, wait for a short window, then place a call if the delivery report shows failure or there is no response. The [delivery reports guide](/resources/bulk-sms-delivery-reports-explained) explains the signals to watch, and the [OTP best practices guide](/resources/otp-best-practices) covers voice fallback for verification codes.',
      },
    ],
  },
  'whatsapp-business-api': {
    overview: 'Complement high-volume SMS campaigns with verified WhatsApp Business API messaging. Broadcast pre-approved templates, send rich media statements and invoices, and automate two-way customer support with intelligent webhooks.',
    features: [
      'Assisted Meta Business verification and official green-tick badge',
      'Broadcast messaging on pre-approved utility and marketing templates',
      'No-code and API-driven chatbot flows with interactive buttons',
      'Rich media support — PDF invoices, images, and quick-reply actions',
      'Dynamic webhooks for real-time delivery and read-receipt tracking',
    ],
    howItWorks: [
      {
        title: 'Verify your business',
        desc: 'We guide your Meta Business Manager setup and submit for official verification.',
      },
      {
        title: 'Approve your templates',
        desc: 'Message templates are submitted to WhatsApp for category approval.',
      },
      {
        title: 'Build your chatbot flow',
        desc: 'Design automated replies, menus and handoff-to-agent rules.',
      },
      {
        title: 'Broadcast & integrate',
        desc: 'Connect the webhook to your CRM or helpdesk and start two-way conversations.',
      },
    ],
    useCases: ['Retail', 'Banking', 'Healthcare & Hospitals', 'Corporates'],
    faqs: [
      {
        q: 'How long does green-tick verification take?',
        a: 'Review time is set by Meta and varies; our team handles the paperwork to avoid rejections.',
      },
      {
        q: 'Can customers reply and reach a human agent?',
        a: 'Yes — chatbot flows include a hand-off rule that routes a conversation to a live agent whenever needed.',
      },
      {
        q: 'Does this replace regular SMS?',
        a: 'Most clients run WhatsApp alongside SMS — using SMS for critical 2FA OTPs and WhatsApp for rich conversational support.',
      },
    ],
    sections: [
      {
        title: 'The Business API is not the Business app',
        p: 'The WhatsApp Business app is a handset app for small shops. The WhatsApp Business API is for companies that need to send messages from systems, answer many customers at once, and connect to a CRM or chatbot. It is accessed through an approved provider and works with verified business accounts, templates and webhooks rather than a phone screen.',
      },
      {
        title: 'Templates, categories and the 24-hour window',
        p: 'Messages you start must use a template approved by WhatsApp in a category such as utility, marketing or authentication. When a customer messages you first, a 24-hour window opens in which you can reply freely. Which category a template falls into affects both approval and cost, and WhatsApp judges it by content, so promotional wording in a utility template can cause it to be reclassified. See [WhatsApp Business API pricing explained](/resources/whatsapp-business-api-pricing-explained).',
      },
      {
        title: 'Opt-in and quality',
        p: 'WhatsApp requires customers to opt in before you send business-initiated messages, and it watches how people respond. Many blocks or reports can limit how many messages you can send. Capture opt-in clearly, record it, send relevant messages and give an easy way to stop.',
      },
      {
        title: 'WhatsApp and SMS together',
        p: 'SMS reaches nearly every phone and suits codes and urgent alerts. WhatsApp suits richer, two-way conversations with buttons, documents and images. Many businesses send on WhatsApp where the customer has opted in and fall back to SMS otherwise. Our [bulk SMS and OTP gateway](/services/bulk-sms-otp-gateways) covers the SMS side.',
      },
    ],
  },
  'social-media-handling': {
    overview: 'We run your business social pages the way we run your messaging: with a plan, a calendar and a clear owner. Content is drafted for your approval, scheduled, published and answered, so your customers get a consistent voice across SMS, WhatsApp and social.',
    features: [
      'Content calendar planned with you each month',
      'Post design and copy drafted for your approval',
      'Scheduled publishing across your business pages',
      'Comment and message replies handled within agreed hours',
      'Simple reporting on what was posted and how it performed',
    ],
    howItWorks: [
      { title: 'Brief', desc: 'Tell us your business, audience and the tone you want.' },
      { title: 'Plan', desc: 'We propose a monthly content calendar for your approval.' },
      { title: 'Publish', desc: 'Approved posts are scheduled and published on your pages.' },
      { title: 'Report', desc: 'You receive a summary of activity and what to adjust next.' },
    ],
    useCases: [
      'Retail',
      'Educational Institutes',
      'Corporates',
      'Healthcare & Hospitals',
    ],
    faqs: [
      {
        q: 'Which platforms do you handle?',
        a: 'We will confirm the platforms during the brief, based on where your customers are.',
      },
      {
        q: 'Do I approve posts before they go out?',
        a: 'Yes. Content is drafted for your approval before it is scheduled.',
      },
      {
        q: 'Can social run alongside my SMS campaigns?',
        a: 'Yes. Many teams use social for reach and SMS or WhatsApp for direct, time-sensitive messages.',
      },
    ],
    sections: [
      {
        title: 'What the service covers',
        p: 'We plan a monthly content calendar with you, draft the posts and designs for your approval, schedule and publish them on your business pages, and reply to comments and messages within agreed hours. You keep control: nothing is published without your sign-off, and the pages remain in your name and under your ownership.',
      },
      {
        title: 'How the monthly cycle works',
        p: 'Each cycle starts with a short brief about offers, events and anything you want to avoid. We propose a calendar, you approve or change it, we prepare the posts, and approved items are scheduled. At the end of the month you receive a simple summary of what was posted and how it performed, which feeds into the next plan.',
      },
      {
        title: 'Handling comments and messages',
        p: 'Replies are handled within agreed hours using a tone and a set of answers you approve. Anything that needs a decision, such as a complaint, a refund or a price exception, is passed to you promptly instead of answered with a guess. This keeps responses consistent and avoids promises you did not make.',
      },
      {
        title: 'Working alongside your messaging',
        p: 'Social channels work best when they match what customers see in SMS and WhatsApp. An offer announced in a campaign can appear on your pages at the same time, and a support question that starts in a comment can move to a private message or a call. Our [WhatsApp Business API](/services/whatsapp-business-api) and [bulk SMS](/services/bulk-sms-otp-gateways) services cover those channels.',
      },
    ],
  },
  'it-solutions': {
    overview: 'One partner for the IT underneath your business. We set up and look after cloud hosting and networks, harden security, and run a helpdesk your team can call, so the systems that trigger your messages stay up and your staff have someone to ask.',
    features: [
      'Cloud hosting set-up and ongoing management',
      'Network design and installation for offices and sites',
      'Security hardening and regular reviews',
      'Helpdesk support for your team',
      'Integration of your systems with your messaging',
    ],
    howItWorks: [
      { title: 'Assess', desc: 'We review what you run today and where it is fragile.' },
      {
        title: 'Plan',
        desc: 'We agree what will be built or fixed, who owns it and how it is tested.',
      },
      {
        title: 'Implement',
        desc: 'We build and migrate in short steps and show progress as we go.',
      },
      { title: 'Support', desc: 'Helpdesk and ongoing care under an agreement that suits you.' },
    ],
    useCases: ['Corporates', 'Retail', 'Banking', 'IT Services'],
    faqs: [
      {
        q: 'Do you manage hosting for us?',
        a: 'Yes. We can set up and manage cloud hosting for your systems. Scope is agreed with you.',
      },
      {
        q: 'Can the helpdesk support our staff?',
        a: 'Yes. Helpdesk support for your team is part of the service. Hours and channels are confirmed in your agreement.',
      },
      {
        q: 'Can you connect our systems to SMS?',
        a: 'Yes. We integrate your applications with our messaging API so events in your systems send the right message.',
      },
    ],
    sections: [
      {
        title: 'What managed IT covers',
        p: 'We set up and look after cloud hosting, design and install networks for offices and sites, harden security and run a helpdesk your staff can call. The aim is to keep the systems underneath your business stable, including the ones that trigger your customer messages, so that outages and slow responses do not reach your customers.',
      },
      {
        title: 'How an engagement starts',
        p: 'We begin by reviewing what you run today and where it is fragile, such as single points of failure, unpatched systems, unclear ownership or missing backups. We then agree a plan with owners, timelines and how each change will be tested, and implement in short steps so you can see progress. Support continues after go-live with a clear way to raise issues.',
      },
      {
        title: 'Security basics we focus on',
        p: 'Most incidents come from basic gaps rather than exotic attacks. Typical priorities are keeping software patched, using multi-factor authentication, limiting who has administrator access, backing up data and testing the restore, and monitoring for unusual activity. We review these regularly and report what changed.',
      },
      {
        title: 'Connecting your systems to messaging',
        p: 'Order, billing, booking and support systems can call the SMS, voice and WhatsApp APIs directly so customers are notified without manual work. We help integrate them, handle credentials safely and set up monitoring for failed sends. See the [bulk SMS and OTP gateway](/services/bulk-sms-otp-gateways) page and the [SMPP versus REST guide](/resources/smpp-vs-rest-api) for the options.',
      },
    ],
  },
};
