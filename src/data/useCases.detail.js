// Heavy detail fields for useCases entries, split out of useCases.js so that only the detail pages
// (which are lazy route chunks) download them. List pages, the home page and the nav use the light
// entries in useCases.js. Detail pages merge: { ...entry, ...useCaseDetail[entry.slug] }.
// Keys moved here: intro, points, steps, faqs, sections.
// TODO(content)/TODO(review) notes for this content live at the top of useCases.js.
export const useCaseDetail = {
  'otp-verification': {
    intro: 'An OTP only works if it arrives while the person is still looking at the screen. OTP traffic needs its own template, a clear sender ID and a route chosen for speed.',
    points: [
      'Registered transactional template with the code as a variable',
      'Short expiry stated in the message, with a do-not-share warning',
      'A separate lane from promotional traffic so campaigns never queue ahead of codes',
      'Delivery reports so your app can offer a resend when a message is not confirmed',
    ],
    steps: [
      {
        title: 'Register',
        desc: 'Entity, sender ID and the OTP template are registered on DLT.',
      },
      {
        title: 'Integrate',
        desc: 'Call the API from your sign-in or checkout flow with the code as a variable.',
      },
      {
        title: 'Verify',
        desc: 'Your app checks the code and uses the delivery report to decide on a resend.',
      },
    ],
    faqs: [
      {
        q: 'Does an OTP need a registered template?',
        a: 'Yes. In India, transactional and OTP messages are sent against a template registered on the DLT platform.',
      },
      {
        q: 'Can I send OTPs and campaigns from one account?',
        a: 'Yes. They run as separate message types so that one does not slow the other.',
      },
    ],
    sections: [
      {
        title: 'Where one-time passwords are used',
        p: 'OTPs confirm that the person holding the phone is the person acting. The common cases are sign-in and two-step verification, password reset, adding a new payee or changing a payout account, approving an online payment, confirming a phone number at sign-up, and handing over a delivery at the door. Each is a short, high-stakes moment where the user is waiting on the screen, so speed and clarity matter more than anything else in the message.',
      },
      {
        title: 'What a good OTP message contains',
        p: 'Keep the message to a single segment and put the essentials in a fixed order.',
        ul: [
          'The code first, so it appears in the notification preview',
          'The product or brand name, so the user knows what the code is for',
          'The expiry, such as “valid for 10 minutes”',
          'A short instruction not to share the code with anyone',
          'No links, no offers and no promotional wording',
        ],
      },
      {
        title: 'Designing the flow around delivery',
        p: 'The message is only half of the experience. Generate codes with a secure random source, make each one single-use, and expire it after a few minutes. Let the user request a new code, but make them wait a short time first, and cap the number of attempts and resends per phone number. Rate-limit by phone number and by IP address so the endpoint cannot be used to trigger large volumes of messages. If no delivery report arrives after a short wait, offer a voice call as a fallback instead of asking the user to keep tapping resend. Avoid revealing whether a number is registered in the error messages you show.',
      },
      {
        title: 'Problems to watch for',
        p: 'Most OTP complaints trace back to a handful of causes: a template that does not match what was registered, a message that spilled into two segments, a promotional route used by mistake, or duplicate sends caused by a retry without a reference. Test every template in the sandbox with real handsets on more than one operator before launch, and log the message reference next to each code request so support can trace a single attempt.',
      },
      {
        title: 'What to measure',
        p: 'Track the share of code requests that end in a successful verification, the median time from request to verification, and the failure reasons by operator. A drop in the first number with no change in traffic usually points to a delivery problem on one route. Our [OTP best practices guide](/resources/otp-best-practices) goes deeper on wording and security, and the [delivery reports guide](/resources/bulk-sms-delivery-reports-explained) explains the statuses you will be monitoring.',
      },
    ],
  },
  'transactional-alerts': {
    intro: 'Transactional alerts confirm something the customer just did: an order, a payment, a booking. They are expected, time-sensitive and tied to a real event in your system.',
    points: [
      'Templates with variables for names, amounts, dates and tracking links',
      'Triggered by events in your own system through the API',
      'Delivery status returned per message for support and audit',
      'Sensible retry rules for temporary delivery failures',
    ],
    steps: [
      {
        title: 'Map events',
        desc: 'List the events that should send a message and the template each one uses.',
      },
      {
        title: 'Register templates',
        desc: 'Each template is registered on DLT with its variables defined.',
      },
      {
        title: 'Trigger by API',
        desc: 'Your system calls the API when the event happens and stores the delivery report.',
      },
    ],
    faqs: [
      {
        q: 'Can alerts include links?',
        a: 'Yes, where the link is allowed by your registered template and your operator rules. We will check this during registration.',
      },
      {
        q: 'How do I know a customer received an alert?',
        a: 'Each message returns a delivery report you can read through the API or the dashboard.',
      },
    ],
    sections: [
      {
        title: 'Typical transactional alerts',
        p: 'A transactional alert tells a customer that something just happened to their order, money or booking. Common examples are order confirmation, dispatch and out-for-delivery messages, payment received or failed notices, booking and ticket confirmations, balance and debit alerts, and account-change confirmations. The customer expects them, often within seconds, and relies on them as a record.',
      },
      {
        title: 'Triggering alerts from your system',
        p: 'The best alerts are event-driven: your order, payment or booking system emits an event and a small worker calls the SMS API with the template and its variables. Include your own reference in every request and use it as an idempotency key, so a retry after a timeout never sends the same alert twice. Store the message ID that comes back and attach the delivery report when it arrives, so support can answer “did the customer get it?” without guesswork. Keep variables short so the message stays within one segment.',
      },
      {
        title: 'Keeping alerts genuinely transactional',
        p: 'An alert loses its category the moment it starts selling. A shipping notice that ends with a discount code is promotional in the eyes of the operator, and it risks rejection or filtering. Register one template for each alert type, keep offers out of them, and send marketing as a separate promotional message to customers who have opted in. Our guide to [promotional and transactional SMS](/resources/promotional-vs-transactional-sms) shows how to classify the borderline cases.',
      },
      {
        title: 'Handling failures and retries',
        p: 'Not every message is delivered the first time. Read the delivery report, retry only the failures that are worth retrying, and stop after a sensible limit. A payment alert that arrives hours late can confuse more than it helps, so give time-sensitive alerts an expiry. For critical messages, fall back to another channel, such as a WhatsApp message or a voice call, and record which channel finally reached the customer.',
      },
      {
        title: 'Coping with volume spikes',
        p: 'Alert traffic rises sharply on sale days, salary dates and month-end. Keep alerts on their own lane so a large promotional send never queues ahead of them, queue and throttle on your side if a burst exceeds your agreed throughput, and watch queue depth and delivery times during peaks. The [delivery reports guide](/resources/bulk-sms-delivery-reports-explained) explains how to read what the network tells you back.',
      },
    ],
  },
  'promotional-campaigns': {
    intro: 'Promotional SMS works when it reaches people who agreed to hear from you, at a sensible time, with an offer worth reading. Compliance here is about consent and timing as much as templates.',
    points: [
      'Consent recorded and checked before any promotional send',
      'Registered promotional templates and sender IDs',
      'Lists uploaded by CSV or pushed through the API',
      'Scheduling and a delivery report for every send',
    ],
    steps: [
      {
        title: 'Collect consent',
        desc: 'Capture and store opt-in for each number you plan to message.',
      },
      {
        title: 'Prepare the campaign',
        desc: 'Pick the registered template, upload the list and schedule the send.',
      },
      {
        title: 'Review results',
        desc: 'Read the delivery report and clean the list for next time.',
      },
    ],
    faqs: [
      {
        q: 'Do I need consent to send promotions?',
        a: 'Yes. Promotional messages should only go to numbers that have opted in. See the compliance centre for how consent is handled.',
      },
      {
        q: 'Can I send promotions at any time?',
        a: 'No. There are rules on the hours promotional messages may be sent. We will confirm the current rules during onboarding.',
      },
    ],
    sections: [
      {
        title: 'Before you send a single message',
        p: 'Promotional SMS in India has the most rules of any message type. You need a registered promotional sender ID and template, a record of each recipient’s consent or a check that the number has no do-not-disturb preference, and a send time inside the permitted hours. Setting these up first is faster than fixing them after a rejected campaign. The [DLT registration guide](/resources/trai-dlt-registration-process) walks through the order of steps.',
      },
      {
        title: 'Building a list you can safely use',
        p: 'A good list is built from people who asked to hear from you: opt-in at checkout, a sign-up form, an in-store form or a reply to an earlier message. Store the date and source of each opt-in. Remove numbers that opt out straight away, de-duplicate before every send, and clean out numbers that return permanent failures in the delivery reports. Bought lists are a poor investment: they raise complaints, depress delivery rates and put your sender ID at risk.',
      },
      {
        title: 'Writing a message that earns a response',
        p: 'Lead with the offer, name the brand, keep to one segment where you can, and include a clear opt-out instruction. Use a consistent link domain rather than a public shortener, because links are checked closely. Variables let you personalise with a name or an amount, but each variable has length limits, so test the longest realistic values. Our guide to [SMS segments](/resources/sms-segments-explained) explains why one extra character can double the cost.',
      },
      {
        title: 'Scheduling and batching',
        p: 'Schedule sends inside the permitted hours and at times your customers actually read messages. For a large list, send a small test batch first, check delivery and replies, then release the rest in stages. This protects your sender reputation and spreads the load so any problem shows up early.',
      },
      {
        title: 'Measuring the result',
        p: 'Compare submitted, delivered and failed counts, then look at link clicks if you track them, opt-outs and conversions. A high failure share points to list quality. A high opt-out share points to relevance or frequency. Use each campaign to clean and refine the list for the next one.',
      },
    ],
  },
  reminders: {
    intro: 'Reminders reduce missed appointments, late payments and lapsed renewals. They are scheduled in advance from data you already hold, so they suit automation well.',
    points: [
      'Scheduled sends driven by dates in your system',
      'Templates for appointments, payments, renewals and deadlines',
      'Optional voice or WhatsApp follow-up for people who do not respond',
      'Delivery reports to see who still needs a call',
    ],
    steps: [
      {
        title: 'Choose the trigger',
        desc: 'Decide how long before the date the reminder should go.',
      },
      {
        title: 'Register the template',
        desc: 'The reminder wording is registered with the date and time as variables.',
      },
      {
        title: 'Schedule by API',
        desc: 'Your system schedules each reminder and reads the result afterwards.',
      },
    ],
    faqs: [
      {
        q: 'Can I add a voice call for missed reminders?',
        a: 'Yes. Voice and IVR can follow up on numbers that did not confirm. Ask us about the setup.',
      },
      {
        q: 'Can reminders be in Hindi or Marathi?',
        a: 'Yes, where the template is registered in that language. Tell us the languages you need.',
      },
    ],
    sections: [
      {
        title: 'Where reminders work best',
        p: 'Reminders turn a date into an action: an appointment to attend, an EMI or bill to pay, a policy or subscription to renew, a class to join, a delivery slot to be home for. Because they relate to something the customer already agreed to, they are usually service messages, which keeps them clear of promotional rules when the content stays informational.',
      },
      {
        title: 'Getting the timing right',
        p: 'Send early enough to act and late enough to remember. A common pattern is one message a day or two ahead and a short one a few hours before. Send in daytime hours in the customer’s time zone, avoid stacking several reminders in a row, and stop the sequence as soon as the action is complete. A reminder that arrives after the customer has already paid or confirmed erodes trust quickly.',
      },
      {
        title: 'Making the reminder actionable',
        p: 'Say what, when and where in the first line, then give one simple next step: a reply keyword, a short link or a phone number. For appointments, make rescheduling as easy as confirming. For payments, include the amount and due date and a direct way to pay. Keep wording factual and polite, and keep sales content out of it.',
      },
      {
        title: 'Using more than one channel',
        p: 'SMS reaches almost every phone, WhatsApp supports richer two-way replies where the customer has opted in, and a voice call can reach people who rarely read messages. A sensible sequence is SMS first, then WhatsApp or a call if there is no response. Treat consent per channel and keep a record of which channel the customer prefers.',
      },
      {
        title: 'Keeping the data clean',
        p: 'Reminders are only as good as the phone numbers behind them. Confirm the number at booking, update it when customers tell you it changed, suppress cancelled items, and honour opt-outs immediately. Review delivery reports to find numbers that repeatedly fail, and correct them at the source. The guide to [DLT templates](/resources/dlt-template-basics) explains how to register reminder templates so they are approved the first time.',
      },
    ],
  },
};
