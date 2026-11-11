// Heavy detail fields for industries entries, split out of industries.js so that only the detail pages
// (which are lazy route chunks) download them. List pages, the home page and the nav use the light
// entries in industries.js. Detail pages merge: { ...entry, ...industryDetail[entry.slug] }.
// Keys moved here: overviewMore, scenarios, compliance, faqs, serviceLinks, guides.
// TODO(content)/TODO(review) notes for this content live at the top of industries.js.
export const industryDetail = {
  banking: {
    overviewMore: [
      'Banks, NBFCs, payment aggregators and fintech apps send some of the most time-sensitive messages on any network: a login code that expires in minutes, a debit alert the customer needs to see before they notice a missing balance, a card-block confirmation. These messages share one trait. If they arrive late, the transaction fails or the customer loses trust. That is why financial messaging is usually split into separate lanes, with authentication and alerts on a transactional route and collections or cross-sell messages kept apart.',
      'Because the content touches money and identity, templates are short, factual and tightly controlled. Variables are limited to values such as an amount, a masked account number and a date, and every message tells the customer what to do if they did not start the action themselves.',
    ],
    scenarios: [
      {
        title: 'Login and payment authentication',
        desc: 'A one-time password protects sign-ins, new-payee additions and card-not-present payments. The code goes first in the message so it shows in the notification preview, the expiry is stated, and a do-not-share warning is included. Your app can use the delivery report to offer a resend, or a voice call as a fallback, when the SMS is not confirmed.',
      },
      {
        title: 'Debit and credit alerts',
        desc: 'Customers expect an alert for each movement on their account. Alerts are triggered by the core banking or wallet system through the API, carry only a masked account reference, and return a delivery status you can store against the transaction for dispute handling.',
      },
      {
        title: 'Fraud and card-control notices',
        desc: 'Suspicious-login warnings, card freeze and unfreeze confirmations and new-device alerts need priority handling. A voice call through IVR can follow up when an alert is urgent and the customer has not responded.',
      },
      {
        title: 'EMI, due-date and recovery reminders',
        desc: 'Scheduled reminders ahead of an EMI date, and polite follow-ups after a missed payment, reduce manual calling. Keep these in a service or transactional template with a payment link or helpline number, and keep cross-sell wording out of them.',
      },
      {
        title: 'Statements, KYC and onboarding',
        desc: 'Short links to e-statements, KYC completion requests and account-opening status updates keep customers moving through onboarding. Where a message includes a link, confirm that the link domain is permitted for your template category.',
      },
    ],
    compliance: {
      title: 'Regulatory context for BFSI messaging',
      intro: 'Financial messages sit under two sets of rules: telecom rules for how commercial SMS is sent, and financial-sector rules for what customers must be told and how they are authenticated. The points below are a starting checklist for your compliance team, not legal advice.',
      notes: [
        'TRAI’s commercial communication rules require you to register as a principal entity on the operators’ DLT platforms, with every sender ID (header) and message template approved before you can send.',
        'OTPs and debit or credit alerts belong in the transactional category. Collection reminders and offers are not interchangeable with them, so register separate templates and keep promotional wording out of transactional messages.',
        'RBI rules on customer protection and on authentication for digital payments make alert and OTP delivery part of the payment flow itself. Confirm the circulars that apply to your licence type with your compliance team.',
        'Keep personal data in messages to a minimum: a masked account number, never a full number, and never a password, PIN or full card number. The Digital Personal Data Protection Act, 2023 also applies to the data you process.',
        'Keep a log of each message, its template and its delivery report for audit and dispute handling. Orian can export delivery logs on request.',
      ],
    },
    faqs: [
      {
        q: 'Do OTPs and transaction alerts use the same template?',
        a: 'No. Each message type is registered as its own template. An OTP template carries the code as a variable, while a debit alert carries an amount, a masked account reference and a date. Keeping them separate keeps approval simple and lets you change one without re-filing the other.',
      },
      {
        q: 'Can collection reminders go from the same sender ID as OTPs?',
        a: 'Often yes, if the sender ID is registered for both and each message uses a template of the right category. Settle this during onboarding so alerts and reminders stay in separate lanes.',
      },
      {
        q: 'How do we know an alert reached the customer?',
        a: 'Every SMS receives a delivery report that can be read through the API or webhook and stored against the transaction.',
      },
    ],
    serviceLinks: [
      {
        slug: 'bulk-sms-otp-gateways',
        lead: 'Authentication codes and account alerts are sent through our',
        anchor: 'bulk SMS and OTP gateway',
        tail: ', with a delivery report for every message.',
      },
      {
        slug: 'dlt-compliance',
        lead: 'Sender IDs and templates for financial messages are filed through our',
        anchor: 'DLT registration service',
        tail: ', so approval does not hold up your launch.',
      },
      {
        slug: 'voice-sms-ivr',
        lead: 'When an alert is urgent, a call can follow it using the',
        anchor: 'voice API and IVR',
        tail: '.',
      },
    ],
    guides: ['otp-best-practices', 'dlt-template-basics'],
  },
  retail: {
    overviewMore: [
      'Retail messaging has two very different shapes. Transactional traffic is steady and personal: a delivery OTP, an order confirmation, a refund notice. Promotional traffic is bursty and broad: a festival sale announced to a large opted-in list in a short window. Planning for both on one account is where retail teams run into trouble, because a large campaign can queue ahead of the codes customers are waiting for.',
      'The practical answer is to keep the lanes separate, register templates for each message type, and decide in advance which messages deserve SMS, which suit WhatsApp, and which are better left to an app notification.',
    ],
    scenarios: [
      {
        title: 'COD verification and delivery OTPs',
        desc: 'Cash-on-delivery orders carry real return risk. A confirmation code sent before dispatch, or a delivery OTP shared with the courier at the door, cuts fake orders and wrong-address handovers. These are transactional messages and should never wait behind a campaign.',
      },
      {
        title: 'Order, shipping and refund updates',
        desc: 'Confirmation, dispatch, out-for-delivery and refund-processed messages are triggered by your order system. A tracking link adds value, but check that the link domain is acceptable for your template category before filing.',
      },
      {
        title: 'Festival and sale broadcasts',
        desc: 'Large promotional sends should go to customers who have opted in, within the permitted sending hours, using a registered promotional template. Schedule in batches and read the delivery report afterwards to clean the list.',
      },
      {
        title: 'Cart recovery and back-in-stock nudges',
        desc: 'A short reminder about a basket or a restocked item works best on a channel the customer already uses. WhatsApp suits richer, two-way follow-ups, while SMS reaches customers who have not opted in to WhatsApp. Respect consent on each channel separately.',
      },
      {
        title: 'Loyalty and feedback messages',
        desc: 'Points-balance notices, membership renewals and post-delivery feedback requests keep customers engaged between purchases. Classify each carefully: a balance update can be a service message, while a prompt to redeem points reads as promotional.',
      },
    ],
    compliance: {
      title: 'Compliance notes for retail messaging',
      intro: 'Retail brands send both promotional and transactional messages, so the main discipline is classification. The category a message belongs to decides the template, the consent you need and the hours you can send.',
      notes: [
        'Send promotional messages only to numbers that have given consent or have no do-not-disturb preference. Store each opt-in with its date and source.',
        'There are permitted hours for promotional messages. Schedule campaigns inside them and confirm the current rules during onboarding.',
        'A delivery OTP or order confirmation is transactional. Adding a discount code changes its nature, so keep offers in a separate promotional template.',
        'Links in messages are checked more closely than they used to be. Use a consistent, registered domain for tracking links rather than a public shortener, and confirm what your template category allows.',
        'WhatsApp requires opt-in and has its own template approval and categories. Treat WhatsApp consent as separate from SMS consent.',
      ],
    },
    faqs: [
      {
        q: 'Can I include a discount code in an order confirmation?',
        a: 'It is safer not to. A confirmation is transactional, and promotional content inside it can lead to rejection or filtering. Send the offer as a separate promotional message to customers who have opted in.',
      },
      {
        q: 'Should abandoned-cart reminders go by SMS or WhatsApp?',
        a: 'It depends on consent and cost. Use WhatsApp where the customer has opted in and you want a richer, two-way message, and SMS as a broader fallback. Orian can set up both so you can compare results on your own data.',
      },
      {
        q: 'How do I avoid delayed OTPs during a big sale?',
        a: 'Run promotional campaigns and OTPs as separate message types so a campaign never queues ahead of a code, and stagger large sends. The delivery report shows where delays occur.',
      },
    ],
    serviceLinks: [
      {
        slug: 'bulk-sms-otp-gateways',
        lead: 'Delivery OTPs, order updates and sale broadcasts run on our',
        anchor: 'bulk SMS and OTP gateway',
        tail: ', with transactional and promotional traffic kept apart.',
      },
      {
        slug: 'whatsapp-business-api',
        lead: 'For richer, two-way order and cart messages, set up the',
        anchor: 'WhatsApp Business API',
        tail: ' alongside SMS.',
      },
      {
        slug: 'dlt-compliance',
        lead: 'Templates for each message type are registered through our',
        anchor: 'DLT registration service',
        tail: '.',
      },
    ],
    guides: ['promotional-vs-transactional-sms', 'sms-segments-explained'],
  },
  'healthcare-hospitals': {
    overviewMore: [
      'In healthcare, a message often replaces a phone call that nobody has time to make. Reminding a patient about tomorrow’s appointment, telling them a lab report is ready, or letting a family know a doctor is running late all save staff time and reduce missed visits. The same messages also carry sensitive context, so the discipline is to say enough to be useful and no more than is necessary.',
      'Good healthcare messaging is short, specific and calm. It names the facility, the date and time, and what the patient should do next, and it points to a secure link or a phone number for anything detailed.',
    ],
    scenarios: [
      {
        title: 'Appointment confirmations and reminders',
        desc: 'Send a confirmation when the booking is made and a reminder the day before, with a simple way to confirm, reschedule or cancel. A reply keyword or a link to your booking page reduces no-shows and frees slots for other patients.',
      },
      {
        title: 'Lab and diagnostic report notices',
        desc: 'Tell patients when a report is ready and give a secure link or a collection instruction. Do not put test names or results in the message. The SMS is a prompt to act, not the report itself.',
      },
      {
        title: 'Prescription and refill reminders',
        desc: 'Pharmacies and clinics can remind patients when a prescription is about to run out. Use a service template tied to the patient’s own request, and keep promotional content out of it.',
      },
      {
        title: 'Doctor delays and rescheduling',
        desc: 'Same-day changes need fast delivery. A short message about a delay or a new slot lets patients plan, and a voice call through IVR can reach those who do not respond.',
      },
      {
        title: 'Vaccination and follow-up notices',
        desc: 'Follow-up reminders after a procedure, or ahead of a scheduled vaccination, help continuity of care. Keep wording generic and point to the clinic’s number for questions.',
      },
    ],
    compliance: {
      title: 'Patient data and compliance notes',
      intro: 'Healthcare messages mix operational convenience with personal data. The notes below are a checklist for your own compliance review, not legal or clinical advice.',
      notes: [
        'Send appointment, report and refill reminders as transactional or service messages against registered DLT templates, and keep promotional health-check offers in a separate promotional template with consent.',
        'Keep diagnoses, test names, medicines and results out of SMS text. Use a secure link or ask the patient to call, because a message can be seen on a lock screen or by someone else holding the phone.',
        'The Digital Personal Data Protection Act, 2023 applies to personal data you process, including phone numbers and appointment details. Record why you hold a number and use it only for that purpose.',
        'Capture the patient’s agreement to receive reminders at registration, and give an easy way to stop them.',
        'Limit who in your team can export contact lists or delivery logs, and review that access periodically.',
      ],
    },
    faqs: [
      {
        q: 'Can the message include the name of the test or the doctor?',
        a: 'Include only what the patient needs to act, such as the facility, date and time. Avoid test names, results and diagnoses. A link to a secure page or a request to call is a safer way to share detail.',
      },
      {
        q: 'Do we need consent to send appointment reminders?',
        a: 'Reminders tied to a booking the patient made are generally treated as service messages, but record the patient’s agreement at registration and confirm with us how the category and template should be registered.',
      },
      {
        q: 'Can voice calls back up SMS for urgent changes?',
        a: 'Yes. Voice and IVR can follow up when an SMS is not confirmed, for example when a doctor is unavailable at short notice. Ask us about call logs and retry settings.',
      },
    ],
    serviceLinks: [
      {
        slug: 'bulk-sms-otp-gateways',
        lead: 'Appointment, report and refill messages are sent through our',
        anchor: 'bulk SMS gateway',
        tail: ' with a delivery report per message.',
      },
      {
        slug: 'voice-sms-ivr',
        lead: 'Urgent changes can be followed by a call using the',
        anchor: 'voice API and IVR service',
        tail: '.',
      },
      {
        slug: 'dlt-compliance',
        lead: 'Healthcare templates are drafted and filed through our',
        anchor: 'DLT compliance service',
        tail: '.',
      },
    ],
    guides: ['dlt-template-basics', 'bulk-sms-delivery-reports-explained'],
  },
  'educational-institutes': {
    overviewMore: [
      'Schools, colleges and EdTech platforms share one communication problem: a large, predictable audience that needs timely, reliable notices. An absence alert, a change of exam date or a fee reminder reaches parents who may not open an app or check email, so SMS remains a dependable channel, with WhatsApp and voice alongside it.',
      'The messages are mostly service messages tied to a student record, and the best setups pull data straight from the school management system so staff are not typing alerts by hand.',
      'Rollout tends to work best in small steps. Many institutions begin with attendance alerts because the data already exists in the school system and the benefit is immediate, then add fee reminders and exam notices once staff trust the process. Before the first send, clean the parent contact list: one wrong digit or an outdated number in a single class register means a parent never hears about a closure. Ask parents to confirm their number at admission, and review the list every term.',
    ],
    scenarios: [
      {
        title: 'Attendance and absence alerts',
        desc: 'Mark attendance, and parents receive a short message the same morning if their child is absent. Triggered from your management system by the API, these alerts reduce calls to the front office.',
      },
      {
        title: 'Exam schedules, hall tickets and results',
        desc: 'Announce dates, share a link to the hall ticket and notify parents when results are published. Scheduled sends make sure notices go out at a sensible hour, not in the middle of the night.',
      },
      {
        title: 'Fee reminders',
        desc: 'A reminder before the due date and a follow-up after it, each with a payment link or an office contact, help collections without calling every household. Keep the tone polite and factual.',
      },
      {
        title: 'Emergency and holiday notices',
        desc: 'Weather closures, bus delays and sudden holidays are time-critical. A broadcast to a class or the whole roster, with a voice call for urgent cases, reaches families quickly.',
      },
      {
        title: 'EdTech onboarding and engagement',
        desc: 'Learning platforms send verification OTPs at sign-up, class-start reminders and certificate-ready notices. Keep OTPs on a transactional template and reminders on a service template.',
      },
    ],
    compliance: {
      title: 'Compliance notes for schools and EdTech',
      intro: 'Education messages are usually service or transactional, but they concern children, which raises the care needed with data. Use this as a checklist for your own review, not legal advice.',
      notes: [
        'Register the institution as a principal entity with a sender ID parents will recognise, and file templates for attendance, exams, fees and notices.',
        'Messages about a student are personal data about a child. The Digital Personal Data Protection Act, 2023 sets stricter expectations for children’s data, including parental consent in many cases, so confirm what applies to your institution.',
        'Do not send marks or other sensitive details in the SMS text. Send a link to a login-protected page instead.',
        'Keep fee reminders and notices separate from promotional admissions or course offers. Admissions campaigns need consent and a promotional template.',
        'Keep the parent contact list current, and remove numbers that bounce or opt out.',
      ],
    },
    faqs: [
      {
        q: 'Can we send fee reminders by SMS?',
        a: 'Yes, using a registered template. Include the amount, the due date and a payment link or office number. Keep admissions or course offers in a separate promotional template that goes only to consenting numbers.',
      },
      {
        q: 'How do we reach thousands of parents quickly?',
        a: 'Upload the list by CSV or send through the API from your school management system. Orian returns a delivery report for each message, so you can see which numbers failed and correct them.',
      },
      {
        q: 'Can we send messages in Hindi or Marathi?',
        a: 'Yes, where the template is registered in that language. Regional-language text uses Unicode, which allows fewer characters per segment, so keep messages short.',
      },
    ],
    serviceLinks: [
      {
        slug: 'bulk-sms-otp-gateways',
        lead: 'Attendance alerts, exam notices and fee reminders go out through our',
        anchor: 'bulk SMS gateway',
        tail: ', by CSV upload or API.',
      },
      {
        slug: 'dlt-compliance',
        lead: 'The institution’s sender ID and templates are registered through our',
        anchor: 'DLT registration service',
        tail: '.',
      },
      {
        slug: 'voice-sms-ivr',
        lead: 'Emergency notices can also be sent as recorded calls with the',
        anchor: 'voice broadcasting service',
        tail: '.',
      },
    ],
    guides: ['sms-segments-explained', 'sender-id-approval-guide'],
  },
  corporates: {
    overviewMore: [
      'Inside a large organisation, SMS is rarely the main channel, but it is the one that works when everything else is down. Login codes for VPN and single sign-on, alerts to on-call managers, vendor payment confirmations and shift changes for field staff all depend on a message reaching a phone, whether or not a laptop is open.',
      'Corporate messaging is a mix of security and operations. The first needs speed and a clean audit trail. The second needs reliable group delivery and a sensible way to manage the lists.',
      'Governance matters more than volume here. Decide who owns the account, who can approve a broadcast to all staff and how requests are logged, so that a mistyped message to the whole company cannot go out unreviewed. Keep the contact source of truth in your HR or identity system, and sync it rather than maintaining spreadsheets by hand. When people change roles or leave, the lists should follow automatically, otherwise security codes and alerts end up reaching the wrong phones.',
    ],
    scenarios: [
      {
        title: 'Single sign-on and VPN codes',
        desc: 'Second-factor codes for remote access, admin consoles and finance systems are time-critical and security-sensitive. Use a transactional template, state the expiry, and let your identity provider read the delivery report before it offers another channel.',
      },
      {
        title: 'Vendor and invoice notifications',
        desc: 'Payment confirmations, invoice-received notices and purchase-order updates keep suppliers informed without a call to accounts payable. Triggered from your ERP, each message carries a reference number the vendor can quote.',
      },
      {
        title: 'Workforce shift and roster updates',
        desc: 'Field, warehouse and plant teams do not sit at desks. A shift change or a site-closure notice by SMS reaches them on the device they already carry, and a delivery report shows who has not received it.',
      },
      {
        title: 'Incident and on-call alerts',
        desc: 'When monitoring fires, the message that wakes the right person needs a short summary, a severity and a link. Voice calls can escalate when an SMS is not acknowledged.',
      },
      {
        title: 'Visitor, onboarding and HR notices',
        desc: 'Visitor passes, joining formalities, security-awareness reminders and policy updates are low-volume but frequent. Keep them in a service template and separate from marketing messages.',
      },
    ],
    compliance: {
      title: 'Compliance notes for enterprise messaging',
      intro: 'Enterprise messaging is mostly transactional or service traffic, but it often touches employee and vendor data. Treat this as a checklist for your own governance review.',
      notes: [
        'Register one entity and a small set of sender IDs, and keep security codes on a transactional template and staff broadcasts on a service template.',
        'Messages to employees still need a proper basis. Record where staff numbers come from and how people can update them.',
        'Use role-based access so only authorised administrators can upload lists or trigger broadcasts.',
        'Keep a delivery log that security and audit teams can export, and align retention with your internal policy.',
        'If you also message customers, vendors or candidates, treat each group as its own list with its own consent.',
      ],
    },
    faqs: [
      {
        q: 'Can one sender ID carry both security codes and staff broadcasts?',
        a: 'You can register several templates under a sender ID, but many organisations keep two so employees recognise security messages instantly. Decide this during onboarding.',
      },
      {
        q: 'Can SMS be the fallback when an app notification fails?',
        a: 'Yes. Many enterprises send an SMS or a voice call when a push notification is not acknowledged. Delivery reports let your system decide when to fall back.',
      },
      {
        q: 'Is there an audit trail for messages sent?',
        a: 'Each message has a delivery report, and logs can be exported on request, so your security team can review who received what and when.',
      },
    ],
    serviceLinks: [
      {
        slug: 'bulk-sms-otp-gateways',
        lead: 'Sign-in codes and staff broadcasts run on our',
        anchor: 'bulk SMS and OTP gateway',
        tail: '.',
      },
      {
        slug: 'voice-sms-ivr',
        lead: 'On-call escalation can use the',
        anchor: 'voice API and IVR service',
        tail: ' when a message is not acknowledged.',
      },
      {
        slug: 'it-solutions',
        lead: 'If you need hosting, networks or helpdesk alongside messaging, see our',
        anchor: 'managed IT solutions',
        tail: '.',
      },
    ],
    guides: ['smpp-vs-rest-api', 'otp-best-practices'],
  },
  'it-services': {
    overviewMore: [
      'Software companies and cloud platforms use SMS for the moments when a user must prove who they are or hear about a problem quickly: sign-up verification, password reset, new-device sign-in, billing failures and incident notices. These flows run thousands of times a day and are judged on conversion, so a code that arrives late shows up as a lost sign-up.',
      'For a product team, the questions are less about copy and more about integration: how the API behaves under load, how delivery status comes back, and what happens when a message fails.',
      'Cost control is part of design. An open verification endpoint can be abused to trigger large numbers of messages, so rate-limit by number, by IP address and by account, and add a short cool-down between resends. Track the ratio of codes requested to codes verified: a sudden drop usually signals either abuse or a delivery problem on one route. Alert your own team when either moves, instead of finding out from the month-end invoice.',
    ],
    scenarios: [
      {
        title: 'Sign-up and phone verification',
        desc: 'Verify a number at registration with a short code. Put the code first, state the expiry, and rate-limit requests per number so the flow cannot be abused to generate spam or cost.',
      },
      {
        title: 'Password reset and account recovery',
        desc: 'Recovery codes are the highest-risk OTPs you send. Keep expiries short, invalidate a code after use, and notify the user by message when a reset succeeds so an unauthorised change is noticed quickly.',
      },
      {
        title: 'Incident, downtime and breach notices',
        desc: 'Send a short notice when a service degrades or a security event needs users to act, with a link to a status page. Prepare and register these templates in advance, because filing one in the middle of an incident is too late.',
      },
      {
        title: 'Multi-tenant application alerts',
        desc: 'SaaS platforms send alerts on behalf of many customers. Keep each tenant’s sender and template mapping clear, and tag messages with an internal reference so delivery reports can be matched back to the right customer.',
      },
      {
        title: 'API-driven step-up checks',
        desc: 'Trigger a code for sensitive actions such as changing an email, adding a payout account or exporting data. Use webhooks to receive delivery status and decide on a resend or an alternative channel.',
      },
    ],
    compliance: {
      title: 'Technical and compliance notes for platforms',
      intro: 'Platform teams care about integration details as much as rules, so this checklist covers both. It is general guidance, not legal advice.',
      notes: [
        'Recipients in India are covered by the DLT framework. Register your entity, sender ID and every OTP and alert template before going live.',
        'If some of your users are outside India, routes, sender ID rules and consent requirements differ by country. Confirm coverage and requirements for each destination before launch.',
        'Protect your OTP endpoint with rate limits per number and per IP, short expiries and attempt limits, to prevent abuse and unexpected cost.',
        'Choose the integration that suits your stack: the REST API for most web and mobile back ends, or an SMPP connection for very high sustained volume.',
        'Use the sandbox to test message flow and webhook handling before sending to real users.',
      ],
    },
    faqs: [
      {
        q: 'Do you offer a sandbox for testing?',
        a: 'Yes. A sandbox is available to test sends and webhook handling before going live. Contact Orian for access.',
      },
      {
        q: 'Should we use the REST API or SMPP?',
        a: 'Most product teams start with the REST API. SMPP suits very high sustained throughput or an existing SMPP-based stack. Our guide to SMPP versus REST explains the trade-offs.',
      },
      {
        q: 'Can we get delivery status in real time?',
        a: 'Yes. A delivery report is returned for each message and can be sent to a webhook so your application can react, for example by offering a resend.',
      },
    ],
    serviceLinks: [
      {
        slug: 'bulk-sms-otp-gateways',
        lead: 'Verification codes and alerts are sent through our',
        anchor: 'OTP and bulk SMS API',
        tail: ', with delivery reports per message.',
      },
      {
        slug: 'it-solutions',
        lead: 'For hosting, security hardening and helpdesk alongside messaging, see our',
        anchor: 'managed IT solutions',
        tail: '.',
      },
      {
        slug: 'dlt-compliance',
        lead: 'Indian OTP and alert templates are registered through our',
        anchor: 'DLT registration service',
        tail: '.',
      },
    ],
    guides: ['smpp-vs-rest-api', 'bulk-sms-delivery-reports-explained'],
  },
};
