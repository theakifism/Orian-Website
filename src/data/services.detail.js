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
      'Guidance through Meta Business verification requirements; approval is decided by Meta',
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
  'email-services': {
    overview: 'Email Services cover planned business email communications such as customer campaigns and announcements. Discuss audience, content, sending setup and reporting needs with the team; the available scope is confirmed for each project.',
    features: [
      'Campaign goals and audience planning',
      'Guidance on email content and templates',
      'Discussion of sending and integration requirements',
      'Reporting options agreed for your project',
    ],
    howItWorks: [
      { title: 'Set the goal', desc: 'Share the audience, purpose and expected sending pattern.' },
      { title: 'Plan the message', desc: 'Discuss content, templates, consent and list preparation.' },
      { title: 'Confirm setup', desc: 'Agree the sending method, responsibilities and available reporting.' },
      { title: 'Review', desc: 'Review the campaign outcome and next steps with the team.' },
    ],
    faqs: [
      { q: 'What kind of email is this for?', a: 'This service is for planned customer email communications such as campaigns and announcements. Automated account and receipt messages are covered under Transaction Email.' },
      { q: 'Can you work with our existing email platform?', a: 'Share your current setup and requirements. The team will confirm whether it can be supported.' },
      { q: 'Do you provide campaign reporting?', a: 'Reporting options depend on the sending setup and will be agreed before work begins.' },
    ],
    sections: [
      { title: 'Planned email communications', p: 'Email can support product announcements, customer updates and other planned communications. A clear audience, relevant content and appropriate permission to contact people should guide each campaign.' },
      { title: 'A separate path for automated messages', p: 'Campaigns are planned and sent to an audience. Messages triggered by events in an application, such as a receipt or account update, have different integration and monitoring needs. See [Transaction Email](/services/transaction-email) for those use cases.' },
      { title: 'Agree the scope before launch', p: 'Sending platform, domain setup, list preparation, content review and reporting depend on your existing tools and requirements. Discuss these with the team before scheduling a campaign.' },
    ],
  },
  'digital-solutions': {
    overview: 'Digital & IT Solutions brings together business websites, customer journeys, workflow improvements, system integrations, cloud hosting, network support, security and helpdesk services. The team will review your goals and confirm a practical scope before work begins.',
    features: [
      'Requirements discussion and project scoping',
      'Website, customer experience and workflow planning',
      'Application and messaging system integrations',
      'Cloud hosting, network and security support',
      'Helpdesk support for your team',
      'Project steps, owners and handover agreed up front',
    ],
    howItWorks: [
      { title: 'Assess', desc: 'Describe your goal and the current digital or IT setup.' },
      { title: 'Plan', desc: 'Agree scope, dependencies, owners, timeline and how the work will be reviewed.' },
      { title: 'Implement', desc: 'Deliver the agreed work in clear steps and share progress.' },
      { title: 'Handover and support', desc: 'Document the result and agree any ongoing support.' },
    ],
    faqs: [
      { q: 'What does Digital & IT Solutions include?', a: 'Depending on the agreed scope, work may include websites, customer journeys, workflow improvements, integrations, hosting, network and security support, or helpdesk services.' },
      { q: 'Can you manage hosting and support our staff?', a: 'Hosting and helpdesk options can be discussed with the team. Service scope, channels and support hours are agreed for each engagement.' },
      { q: 'Can you connect our systems to messaging?', a: 'Share the systems and customer flow you have in mind. SMS, voice, RCS, email and WhatsApp integration options can be discussed as part of project scoping.' },
      { q: 'Do you offer fixed packages?', a: 'Project scope depends on your requirements. Contact the team to discuss an estimate and delivery plan.' },
    ],
    sections: [
      { title: 'Digital projects and business IT', p: 'A digital project may improve a customer journey, replace repeated manual work or connect systems. IT support can cover the infrastructure around that work, including cloud hosting, office networks, security basics and helpdesk support.' },
      { title: 'Keep the scope clear', p: 'Existing platforms, access, content, integrations and review responsibilities all affect delivery. Agree on the outcome, owners, milestones and handover before implementation starts.' },
      { title: 'Managed IT and security', p: 'For ongoing IT needs, discuss hosting and network management, software updates, administrator access, backups and helpdesk coverage. The team will confirm which services and support arrangements are available for your business.' },
      { title: 'Digital work alongside messaging', p: 'Digital experiences can connect with customer communications where the systems support it. Discuss how your website or application could use [bulk SMS and OTP](/services/bulk-sms-otp-gateways), [RCS Messaging](/services/rcs-business-messaging) or [Transaction Email](/services/transaction-email).' },
    ],
  },
  'rcs-business-messaging': {
    overview: 'RCS Messaging can support richer business conversations with branded sender details and interactive content on compatible devices and networks. Availability, features and fallback depend on the recipient, carrier and agreed setup.',
    features: [
      'Discussion of branded RCS message formats',
      'Planning for cards, suggested replies and other supported content',
      'Review of device, carrier and sender verification requirements',
      'SMS fallback options discussed for your use case',
    ],
    howItWorks: [
      { title: 'Check your audience', desc: 'Discuss recipient markets, devices and the intended use case.' },
      { title: 'Plan the experience', desc: 'Choose message content and interactions suitable for the audience.' },
      { title: 'Confirm availability', desc: 'Review sender setup, integration and network support requirements.' },
      { title: 'Measure and adjust', desc: 'Agree what delivery and interaction information is available.' },
    ],
    faqs: [
      { q: 'Does RCS work on every phone?', a: 'No. RCS features depend on device, messaging app, carrier and market support. Confirm availability for your target audience before planning a campaign.' },
      { q: 'Can an RCS message include buttons or images?', a: 'RCS may support richer content and interactions on compatible devices and networks. The available options depend on the service setup.' },
      { q: 'What happens when RCS is unavailable?', a: 'An SMS fallback may be possible depending on the integration and campaign configuration. Confirm the fallback behavior before launch.' },
    ],
    sections: [
      { title: 'A richer format where it is supported', p: 'RCS can add branded presentation and interactive elements to business messaging. The experience depends on the recipient device, messaging app, carrier and local availability, so campaign planning should include a clear fallback.' },
      { title: 'Plan for eligibility and consent', p: 'Confirm sender setup, eligible audience, message purpose and recipient permissions before sending. Availability and policy requirements can vary across markets and providers.' },
      { title: 'RCS alongside SMS', p: 'RCS and SMS can serve different parts of the same communication plan. Discuss how RCS availability and [bulk SMS delivery](/services/bulk-sms-otp-gateways) may fit your audience and fallback needs.' },
    ],
  },
  'transaction-email': {
    overview: 'Transaction Email covers automated messages triggered by events in your application, such as receipts, account notices and service updates. Discuss the integration, expected volume and reporting requirements with the team.',
    features: [
      'Event-triggered email use-case planning',
      'Discussion of API or platform integration requirements',
      'Template and message flow review',
      'Delivery and failure reporting options agreed for your setup',
    ],
    howItWorks: [
      { title: 'Map the events', desc: 'Identify which application events should send an email.' },
      { title: 'Plan the content', desc: 'Review message templates and the information each event needs.' },
      { title: 'Connect the system', desc: 'Confirm the integration method and safe handling of credentials.' },
      { title: 'Monitor', desc: 'Agree how delivery status and sending issues will be reviewed.' },
    ],
    faqs: [
      { q: 'What is Transaction Email used for?', a: 'Common examples include receipts, password resets, booking confirmations and account activity notices triggered by an application.' },
      { q: 'Is this the same as an email campaign?', a: 'No. Transaction Email is triggered by an individual customer or system event. Planned messages to an audience are covered under Email Services.' },
      { q: 'Can you integrate with our application?', a: 'Share your application, event flow and technical requirements. The team will confirm a suitable integration option.' },
    ],
    sections: [
      { title: 'Messages tied to an event', p: 'Transactional messages respond to a customer or system action. Examples include a purchase receipt, password reset, booking confirmation or important account notice. These messages should be timely, relevant and limited to the event they confirm.' },
      { title: 'Design for safe, reliable flows', p: 'Plan how your application requests a send, handles errors and avoids accidental duplicate messages. Confirm the available delivery information and monitoring approach for your integration.' },
      { title: 'Campaigns are a separate service', p: 'Transaction Email is intended for event-triggered messages. Planned audience communications and campaigns are described under [Email Services](/services/email-services).' },
    ],
  },
};
