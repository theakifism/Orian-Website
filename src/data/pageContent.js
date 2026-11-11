// Supporting copy and FAQs for hub and utility pages (rendered by <PageContent id="..." />).
// Text uses [anchor](/path) for internal links. FAQs are also emitted as FAQPage JSON-LD and
// verify-seo checks that every question and answer is visible on the page.
// TODO(review): general explanatory copy. Confirm any statement about Orian's own process
//  (response times, support, onboarding) is accurate before publishing.
export const pageContent = {
  useCases: {
    sections: [
      { title: 'How to choose the right message type', p: 'Most business texting falls into four groups, and choosing correctly at the start saves a rejected template later. Ask what triggered the message and what it is trying to do.', ul: ['A code the customer must enter right now is an [OTP and verification message](/use-cases/otp-verification)', 'News about something the customer just did, such as a payment or an order, is a [transactional alert](/use-cases/transactional-alerts)', 'An offer, launch or announcement to people who opted in is a [promotional campaign](/use-cases/promotional-campaigns)', 'A prompt about a future date or due payment is a [reminder](/use-cases/reminders)'] },
      { title: 'Why each type has its own template and route', p: 'Commercial messages in India are subject to registration and category requirements. Routing and traffic handling vary by provider and account. Our guide to [promotional vs transactional SMS](/resources/promotional-vs-transactional-sms) explains common message types.' },
      { title: 'Common mix-ups to avoid', ul: ['Putting a discount code inside an order confirmation, which may change how the message is classified', 'Using one catch-all template instead of a template that matches the message type', 'Sending reminders after the customer has already paid or confirmed', 'Reviewing delivery status and other signals when investigating message outcomes'] },
    ],
    faqTitle: 'Questions about message types',
    faqs: [
      { q: 'Can I include an offer in an OTP or order message?', a: 'It is safer not to. An offer changes how the message is classified and can cause rejection or filtering. Keep OTPs and alerts clean and send offers as a separate promotional message to customers who opted in.' },
      { q: 'Do I need a separate sender ID for each use case?', a: 'Not always, but many businesses use one sender ID for security codes and another for notices or promotions so customers recognise each at a glance. Decide this before you register.' },
      { q: 'Can one account handle all four message types?', a: 'Yes. Orian supports OTP, transactional, promotional and reminder messaging through API and dashboard integrations.' },
    ],
  },

  helpCenter: {
    sections: [
      { title: 'Where to start', p: 'If you are new to sending commercial SMS in India, read these in order. They cover the registration steps, how messages are classified and how to confirm that a message arrived.', ul: ['[TRAI DLT registration process](/resources/trai-dlt-registration-process): the order of steps from entity to templates', '[How sender IDs are approved](/resources/sender-id-approval-guide): naming rules and common rejections', '[DLT templates and rejections](/resources/dlt-template-basics): how to write a template that passes', '[Promotional vs transactional SMS](/resources/promotional-vs-transactional-sms): which category your message belongs to', '[Delivery reports explained](/resources/bulk-sms-delivery-reports-explained): what each status means'] },
      { title: 'Still stuck?', p: 'Use the [contact page](/contact) for phone numbers, email addresses and the requirements form, or ask the [AI assistant](/assistant) a general question. When reporting a message issue, include its reference, sender ID, template ID, destination number and send time if available.' },
    ],
    faqTitle: 'Common questions',
    faqs: [
      { q: 'How do I get my sender ID and templates approved?', a: 'Orian’s compliance team files your entity, sender ID and templates. Entity registration usually takes 2–3 business days; template review typically takes 24–48 hours after correct submission.' },
      { q: 'Why was my message not delivered?', a: 'The usual causes are a template that does not match the registered text, a number with a do-not-disturb preference receiving a promotional message, an inactive number, or route congestion. The delivery report for the message shows the status and, where available, the reason.' },
      { q: 'How do I send OTPs from my application?', a: 'Register the OTP template, integrate through the Orian messaging API, then use each message’s delivery report to follow its status.' },
      { q: 'How do I reach support?', a: 'Call or email our 24/7 support team, or contact us on WhatsApp.' },
    ],
  },

  assistant: {
    sections: [
      { title: 'What you can ask the assistant', p: 'The assistant is built to answer questions about Orian’s services and the rules around business messaging in India.', ul: ['How DLT registration works and what documents are usually needed', 'The difference between OTP, transactional, service and promotional messages', 'How WhatsApp Business API onboarding and templates work', 'What the voice API and IVR can do', 'Which of our services suits a particular use case'] },
      { title: 'Getting the best answers', p: 'Be specific, and ask one question at a time; follow-up questions work well. Instead of “help with SMS”, say what you send, to whom and in what volume, and what is going wrong. Mention the channel you care about (SMS, voice or WhatsApp) and whether your DLT registration is already done, because the answer differs. Answers from an AI assistant are general guidance. For anything that affects compliance, pricing or contracts, confirm with our team through the [contact page](/contact).' },
    ],
    faqTitle: 'About the assistant',
    faqs: [
      { q: 'Is the assistant a person?', a: 'No. It is an AI assistant trained to answer questions about Orian’s services. You can reach our team directly at any time through the contact page.' },
      { q: 'Can the assistant register my sender ID or templates?', a: 'No. It explains the process. Registration is handled by our compliance team through the DLT service.' },
    ],
  },

  whyUs: {
    sections: [
      { title: 'What to look for in a messaging provider', p: 'Per-message price is only one part of the cost of messaging. A cheaper route that delays your OTPs, or a provider that leaves you to handle registration alone, costs more in lost sign-ups and engineering time. When you compare providers, check the following.', ul: ['Support: who answers, at what hours and through which channels', 'Registration: whether they help you file DLT entities, sender IDs and templates', 'Delivery: whether every message has a delivery report you can read in your own system', 'Routes: how traffic is carried and what happens when a route fails', 'Security: how access, keys and logs are controlled', 'Separation: whether transactional and promotional traffic run apart'] },
      { title: 'Read the detail behind each reason', p: 'Explore support, delegation, DLT, carrier network and delivery topics, then discuss your requirements with Orian. Browse our [industry pages](/industries) for common messaging use cases.' },
    ],
    faqTitle: 'Choosing a messaging provider',
    faqs: [
      { q: 'How do I compare messaging providers fairly?', a: 'Compare them on the same message types and volumes, and ask each for the same things in writing: registration help, support hours, delivery reports, route handling and what is included in the price.' },
      { q: 'Is the cheapest price per SMS the best choice?', a: 'Not usually. Delivery speed, failure handling and support affect conversion and staff time, and a very low rate can hide extra charges or slower routes.' },
      { q: 'What should support include?', a: 'Orian provides 24/7 support by phone, email and WhatsApp, plus help tracing message issues.' },
    ],
  },

  contact: {
    sections: [
      { title: 'Which channel to use', p: 'Use the phone helpline when live traffic is affected, such as an outage or a sudden rise in failed messages. Use email for requests that need a record, such as a template change or an invoice question. Use the requirements form for anything custom, such as special routing, higher throughput or a bespoke integration.' },
      { title: 'What to include in your request', ul: ['What you plan to send: OTPs, alerts, campaigns, reminders, voice or WhatsApp', 'Expected monthly volume and your busiest hour', 'Whether your DLT entity, sender ID and templates are already registered', 'Where your customers are: India, abroad or both', 'How you plan to integrate: API, dashboard or CSV upload'] },
      { title: 'Visiting our office', p: 'Our office is in Nagpur, Maharashtra. The address and a directions link are on this page. Please phone or email before visiting so the right person is available.' },
    ],
    faqTitle: 'Before you get in touch',
    faqs: [
      { q: 'How quickly will you respond?', a: 'Phone, email and WhatsApp support are available 24/7. For non-urgent requests, use the requirements form.' },
      { q: 'Can you set up custom routing or higher throughput?', a: 'Yes, that is what the special requirements form is for. Describe your volumes and your use case and our team will review them.' },
      { q: 'Do you work with businesses outside India?', a: 'India is our primary market, and international traffic is available on request.' },
    ],
  },

  about: {
    sections: [
      { title: 'What Orian does', p: 'Orian Teleservices provides business messaging and voice: bulk SMS and OTP delivery, voice calls and IVR, WhatsApp Business API, DLT registration help, social media handling and IT solutions. SMS uses direct operator routes with automatic failover, API integration and a delivery report for every message. See all [services](/services).' },
      { title: 'Who we work with', p: 'We serve banks and fintechs, retailers, hospitals and diagnostics, schools and EdTech, corporates and IT platforms. Each has different rules and different message types, which is why we publish a page for each: start with [BFSI and fintech](/industries/banking) or browse all [industries](/industries).' },
      { title: 'How we work', ul: ['Registration help: our team guides you through DLT', 'Support: a 24/7 helpline for service questions', 'Delivery reporting: every SMS has a delivery report', 'Practical guidance: our [guides](/resources) explain messaging topics in plain language'] },
      { title: 'Where we are', p: 'Our office is in Nagpur, Maharashtra. You can reach us through the [contact page](/contact).' },
    ],
    faqTitle: 'About Orian Teleservices',
    faqs: [
      { q: 'Where is Orian Teleservices based?', a: 'Orian Teleservices is based in Nagpur, Maharashtra, India.' },
      { q: 'What services does Orian offer?', a: 'Bulk SMS and OTP gateways, voice SMS and IVR, WhatsApp Business API, DLT assistance and compliance, social media handling and IT solutions.' },
      { q: 'Does Orian handle traffic outside India?', a: 'India is our primary market, and international traffic is available on request.' },
    ],
  },

  developers: {
    sections: [
      { title: 'Integrate through the API', p: 'Orian provides a messaging API and SMPP integration. Request the technical documentation and credentials from the team before implementation.' },
      { title: 'Plan delivery reporting', p: 'Every SMS includes a delivery report. Review the report status and use the API or webhook integration to update your application. Our [delivery reports guide](/resources/bulk-sms-delivery-reports-explained) explains common SMS status terminology.' },
      { title: 'Design for retries and duplicate events', p: 'Network calls can fail, and callbacks may be repeated. When the chosen integration supports retries or callbacks, use your own message reference, make processing safe to repeat and define an expiry for time-sensitive messages such as OTPs.' },
      { title: 'Test in the sandbox', p: 'A sandbox API key is usually issued within minutes of signup. Use it to test message flows and webhook handling before sending to real users.' },
    ],
    faqTitle: 'Developer questions',
    faqs: [
      { q: 'Is a sandbox available?', a: 'Yes. Request access from the Orian team to test message sends and webhook handling.' },
      { q: 'Which integration methods are supported?', a: 'Orian supports API and SMPP integration. Contact the team for the current documentation and credentials.' },
      { q: 'Can I receive delivery reports?', a: 'Yes. Every SMS receives a delivery report, available through the integration.' },
    ],
  },

  services: {
    sections: [
      { title: 'How the services fit together', p: 'Most customers start with the [bulk SMS and OTP gateway](/services/bulk-sms-otp-gateways) and add the others as they grow. [DLT assistance](/services/dlt-compliance) comes first, because nothing can be sent until sender IDs and templates are approved. [Voice and IVR](/services/voice-sms-ivr) backs up SMS for urgent messages, and the [WhatsApp Business API](/services/whatsapp-business-api) handles richer two-way conversations. [Social media handling](/services/social-media-handling) and [IT solutions](/services/it-solutions) support the rest of your customer-facing operation.' },
      { title: 'Choosing where to begin', ul: ['Sending OTPs or alerts from an app: start with the SMS gateway and DLT assistance', 'Running promotions: add promotional templates and consent records', 'Needing a fallback for failed codes: add voice', 'Supporting customers in chat: add WhatsApp', 'Needing help with systems and hosting: add IT solutions'] },
    ],
    faqTitle: 'Questions about our services',
    faqs: [
      { q: 'Which service should I start with?', a: 'For most businesses it is DLT assistance followed by the SMS gateway, because messages cannot be sent until registrations are approved.' },
      { q: 'Can I use SMS, voice and WhatsApp together?', a: 'Yes. A common pattern is SMS first, then WhatsApp or a voice call when a message is not delivered or confirmed.' },
    ],
  },

  industries: {
    sections: [
      { title: 'Why messaging differs by industry', p: 'A bank sending a login code, a hospital reminding a patient and a retailer announcing a sale are all sending SMS, but the rules, the message types and the risks are different. Each industry page explains common use cases and topics to consider before registering messages.' },
      { title: 'Where to start', p: 'Financial services should begin with [BFSI and fintech](/industries/banking), and online sellers with [retail](/industries/retail). Healthcare teams will find notes on patient data in [healthcare](/industries/healthcare-hospitals), schools in [education](/industries/educational-institutes), and product teams in [IT and cloud platforms](/industries/it-services). Internal and vendor messaging is covered under [corporates](/industries/corporates).' },
    ],
    faqTitle: 'Questions about industries',
    faqs: [
      { q: 'Is my industry covered?', a: 'Our pages cover six sectors, but the services work for any business that sends customer messages. Contact us if yours is not listed and we will review your use case.' },
      { q: 'Do regulations differ by sector?', a: 'Yes. Telecom rules apply to every commercial message, and some sectors have additional rules on authentication, data or consent. Each industry page lists the main points to check with your compliance team.' },
    ],
  },

  resources: {
    sections: [
      { title: 'Where to start', p: 'If you are new, begin with the [DLT registration process](/resources/trai-dlt-registration-process), then read about [sender IDs](/resources/sender-id-approval-guide) and [templates](/resources/dlt-template-basics). Once you are sending, the guides on [delivery reports](/resources/bulk-sms-delivery-reports-explained) and [SMS segments](/resources/sms-segments-explained) help you control cost and quality.' },
      { title: 'Guides for developers and product teams', p: 'Building an integration? Read [SMPP vs REST](/resources/smpp-vs-rest-api) and the [OTP best practices](/resources/otp-best-practices). Planning WhatsApp? See [WhatsApp Business API pricing explained](/resources/whatsapp-business-api-pricing-explained). Request Orian API specifications and sandbox access through the [developers page](/developers).' },
    ],
    faqTitle: 'About these guides',
    faqs: [
      { q: 'Are the guides legal advice?', a: 'No. They are general explanations. Rules change, so confirm current requirements with your compliance contact before filing.' },
      { q: 'How often are the guides updated?', a: 'Each guide shows its date, and we update them when requirements change.' },
    ],
  },
};
