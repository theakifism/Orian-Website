// Heavy detail fields for whyUs entries, split out of whyUs.js so that only the detail pages
// (which are lazy route chunks) download them. List pages, the home page and the nav use the light
// entries in whyUs.js. Detail pages merge: { ...entry, ...whyUsDetail[entry.slug] }.
// Keys moved here: detail, points, sections, links.
// TODO(content)/TODO(review) notes for this content live at the top of whyUs.js.
export const whyUsDetail = {
  'support-247': {
    detail: 'Our support team is available 24/7 by phone, email and WhatsApp for onboarding, account questions and delivery issues. Include a message reference and the time it was sent so the team can investigate.',
    points: [
      'Describe what you expected and what happened',
      'Include a message reference when you have one',
      'Share the sender ID and template details involved',
      'Use the contact channel that suits your request',
    ],
    sections: [
      {
        title: 'What to send us when you raise an issue',
        p: 'A complete report lets an engineer trace one message through the gateway and the operator route, instead of asking you to repeat tests. Whichever channel you use, include the following:',
        ul: [
          'The message ID returned by the API, or your own reference for the message',
          'The sender ID and the template ID used',
          'The destination number, or a sample number, and the time of sending in IST',
          'The delivery status you received, and any error code or raw API response',
          'What you expected to happen, and how many messages are affected',
        ],
      },
      {
        title: 'Problems the support desk handles',
        p: 'Most requests fall into a few families, and knowing which one you have speeds up the answer.',
        ul: [
          'DLT sender ID or template rejections and how to correct them',
          'Delayed or missing OTPs on a particular operator or route',
          'Delivery reports that do not match what a recipient saw',
          'API authentication errors, rate limits and webhook failures',
          'Campaign scheduling, list upload and character-count questions',
        ],
      },
      {
        title: 'Choosing the right channel',
        p: 'Use the phone helpline for an urgent issue, and email for requests that need a written record. Current contact details are on the [contact page](/contact).',
      },
      {
        title: 'Before you need us',
        p: 'Watch your own delivery reports and agree with the team how to raise a service issue. Our guide to [delivery reports](/resources/bulk-sms-delivery-reports-explained) explains common status names.',
      },
    ],
    links: [
      { to: '/services/bulk-sms-otp-gateways', text: 'Bulk SMS and OTP gateway' },
      { to: '/contact', text: 'Contact the support team' },
    ],
  },
  'safe-effective-delegation': {
    detail: 'Before sharing customer messaging data with a provider, ask how it is protected, who can access it, what gets logged and how long information is retained. Ask for written answers that match your organization’s security requirements.',
    points: [
      'Encryption in transit and at rest',
      'Access roles and credential management',
      'Audit logs and export options',
      'Message and visit data retention periods',
    ],
    sections: [
      {
        title: 'What delegating your messaging really involves',
        p: 'When you hand customer messaging to a provider, you give it three jobs: carrying messages over operator routes, keeping the registrations and templates in order, and recording what happened. You keep the jobs that only you can do: deciding what is sent, to whom, and on what basis. Security depends on being clear about that split.',
      },
      {
        title: 'Controls worth asking any provider about',
        p: 'The following controls are reasonable to expect and to ask about during a security review. Ask to see how each works, not just whether it exists.',
        ul: [
          'Encryption of API calls and dashboard sessions in transit',
          'Role-based access, so that people see and do only what their job needs',
          'Separate credentials for each system or team, and a way to rotate them',
          'IP allow-listing for API and SMPP access where it fits your setup',
          'Exportable logs showing who sent what, when and with what result',
          'A clear policy on how long message content and logs are kept',
        ],
      },
      {
        title: 'Your side of the responsibility',
        p: 'Delegation does not remove your responsibility to assess how personal information is handled. Keep credentials out of client-side applications, review access when staff change roles and limit the personal data included in messages. Ask Orian for current security and retention details before onboarding, and read our [privacy policy](/privacy) for website data.',
      },
      {
        title: 'Keeping promotional and transactional traffic apart',
        p: 'A safe setup also keeps message types apart. Security codes and alerts travel on their own lane and templates, and campaigns use another, so a mistake in a campaign never delays or contaminates a customer’s login code. Our guide to [promotional versus transactional SMS](/resources/promotional-vs-transactional-sms) explains the difference.',
      },
    ],
    links: [
      { to: '/services/bulk-sms-otp-gateways', text: 'Bulk SMS and OTP gateway' },
      { to: '/compliance', text: 'Compliance and data handling' },
    ],
  },
  'instant-dlt-quick-setup': {
    detail: 'DLT onboarding involves registering the business entity, sender IDs and message templates. The process and timing depend on the completeness of the application and review by the relevant operator portals.',
    points: [
      'Confirm the required business documents',
      'Choose sender IDs related to your business',
      'Prepare templates for each message type',
      'Allow time for operator review and corrections',
    ],
    sections: [
      {
        title: 'What has to be approved before the first message',
        p: 'Under TRAI’s rules, nothing can be sent until a chain of records exists and matches. Each record depends on the one before it, so the order matters.',
        ul: [
          'Your business registered as a principal entity, with verified documents',
          'One or more sender IDs registered against that entity',
          'A template for every message type, each with its own ID',
          'Consent records, if you plan to send promotional messages',
        ],
      },
      {
        title: 'Where the time is really lost',
        p: 'The regulator and the operators decide approval timelines, so the part a provider can influence is the quality and order of the application.',
        ul: [
          'Business names that differ between documents and the application',
          'Sender IDs that do not obviously relate to the entity',
          'Templates filed in the wrong category, or with promotional wording in a transactional message',
          'Variables that are so open that a template could say anything',
          'Starting the paperwork only after the launch date is fixed',
        ],
      },
      {
        title: 'What quick setup can and cannot mean',
        p: 'A provider can help reduce avoidable rework by checking documents and template wording before submission. Ask the team whether a testing environment is available while approvals are in progress.',
      },
      {
        title: 'A day-one checklist',
        p: 'Have these ready when you start, and the process usually moves faster:',
        ul: [
          'Business registration and tax documents with matching names',
          'An authorisation letter and ID for the person signing',
          'The sender ID you want, and one or two backups',
          'A list of every message you plan to send, with the category of each',
        ],
      },
      {
        title: 'Read more',
        p: 'Our step-by-step guide to the [DLT registration process](/resources/trai-dlt-registration-process) covers each stage, with companion guides on [sender ID approval](/resources/sender-id-approval-guide) and [writing templates that get approved](/resources/dlt-template-basics).',
      },
    ],
    links: [
      { to: '/services/dlt-compliance', text: 'DLT registration service' },
      { to: '/developers', text: 'Ask about integration access' },
    ],
  },
  'strong-carrier-network': {
    detail: 'Orian uses direct operator routes with automatic failover. Carrier coverage and route behavior vary by destination and operator.',
    points: [
      'Which operators and regions are supported?',
      'How is route congestion handled?',
      'What fallback behavior is available?',
      'Which delivery data can customers review?',
    ],
    sections: [
      {
        title: 'Why route design matters',
        p: 'A message you send travels from your system to a gateway, then to an operator’s message centre, and finally to the handset. Each hop can add delay, and congestion at any one of them affects every message queued behind it. A message can also be filtered or throttled on a route that is under strain. Route design is how a provider reduces the chance that your message is the one caught in that queue.',
      },
      {
        title: 'Questions to ask about routes and failover',
        p: 'Orian sends through direct operator routes and automatically fails over when a route is congested or unavailable. Ask the team about coverage for the operators and regions that matter to your traffic.',
      },
      {
        title: 'What SMPP binds are',
        p: 'Operators and messaging platforms connect using SMPP, a long-established protocol in which a persistent connection, called a bind, carries messages and delivery reports in both directions. Several binds to the same operator share load and give a fallback if one is interrupted. Our guide to [SMPP versus REST](/resources/smpp-vs-rest-api) explains the protocol and when your own system might use it.',
      },
      {
        title: 'What you can check yourself',
        p: 'Compare submission and delivery times in your own reports, review failures and expired messages, and look for patterns by operator and time of day. Our guide to [reading delivery reports](/resources/bulk-sms-delivery-reports-explained) explains common status information. Use the Orian sandbox to test before launch.',
      },
    ],
    links: [
      { to: '/services/bulk-sms-otp-gateways', text: 'Bulk SMS and OTP gateway' },
      { to: '/developers', text: 'Ask about integration access' },
    ],
  },
  'high-speed-delivery': {
    detail: 'OTP delivery time depends on your integration, message configuration, mobile operator and recipient handset. Ask for measured performance information that matches your intended traffic and the operators you serve.',
    points: [
      'Measure from submission to delivery report',
      'Review median and slowest delivery times',
      'Check results across operators and time periods',
      'Set an expiry and retry policy for OTPs',
    ],
    sections: [
      {
        title: 'Why OTP delivery time matters',
        p: 'An OTP is time-sensitive because a person may be waiting at a screen. Measure the full path from your application request to the delivery report, and account for delays outside the gateway, including operator networks and recipient devices.',
      },
      {
        title: 'What affects how fast a message arrives',
        p: 'Speed is the sum of several steps, and only some of them are in a provider’s hands.',
        ul: [
          'How quickly your system calls the API after the user acts',
          'Queue time and the routing options configured for the service',
          'The route and the operator’s own message centre',
          'The handset: switched off, out of coverage or on a congested cell',
          'Content filtering, which can hold a message that breaks the template rules',
        ],
      },
      {
        title: 'Getting the most from a fast lane',
        p: 'Send OTPs from a transactional template and sender ID, put the code first in the text and keep the message to a single segment so it is not split. Do not add promotional wording, because that can change how the message is classified and routed. Our [OTP best practices guide](/resources/otp-best-practices) covers expiry, resend and retry design in more detail.',
      },
      {
        title: 'Measuring speed honestly',
        p: 'The only meaningful speed figure is one you measure on your own traffic. Log the time you submit each message and the time its delivery report arrives, then look at the median and the slowest tenth, not just the average. Slow outliers are what users complain about. Our [delivery report guide](/resources/bulk-sms-delivery-reports-explained) explains the statuses and timestamps you will see.',
      },
    ],
    links: [
      { to: '/services/bulk-sms-otp-gateways', text: 'Bulk SMS and OTP gateway' },
      { to: '/services/voice-sms-ivr', text: 'Voice OTP fallback' },
    ],
  },
};
