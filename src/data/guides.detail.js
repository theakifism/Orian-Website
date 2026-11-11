// Heavy detail fields for guides entries, split out of guides.js so that only the detail pages
// (which are lazy route chunks) download them. List pages, the home page and the nav use the light
// entries in guides.js. Detail pages merge: { ...entry, ...guideDetail[entry.slug] }.
// Keys moved here: body.
// TODO(content)/TODO(review) notes for this content live at the top of guides.js.
export const guideDetail = {
  'sms-segments-explained': {
    body: [
      {
        p: 'A single SMS holds a limited number of characters. When a message is longer, it is split into segments and each segment is delivered and counted separately. That matters because most providers bill per segment, so a message that quietly grows from one segment to two doubles its cost, and the recipient may see it arrive in pieces on some phones.',
      },
      { h: 'The limits' },
      {
        ul: [
          'GSM-7 text (basic Latin letters, digits and common symbols): 160 characters in one segment, 153 per segment once a message is split',
          'Unicode text (for example Hindi, Marathi, or most emoji): 70 characters in one segment, 67 per segment once split',
        ],
      },
      {
        p: 'The smaller figure for split messages exists because each segment of a longer message carries a small header, which tells the phone how to reassemble the parts. That header uses part of the space, so a long message holds slightly fewer characters per segment than a short one.',
      },
      { h: 'Worked examples' },
      {
        ul: [
          'A 150-character English message fits in one GSM-7 segment',
          'A 161-character English message becomes two segments: 153 characters in the first and 8 in the second',
          'A 70-character Hindi message fits in one Unicode segment, while a 71-character one becomes two (67 plus 4)',
          'A 300-character English message needs two segments, because 2 × 153 = 306',
          'The same 300 characters in Hindi need five segments, because 4 × 67 = 268 is not enough',
        ],
      },
      { h: 'What pushes a message into Unicode' },
      {
        p: 'One character outside the GSM-7 set is enough to switch the whole message to Unicode, which cuts the single-segment limit from 160 to 70. A curly quote pasted from a word processor is a common culprit, as are the long dash, the ellipsis character and non-breaking spaces copied from a web page. The message looks identical to a human but is encoded differently, and the cost can double without anyone noticing.',
      },
      { h: 'Characters that count double' },
      {
        p: 'A few GSM-7 characters, such as the square brackets, curly braces, the caret, the backslash, the vertical bar, the tilde and the euro sign, take two character positions. A message full of these reaches the limit sooner than its visible length suggests.',
      },
      { h: 'Emoji and symbols' },
      {
        p: 'Emoji are Unicode, so they force the whole message into the 70-character limit, and many take two positions each. They are also often rejected in registered templates. Unless a template is specifically approved with them, plan to leave them out of transactional and OTP messages.',
      },
      { h: 'Variables and worst-case length' },
      {
        p: 'In a registered template, the fixed text is known but the variables are not. A name, an amount or a link can be short in your test and long in real life. Work out the worst-case length by filling every variable with its longest realistic value, then check that the total still fits. A long customer name or a long tracking link is the usual reason a message that passed testing spills into a second segment in production.',
      },
      { h: 'Regional-language messages' },
      {
        p: 'Hindi, Marathi, Tamil and other Indian-language scripts need Unicode, so each segment holds fewer characters. That is not a reason to avoid them, because customers often respond better to their own language, but it does mean keeping the text tight. Write the shortest natural sentence, avoid decorative punctuation and register the template in that language rather than relying on a translation of an English one.',
      },
      { h: 'Why counts can differ between phones and providers' },
      {
        p: 'The segment count is decided when the message is sent, by the platform that encodes it, not by the phone that displays it. Most modern phones stitch the parts of a long message back together so it reads as one, which hides the fact that it was billed as several. Different platforms also detect Unicode in the same way, so a count from one tool should match your provider’s count if the text is identical, but only if hidden characters are identical too. Always check the count in the same tool you send from.',
      },
      { h: 'Planning cost with segments' },
      {
        p: 'Budget by segments, not by messages. If you send 100,000 messages a month and 20,000 of them are two segments long, you are paying for 120,000 segments, a fifth more than the headline number. Review a sample of real, fully populated messages each month, find the ones that run over, and shorten the template or the variables that cause it. A one-time fix often removes a permanent cost.',
      },
      { h: 'How to stay in one segment' },
      {
        ul: [
          'Write the shortest message that still carries the information',
          'Use straight quotes and plain punctuation',
          'Keep variables short, because a long name or link can add a segment',
          'Retype pasted text instead of pasting it, to strip hidden characters',
          'Test the final text in the demo on our home page before registering the template',
        ],
      },
      { h: 'Checking before you register' },
      {
        p: 'Count the characters of the final template with its longest variable values, check that it contains only GSM-7 characters if it is meant to be a single segment, and keep the final text next to the template ID in your records. Our guide to [DLT templates](/resources/dlt-template-basics) explains what to register, and the [delivery reports guide](/resources/bulk-sms-delivery-reports-explained) shows how to confirm what was actually sent and billed.',
      },
    ],
  },
  'dlt-template-basics': {
    body: [
      {
        p: 'In India, every commercial SMS is sent against a template registered on the DLT platform. The template fixes the wording; variables mark the parts that change from message to message. If the text you send does not match an approved template, the message can be blocked, however correct the rest of your setup is.',
      },
      { h: 'Why templates exist' },
      {
        p: 'TRAI introduced the DLT system so that operators can verify who is sending a message and what it says before it reaches a customer. Registering a template gives the operator a record to compare each message against. This is how unregistered or altered messages, including many scam texts, are filtered out. For a legitimate business it means the approved wording is part of your delivery infrastructure, not a formality.',
      },
      { h: 'Parts of a template' },
      {
        ul: [
          'Fixed text, which must match exactly what is sent',
          'Variables for the changing parts, such as a code, a name or an amount',
          'A category: OTP or transactional, service, or promotional',
          'A sender ID (header) it is linked to',
          'A template ID, issued on approval, which your messages must reference',
        ],
      },
      { h: 'Writing a template step by step' },
      {
        ul: [
          'List the exact message you want to send, with a real example',
          'Replace each changing part with the variable placeholder, and leave everything else fixed',
          'Choose the category by the purpose of the message, not by what is convenient',
          'Remove anything promotional from a transactional message',
          'Check the length with the longest realistic variable values',
          'Submit one template per message type',
        ],
      },
      { h: 'Examples by category' },
      {
        p: 'These are illustrative formats only. Register your own wording and keep it consistent with your brand.',
      },
      {
        ul: [
          'Transactional (OTP): “{#var#} is your OTP for {#var#}. It expires in {#var#} minutes. Do not share it with anyone.”',
          'Service (reminder): “Reminder: your appointment is on {#var#} at {#var#}. Call {#var#} to reschedule.”',
          'Promotional: “{#var#}, enjoy {#var#} off this weekend at {#var#}. Reply STOP to opt out.”',
        ],
      },
      { h: 'How matching works when you send' },
      {
        p: 'When you send through an API, the request carries the template ID and the values for each variable. The platform assembles the final text and the operator checks it against the registered template. If you edit the wording in your code without updating the template, or add a space or punctuation mark that is not in the registered text, the check can fail. Treat the registered text as the single source of truth and generate messages from it.',
      },
      { h: 'Common reasons for rejection' },
      {
        ul: [
          'Promotional wording in a transactional template',
          'Variables that are too open-ended, so the message could say anything',
          'A link or phone number that is not allowed for that category',
          'A sender ID that is not linked to your entity',
          'Wording that closely imitates a bank, government body or well-known brand',
        ],
      },
      { h: 'If a template is rejected' },
      {
        p: 'Read the reason, change only what it points to, and re-submit. Resubmitting the same text unchanged wastes days. If the reason is unclear, ask your compliance contact before trying again, and look for the same issue in your other templates, because the same wording often appears in several.',
      },
      { h: 'Links and phone numbers' },
      {
        p: 'Links in messages are checked more closely than the rest of the text. Use a consistent domain that belongs to you rather than a public shortener, keep the link in a template of a category that allows it, and confirm the current rules for link registration before filing. Phone numbers follow similar caution.',
      },
      { h: 'Working as a team' },
      {
        p: 'Templates become a shared asset once several people send messages. Keep a single register listing each template ID, its exact text, category, owner and the systems that use it. Require that any change to wording goes through the owner and is filed on DLT before it is deployed. Without this, developers edit strings in code and marketing teams ask for “small tweaks”, and messages quietly stop matching their templates.',
      },
      { h: 'Planning seasonal and campaign templates' },
      {
        p: 'Promotional templates for festivals, sales and launches should be filed well before the campaign date. Prepare the copy, the variable list and the opt-out wording in advance, and reuse a well-approved structure where you can, changing only the variable values. A tested structure is more likely to be approved the first time than a new layout written in a hurry.',
      },
      { h: 'Good habits' },
      {
        ul: [
          'Register one template per message type, not one general template',
          'Keep promotional and transactional wording separate',
          'Keep a copy of every approved template next to the code that sends it',
          'Give each template an owner on your team, and review the list every quarter',
          'Plan new campaigns early, because new templates take time to approve',
        ],
      },
      {
        p: 'Requirements change over time, so confirm current rules with your compliance contact before filing. For the full registration order, see our [DLT registration process guide](/resources/trai-dlt-registration-process), and for naming rules see [how sender IDs are approved](/resources/sender-id-approval-guide). Our [DLT registration service](/services/dlt-compliance) can prepare and file templates for you.',
      },
    ],
  },
  'otp-best-practices': {
    body: [
      {
        p: 'An OTP is only useful if the person receives it and can use it quickly. Most problems come from the message and the flow around it, not the code itself. This guide covers the message, the code, the flow and the security side, with the reasoning behind each habit.',
      },
      { h: 'The message' },
      {
        ul: [
          'Put the code first, so it shows in the notification preview',
          'State the expiry in the message',
          'Add a short do-not-share warning',
          'Name the product, so the user knows what the code is for',
          'Use a registered transactional template, never a promotional one',
          'Keep it to one segment, and leave out links and offers',
        ],
      },
      {
        p: 'A clear example: “482915 is your OTP for Acme. It expires in 10 minutes. Do not share it with anyone.” The code is visible without opening the message, the purpose is clear, and the warning protects the user from the most common scam.',
      },
      { h: 'Designing the code' },
      {
        ul: [
          'Use a cryptographically secure random generator, not a counter or a timestamp',
          'Six digits is common; shorter codes are easier to guess and longer ones are harder to type',
          'Make each code single-use and invalidate it once verified',
          'Expire codes after a few minutes',
          'Store only a hash of the code on your side, and never write the code to logs',
        ],
      },
      { h: 'Resend and fallback flows' },
      {
        ul: [
          'Let people request a resend, with a short wait before it unlocks',
          'Use the delivery report to decide when to offer another channel such as voice',
          'Invalidate the earlier code when a new one is issued, or accept only the latest',
          'Show clear, calm messages when a code expires instead of a generic error',
        ],
      },
      {
        p: 'The delivery report is the signal that makes this work. If it says delivered, the user probably has the code and a resend only adds confusion. If it says failed or never arrives, offer a voice call. Our guide to [delivery reports](/resources/bulk-sms-delivery-reports-explained) explains each status.',
      },
      { h: 'Preventing abuse' },
      {
        p: 'An open OTP endpoint can be used to send large numbers of messages to numbers the attacker chooses, which costs you money and annoys real people. Defend it in layers.',
      },
      {
        ul: [
          'Limit attempts and resends per number to stop abuse',
          'Rate-limit by IP address, device and account as well as by number',
          'Add a challenge, such as a CAPTCHA, before sending to a new number',
          'Watch the ratio of codes requested to codes verified, and alert when it drops',
          'Cap spend per day and alert on unusual destinations',
        ],
      },
      { h: 'Autofill and usability' },
      {
        p: 'Both Android and iOS can offer to fill a code from an incoming message when the message follows the platform’s guidelines, which removes typing and reduces errors. Check the current platform documentation for the exact format, and keep the code and the product name in a predictable place in the text. Allow users to paste a code, and accept codes with a space or hyphen in them.',
      },
      { h: 'Security limits of SMS OTP' },
      {
        p: 'SMS is convenient but not the strongest second factor. Messages can be intercepted in some situations, and attackers can take over a number through a SIM swap. For high-risk actions such as large transfers or changing recovery details, offer a stronger option such as an authenticator app or a hardware key, and treat the SMS code as one signal among several rather than as proof by itself. None of this depends on a particular provider. It is good practice for any OTP flow.',
      },
      { h: 'Voice as a fallback' },
      {
        p: 'A spoken OTP helps when an SMS does not arrive, when the user is on a landline-like connection, or when text is hard for them to read. Offer it after a short wait rather than immediately, read the digits slowly with a pause between them, and repeat the code once. Treat the voice code with the same expiry, attempt limits and rate limits as the SMS code, since the call can be abused in the same way. Our [voice API and IVR service](/services/voice-sms-ivr) covers how this is set up.',
      },
      { h: 'Language and localisation' },
      {
        p: 'Users are more comfortable verifying in their own language, but remember that regional-language text uses Unicode and fits fewer characters per segment. Register a separate template for each language, keep the code and expiry in the same position in each, and test the final text on real phones. Our [SMS segments guide](/resources/sms-segments-explained) explains the limits.',
      },
      { h: 'A launch checklist' },
      {
        ul: [
          'Template approved on DLT and tested on handsets from at least two operators',
          'Codes are random, single-use and expire within minutes',
          'Resend delay, attempt limits and rate limits are switched on',
          'Delivery reports are stored against each request',
          'A fallback channel is ready for messages that are not confirmed',
          'An alert fires when the verification rate drops',
        ],
      },
      { h: 'Testing and monitoring' },
      {
        p: 'Test with real handsets on more than one operator before launch, including a phone in a poor coverage area, and measure the time from request to receipt. In production, track delivery time, failures by operator and verification success rate. Our [bulk SMS and OTP gateway](/services/bulk-sms-otp-gateways) page explains the delivery side, and the [promotional versus transactional guide](/resources/promotional-vs-transactional-sms) covers why OTPs must never share a template category with offers.',
      },
    ],
  },
  'trai-dlt-registration-process': {
    body: [
      {
        p: 'If you send commercial SMS in India, your messages travel through a system called DLT, short for Distributed Ledger Technology. TRAI, the telecom regulator, required every telecom operator to run a DLT platform where businesses register who they are, which sender names they use and exactly what their messages say. A message that does not match those records can be blocked before it reaches the handset.',
      },
      {
        p: 'This guide walks through the registration in the order you will do it, explains what each step is for, and points out where applications usually stall. It is a general overview. Portals and requirements change, so confirm the current process with your operator portal or with our [DLT registration service](/services/dlt-compliance) before you file.',
      },
      { h: 'What DLT registration actually covers' },
      {
        p: 'DLT registration is not one form. It is a chain of linked records, and each one depends on the one before it.',
      },
      {
        ul: [
          'Your business, called the principal entity, with verified documents',
          'The sender IDs (also called headers) your messages will show',
          'The message templates, which fix the wording of each message type',
          'Consent templates and records, for promotional messaging',
          'The link between your entity and the platform or aggregator that actually delivers your messages',
        ],
      },
      { h: 'Step 1: Register the principal entity' },
      {
        p: 'The principal entity is the business that owns the messages. You register it on an operator’s DLT portal and submit business details and supporting documents. Typical documents include a business registration or incorporation proof, a tax registration number, proof of address and an authorisation letter or ID for the person signing on behalf of the company. Individual operators may ask for slightly different proofs, so keep scanned copies ready and make sure the name on each document matches exactly.',
      },
      {
        p: 'Most delays at this stage come from small mismatches: a trading name that differs from the registered name, an expired authorisation letter, or a signatory whose ID does not match the letter. Check every name and number against the source documents before submitting.',
      },
      { h: 'Step 2: Register your sender IDs' },
      {
        p: 'A sender ID, or header, is the short name that appears as the sender of your SMS. You register each one against your entity and choose its type, such as transactional, service or promotional. Choose a name that clearly relates to your brand, because reviewers compare it with your entity details. Our guide to [how sender IDs are approved](/resources/sender-id-approval-guide) covers naming rules and common rejections in more detail.',
      },
      { h: 'Step 3: Register message templates' },
      {
        p: 'A template is the approved wording of a message, with variables marking the parts that change, such as a code, a name or an amount. You register one template per message type and choose its category. Once approved, each template gets an ID, and your messages must quote that ID and match the template text. Our guide to [DLT templates and common rejections](/resources/dlt-template-basics) explains how to write templates that pass review.',
      },
      {
        ul: [
          'Use the variable placeholder for anything that changes, and keep fixed text exactly as you will send it',
          'Pick the category that matches the purpose: OTP and transactional, service, or promotional',
          'Do not put offers or promotional wording in a transactional template',
          'Register separate templates for separate messages instead of one catch-all',
        ],
      },
      { h: 'Step 4: Set up consent for promotional messages' },
      {
        p: 'Promotional messaging depends on recorded consent and on respecting customers’ do-not-disturb preferences. The DLT platform holds consent templates and records, and promotional sends are checked against them. If you plan to send offers, set up consent capture early. It is harder to do it after your list has grown. Our [promotional versus transactional guide](/resources/promotional-vs-transactional-sms) explains how the two categories differ in practice.',
      },
      { h: 'Step 5: Link your entity to your delivery platform' },
      {
        p: 'Messages pass from your system through a platform or aggregator to the operators. DLT records that chain, so your entity needs to be linked to the party that actually sends on your behalf. Without this link, otherwise valid messages can fail the scrubbing check. When you work with Orian, our compliance team guides this step as part of onboarding, and you can then send through the [bulk SMS and OTP gateway](/services/bulk-sms-otp-gateways).',
      },
      { h: 'Step 6: Test before you launch' },
      {
        p: 'Send a handful of test messages for each template to your own numbers across the main operators. Check that the sender name, the wording and the delivery report all look right. Fix mismatches now, before a live campaign exposes them to customers.',
      },
      { h: 'Why applications stall' },
      {
        ul: [
          'Document names that do not match the registered business name',
          'Sender IDs that look unrelated to the entity or imitate a well-known brand',
          'Templates with promotional wording in a transactional category',
          'Variables so open-ended that a message could say anything',
          'Links or phone numbers that are not allowed for the category',
          'Messages sent that differ even slightly from the approved template text',
        ],
      },
      { h: 'How long does it take?' },
      {
        p: 'Timelines depend on the operator, the quality of your documents and how many rejections you hit. Clean applications can move quickly, while one mismatch can add days. Plan for registration before your launch date, not alongside it, and keep a copy of every approved record next to the code that sends it.',
      },
      { h: 'Keeping registration healthy' },
      {
        p: 'Registration is not a one-time job. When you add a new message type, you register a new template. When you add a brand or product line, you may need a new sender ID. When rules change, existing templates and links to URLs may need to be reviewed. Keep one person responsible for the DLT account, and keep the login details in a shared password manager rather than in one person’s email.',
      },
      {
        p: 'The compliance centre on our site has an onboarding checklist, and the [DLT compliance service](/services/dlt-compliance) page explains what we handle for you. If you are unsure which step you are stuck on, [talk to our team](/contact) and we will help you work it out.',
      },
    ],
  },
  'promotional-vs-transactional-sms': {
    body: [
      {
        p: 'Every commercial SMS in India belongs to a category, and the category decides almost everything else: which template you register, what consent you need, when the message can be sent and which route carries it. Getting the category wrong is one of the most common reasons for rejected templates and blocked messages.',
      },
      {
        p: 'This guide explains how the categories differ, gives examples of each, and shows how to classify the awkward messages that sit in between. Rules change over time, so confirm the current requirements before filing templates.',
      },
      { h: 'The short version' },
      {
        ul: [
          'Transactional messages are triggered by something the customer just did, such as a payment, an order or a sign-in, and are expected immediately',
          'Service messages carry information related to an existing relationship, such as an appointment reminder or a bill notice',
          'Promotional messages try to sell or advertise: offers, launches, discounts and invitations',
        ],
      },
      { h: 'Transactional messages' },
      {
        p: 'A transactional message exists because of an action. A one-time password, a payment confirmation, a booking confirmation and a delivery notification are all transactional. They are expected, time-sensitive and tied to an event in your system. Because of that, they are carried on a priority lane and are not subject to the consent and timing limits that apply to promotions. They are also tightly limited in content: no offers, no cross-selling.',
      },
      {
        p: 'The best test is whether the customer would be surprised not to receive the message. If a customer pays a bill and gets no confirmation, they will wonder what went wrong. That is transactional.',
      },
      { h: 'Service messages' },
      {
        p: 'Service messages sit between the two. They relate to a customer you already serve, such as a reminder that an appointment is tomorrow, a notice that a statement is ready, or an alert that a policy is due for renewal. They are not advertising, but they are not triggered by a single action either. Depending on how the customer’s agreement was captured, a service message can rely on implied or on explicit consent, and the template category should reflect which one applies. Confirm the right choice with your compliance contact.',
      },
      { h: 'Promotional messages' },
      {
        p: 'A promotional message aims to persuade. Discounts, sale announcements, new product launches and event invitations are promotional, even when they are friendly or personalised. Promotions should only go to numbers that have given consent or that have not registered a do-not-disturb preference, and there are limits on the hours in which they may be sent. Each promotional template and sender ID is registered for that purpose, and every message includes a clear way to opt out.',
      },
      { h: 'Examples side by side' },
      {
        ul: [
          'Transactional: “482915 is your verification code. It expires in 10 minutes.”',
          'Transactional: “Your order #10482 has shipped.”',
          'Service: “Reminder: your appointment is tomorrow at 10:30.”',
          'Promotional: “Weekend offer: members get early access to the new range.”',
        ],
      },
      { h: 'The mixed-message trap' },
      {
        p: 'Problems arise when a message tries to be both. An order confirmation that ends with “Use code SAVE10 on your next order” is no longer purely transactional, because it now advertises. Operators and the DLT review treat the whole message by its most promotional element, so the template may be rejected, or the message may be filtered. The fix is simple: keep the transactional message clean, and send the offer as a separate promotional message to customers who have opted in.',
      },
      { h: 'How delivery differs' },
      {
        p: 'Transactional and service traffic normally uses a dedicated lane with priority handling, because delays hurt directly. A late OTP means a failed sign-in. Promotional traffic runs on a separate lane that is better suited to large volumes and scheduling. Keeping them apart means a big campaign never queues ahead of a code. This is one reason to run both from one account but as separate message types. See how this works on the [bulk SMS and OTP gateway](/services/bulk-sms-otp-gateways) page.',
      },
      { h: 'Consent and timing' },
      {
        ul: [
          'Promotional: record consent with the date and the source, honour do-not-disturb preferences and send only within the permitted hours',
          'Transactional: no promotional consent is needed, but the message must really be triggered by the customer’s action',
          'Service: record how the customer agreed to receive notices, and offer an easy way to stop them where it applies',
        ],
      },
      { h: 'Sender IDs and templates by category' },
      {
        p: 'Sender IDs and templates are registered by category, and a template approved for one category should not be used for another. A transactional template cannot carry a promotional offer, and a promotional template should not be used to send an OTP. If you are filing templates, our guides to [DLT templates](/resources/dlt-template-basics) and [sender ID approval](/resources/sender-id-approval-guide) explain what to prepare.',
      },
      { h: 'A simple way to classify a message' },
      {
        ul: [
          'Was it triggered by the customer’s own action just now? Probably transactional',
          'Is it information about an existing relationship, with no sales content? Probably service',
          'Does it try to sell, announce or invite? It is promotional',
          'Does it do two of these at once? Split it into two messages',
        ],
      },
      { h: 'What to do next' },
      {
        p: 'List every message your business sends, assign each one a category using the questions above, and register one template per message. If a message fits two categories, split it. If you are not sure how a message should be classified, our [DLT registration team](/services/dlt-compliance) can review it with you before you file, which is much faster than waiting for a rejection.',
      },
    ],
  },
  'smpp-vs-rest-api': {
    body: [
      {
        p: 'When you connect an application to an SMS gateway, there are usually two ways to do it: a REST API over HTTPS, or an SMPP connection. Both deliver messages. They differ in how you connect, how much work your team takes on, and how far they scale. This guide explains the differences in plain terms so you can choose.',
      },
      { h: 'What a REST API is' },
      {
        p: 'A REST API lets your application send a message by making an HTTPS request with a small JSON body: the recipient, the sender ID, the template and the variables. The gateway responds with an identifier, and later sends the delivery report to a webhook URL you provide. Each request stands alone. There is no connection to maintain, and almost every programming language can do it with an ordinary HTTP library.',
      },
      {
        ul: [
          'Easy to start: a few lines of code and an API key',
          'Works well from web and mobile back ends and serverless functions',
          'Stateless, so it scales by adding more application instances',
          'Webhooks deliver status to your system as events happen',
        ],
      },
      { h: 'What SMPP is' },
      {
        p: 'SMPP stands for Short Message Peer-to-Peer. It is a protocol that telecom operators and messaging platforms have used for many years to exchange messages. Instead of one request per message, your system opens a persistent connection, called a bind, to the gateway and sends messages over it continuously. The gateway sends delivery reports back over the same connection.',
      },
      {
        p: 'A bind can be a transmitter, which only sends, a receiver, which only receives reports, or a transceiver, which does both. Messages are sent using a submit operation, and delivery reports return as a deliver operation containing a status such as delivered, expired or undeliverable. Connections are kept alive with regular enquiry messages, and a window setting controls how many messages can be in flight without a response.',
      },
      {
        ul: [
          'High sustained throughput over a small number of long-lived connections',
          'Efficient for very large or continuous volumes',
          'Familiar to teams that already run SMS infrastructure',
          'More to manage: reconnects, keep-alives, windowing and error handling',
        ],
      },
      { h: 'Throughput' },
      {
        p: 'For most businesses, a REST API is more than fast enough. Sending OTPs and alerts on demand, or running campaigns of a few lakh messages in batches, works comfortably over HTTPS. SMPP becomes attractive when you have very high sustained volumes, such as a platform that relays messages for many customers continuously, because a persistent connection avoids the overhead of one request per message. Measure your actual peak rate before deciding. Do not choose SMPP just because it sounds more serious.',
      },
      { h: 'Complexity and maintenance' },
      {
        p: 'REST is simple to build and simple to debug, because you can reproduce any call with a command-line tool. SMPP is more demanding. Your code has to hold the connection open, notice when it drops, reconnect, respect the window size, handle throttling responses and correlate delivery reports with the messages you sent. Libraries exist, but your team still owns the behaviour. If you do not already have this experience, expect a longer integration.',
      },
      { h: 'Delivery reports' },
      {
        p: 'In both cases you receive a status for each message. With REST, the gateway posts it to your webhook, so you need an endpoint that is reachable, secured and able to handle repeats of the same event. With SMPP, reports arrive on the bind. Either way, store the report against the original message. Our guide to [delivery reports](/resources/bulk-sms-delivery-reports-explained) explains what each status means and how to act on it.',
      },
      { h: 'Reliability and failure handling' },
      {
        ul: [
          'REST: retry failed requests with a back-off, and use your own message reference so a retry never sends the same message twice',
          'SMPP: reconnect automatically, and re-send messages that were never acknowledged',
          'Both: set sensible timeouts, and alert your team when the failure rate rises',
        ],
      },
      { h: 'Security' },
      {
        p: 'With REST, protect the API key as you would any secret, keep it out of client-side code, and use HTTPS. With SMPP, connections are typically restricted by account credentials and by allowed IP addresses, and may be wrapped in TLS. In either case, plan for key rotation and keep a record of who has access.',
      },
      { h: 'Which should you choose?' },
      {
        ul: [
          'Choose REST if you are building a web or mobile product, sending OTPs and alerts, running campaigns in batches, or you want the fastest integration',
          'Choose SMPP if you already operate an SMPP-based system, need very high sustained throughput, or are relaying traffic for many downstream customers',
          'Start with REST if you are unsure. You can add SMPP later if your volumes require it',
        ],
      },
      { h: 'Testing before you go live' },
      {
        p: 'Whichever you choose, test the whole flow in a sandbox before sending to real users: a successful send, a failed send, a delivery report arriving late, and a duplicate event. The [developers page](/developers) has a quick start and sample requests, and our [bulk SMS and OTP gateway](/services/bulk-sms-otp-gateways) page lists what is supported.',
      },
      {
        p: 'If you are running your own servers and want help with hosting, networking and monitoring around the integration, our [managed IT solutions](/services/it-solutions) cover that too. If you want to compare options for your volumes, [talk to our team](/contact).',
      },
    ],
  },
  'sender-id-approval-guide': {
    body: [
      {
        p: 'The sender ID is the short name customers see at the top of your SMS, such as the name of your bank, shop or school. It builds recognition and trust, and it is also one of the first things reviewers check. A weak or mismatched sender ID is a common reason for registration to stall. This guide explains what a sender ID is, how to pick one and how to prepare for approval.',
      },
      { h: 'What is a sender ID?' },
      {
        p: 'In India’s DLT framework, a sender ID is called a header. It is registered against your business, which is the principal entity, and it is tied to a message type such as transactional, service or promotional. Your messages are then sent under that header. When a message arrives, the handset shows a short code made up of the registered header, often with an operator-specific prefix and a suffix that indicates the category.',
      },
      { h: 'Rules for choosing a name' },
      {
        ul: [
          'Keep it short. Headers are limited in length, and six alphabetic characters is the common format',
          'Make it recognisable. It should clearly relate to your brand or business name',
          'Use plain letters. Avoid special characters and unusual spellings',
          'Do not imitate other organisations, banks or government bodies',
          'Do not use a generic word that says nothing about your business, if a closer match is available',
        ],
      },
      {
        p: 'If your brand name is longer than the limit, choose a sensible abbreviation that customers will connect with you, such as the first letters of each word. Whatever you choose, be ready to explain how it relates to the entity name.',
      },
      { h: 'One header or several?' },
      {
        p: 'Many businesses register more than one header: one for security codes and transactions, and another for service notices or promotions. Customers then recognise at a glance whether a message is an urgent code or an offer. Separate headers also keep each category’s templates and reporting clean. The trade-off is more registration work. Decide this before you file, because changing it later means a new approval.',
      },
      { h: 'What to prepare' },
      {
        ul: [
          'Your principal entity registration, completed and approved first',
          'The exact header text you want, and one or two backups in case it is taken',
          'Proof that the name is yours if it is a brand or trademark that differs from your registered name',
          'A short explanation of how the header relates to your business, for the reviewer',
          'The message type the header will be used for',
        ],
      },
      {
        p: 'The header cannot be approved before the entity it belongs to, so complete the steps in order. Our guide to the [DLT registration process](/resources/trai-dlt-registration-process) shows where headers fit in the sequence.',
      },
      { h: 'Common reasons for rejection' },
      {
        ul: [
          'The header does not obviously relate to the registered entity',
          'It resembles a bank, government agency or well-known brand that you do not own',
          'It is already registered by another entity',
          'It uses disallowed characters or the wrong format',
          'It is registered for one message type but used for another',
          'Supporting proof of brand ownership is missing or unclear',
        ],
      },
      { h: 'If your header is rejected' },
      {
        p: 'Read the reason given, fix the specific issue and re-submit rather than filing the same text again. If the problem is the name itself, choose a closer variation of your brand name or provide proof of ownership. If another entity holds the name, use a different abbreviation. Avoid filing many variations in a row without understanding the reason, because that only slows things down.',
      },
      { h: 'After approval' },
      {
        p: 'Once the header is approved, you register message templates under it. Each template is tied to a header and a category, so approval of the header alone does not let you send. Our guide to [DLT templates](/resources/dlt-template-basics) covers the next step. Our [promotional versus transactional guide](/resources/promotional-vs-transactional-sms) helps you decide which category each header should serve.',
      },
      { h: 'Keeping your sender ID healthy' },
      {
        ul: [
          'Use each header only for the message type it was registered for',
          'Keep a record of the approval for audit and for your own team',
          'Review your headers when you launch a new brand or product',
          'Do not share a header with another company, even a related one, unless it is registered for both',
        ],
      },
      { h: 'Examples of strong and weak headers' },
      {
        p: 'A strong header is one a customer would guess. A business called Greenfield Pharmacy might register a short form of Greenfield, because anyone who has dealt with the shop will recognise it. A weak header is one that has no visible link to the entity, such as a random string of letters, or one that borrows the name of a larger brand. If you operate under a brand that differs from your registered company name, say so in your application and have proof of the brand ready.',
      },
      {
        ul: [
          'Strong: a clear short form of the brand name that matches the entity details',
          'Acceptable: an abbreviation of the company name that staff and customers already use',
          'Weak: an unrelated word, a misspelling of a famous brand or a name that implies an official body',
        ],
      },
      { h: 'Plan the timing' },
      {
        p: 'Header approval is only one part of onboarding, and it depends on the entity being approved first. Start the entity registration early, prepare header names and backups while you wait, and file templates as soon as the header is cleared. Doing these in parallel where possible shortens the time before your first live send.',
      },
      { h: 'We can help' },
      {
        p: 'Orian’s compliance team prepares header applications as part of onboarding, checks them against your entity details before submission and tracks the result. See our [DLT registration service](/services/dlt-compliance) for what is included, or [contact us](/contact) to start. Once your header and templates are approved, you can send through the [bulk SMS and OTP gateway](/services/bulk-sms-otp-gateways) in the sandbox first and then live.',
      },
    ],
  },
  'whatsapp-business-api-pricing-explained': {
    body: [
      {
        p: 'WhatsApp pricing confuses many first-time buyers because the cost is made up of several parts, and the structure has changed over time. This guide explains the building blocks so you can read any quote, compare providers fairly and estimate a budget. It deliberately avoids quoting rates: Meta publishes its own rate card, which is revised periodically, so always check the current figures before you decide.',
      },
      { h: 'Who charges what' },
      {
        p: 'There are usually two layers in a WhatsApp Business API bill. The first is the charge from Meta, the company behind WhatsApp, for messages sent over the platform. The second is what your solution provider charges for access, tooling and support. Providers differ here: some pass Meta’s charges through at cost and add a subscription, some add a per-message markup, and some bundle both. Ask for a quote that shows the two layers separately.',
      },
      { h: 'Message categories' },
      {
        p: 'Meta groups business-initiated template messages into categories, and each category is priced differently.',
      },
      {
        ul: [
          'Marketing: promotions, offers, product announcements and re-engagement, usually the highest priced',
          'Utility: messages about an existing order or account, such as order updates, appointment reminders and payment receipts',
          'Authentication: one-time passcodes and verification codes',
          'Service: replies to a customer who has messaged you first, which sit inside the customer service window',
        ],
      },
      {
        p: 'The category is decided by the content and purpose of the template, not by what you call it. If a template contains promotional content, expect it to be treated as marketing even if you submitted it as utility.',
      },
      { h: 'The 24-hour customer service window' },
      {
        p: 'When a customer messages you, a 24-hour window opens. Inside it you can reply with free-form messages, and replies to the customer’s enquiry are generally not charged as business-initiated template messages. Outside the window, you must use an approved template, and the template’s category determines the charge. This is why customer support conversations and outbound campaigns have very different costs, and why designing flows that encourage the customer to reply first can reduce spend.',
      },
      { h: 'What affects the per-message cost' },
      {
        ul: [
          'The message category: marketing, utility or authentication',
          'The country of the recipient, because rates vary by destination',
          'Your volume, where volume tiers may apply to some categories',
          'Whether the message is sent inside an open customer service window',
          'Your provider’s own fees and any markup',
        ],
      },
      { h: 'Costs that are not per message' },
      {
        ul: [
          'Platform or subscription fees from your provider for the dashboard, API access and support',
          'Setup and onboarding, including business verification and template approval help',
          'Chatbot, CRM or workflow integration work',
          'Developer time to build and test message flows',
        ],
      },
      { h: 'How to estimate a monthly budget' },
      {
        p: 'Start from your use cases instead of from a rate card. List each message you plan to send, assign it a category, estimate the monthly volume, and multiply by the current rate for that category and country. Then add your provider’s platform fee. For example, an e-commerce store might have order updates in utility, one-time codes in authentication, and occasional sale announcements in marketing. Separate these three lines in your spreadsheet, because the marketing line will behave very differently from the others.',
      },
      {
        ul: [
          'Count business-initiated template messages separately from replies inside the service window',
          'Add a buffer for failed or repeated sends',
          'Review actual delivered counts monthly and adjust',
        ],
      },
      { h: 'Reducing cost without hurting results' },
      {
        ul: [
          'Use marketing templates sparingly and keep them targeted to people who have opted in',
          'Move transactional updates to utility templates with no promotional content',
          'Encourage customers to reply, so your answers fall inside the service window',
          'Use SMS for broad reach where WhatsApp opt-in is low, and WhatsApp for richer conversations',
          'Clean your lists so you are not paying to message numbers that are not on WhatsApp',
        ],
      },
      { h: 'Opt-in and quality' },
      {
        p: 'WhatsApp requires customers to opt in before you send business-initiated messages, and it monitors quality signals such as blocks and reports. Poor quality can limit how many people you can message. That makes consent and relevance a cost issue as much as a compliance one. Keep a record of each opt-in and its source.',
      },
      { h: 'Questions to ask any provider before you sign' },
      {
        ul: [
          'Are Meta’s charges passed through at cost, and is the markup shown as a separate line?',
          'Is there a monthly platform fee, and what does it include?',
          'How are failed or undelivered messages treated on the invoice?',
          'Who pays when Meta revises its rates, and how much notice do you get?',
          'Is template approval support included, and how many revisions are covered?',
          'What does support cover, and what are its hours?',
          'How easily can you export your contacts and conversation history if you leave?',
        ],
      },
      {
        p: 'Getting these answers in writing makes quotes comparable. Two providers can advertise the same per-message price while differing sharply in platform fees, support and exit terms, so the cheapest headline rate is not always the cheapest arrangement.',
      },
      { h: 'WhatsApp or SMS?' },
      {
        p: 'The two channels complement each other. SMS reaches nearly every phone and suits OTPs and urgent alerts, while WhatsApp suits rich, two-way conversations such as order support and appointment changes. Many businesses use both and fall back to SMS when a message is not delivered on WhatsApp. Our [WhatsApp Business API service](/services/whatsapp-business-api) page explains what we set up, and the [bulk SMS and OTP gateway](/services/bulk-sms-otp-gateways) covers the SMS side. To discuss a budget for your use cases, [talk to our team](/contact).',
      },
    ],
  },
  'bulk-sms-delivery-reports-explained': {
    body: [
      {
        p: 'Sending a message is only half the job. The other half is knowing what happened to it. A delivery report, often shortened to DLR, is the record that tells you whether a message reached the recipient’s handset, failed on the way or is still waiting. This guide explains what the common statuses mean, why reports sometimes disagree with reality, and how to use them in your own systems.',
      },
      { h: 'What a delivery report is' },
      {
        p: 'When you submit a message, the gateway accepts it and passes it on to the operator’s message centre. The operator then tries to deliver it to the handset and, where the network supports it, returns a status. The gateway collects these statuses and gives them to you, either through the dashboard, the API or a webhook. A report is therefore a chain of confirmations, and each link can add a delay or a gap.',
      },
      { h: 'Common statuses' },
      {
        ul: [
          'Submitted or accepted: the gateway has your message, but it has not yet been delivered',
          'Sent: the message has been passed to the operator',
          'Delivered: the operator reports that the handset received the message',
          'Failed or undeliverable: the message could not be delivered, with a reason where available',
          'Expired: the message could not be delivered within its validity period, for example because the phone was off',
          'Rejected: the message was refused, for example because of a template or sender ID mismatch',
          'Unknown: the operator did not return a clear status',
        ],
      },
      {
        p: 'Gateways that use the SMPP protocol receive these as standardised values such as delivered, expired, deleted, undeliverable, accepted, unknown and rejected. A REST API usually presents them in friendlier words, but they map to the same ideas. Our guide to [SMPP versus REST](/resources/smpp-vs-rest-api) explains how reports arrive in each case.',
      },
      { h: 'Why “delivered” is not always final' },
      {
        p: 'A delivered status means the operator’s network reports handing the message to the handset. It does not prove that the person read it. Messages can also be delivered to a phone that is then lost, or to a device where notifications are muted. Treat delivered as strong evidence of delivery, not of attention.',
      },
      { h: 'Why some reports are late or missing' },
      {
        ul: [
          'The handset is off or out of coverage, so the network keeps retrying until the validity period ends',
          'Some networks return statuses slowly or in batches',
          'A small share of messages may end with an unknown status when the network gives no final answer',
          'Reports can arrive out of order, so a late “sent” should never overwrite an earlier “delivered”',
        ],
      },
      { h: 'Common reasons for failure' },
      {
        ul: [
          'The number is invalid, inactive or switched off for a long period',
          'The recipient has registered a do-not-disturb preference and the message is promotional',
          'The template or sender ID does not match what is registered',
          'The message contains a link or content that is not allowed for its category',
          'The route is temporarily congested or the operator is having a problem',
        ],
      },
      {
        p: 'If many failures share a reason, fix the cause rather than resending. Re-sending a message that fails because of a template mismatch will only fail again. Our guides to [DLT templates](/resources/dlt-template-basics) and [promotional versus transactional messages](/resources/promotional-vs-transactional-sms) cover the most common causes.',
      },
      { h: 'Using delivery reports in your system' },
      {
        ul: [
          'Store every report against your own message reference, together with the time it arrived',
          'Never overwrite a final status with an earlier one, and ignore duplicate events',
          'For OTPs, offer a resend after a short wait if no delivered report arrives, and consider a voice call as a fallback',
          'For campaigns, review failures afterwards and remove numbers that are permanently invalid',
          'For support, let agents see the history of what was sent and what happened',
        ],
      },
      { h: 'Handling webhooks safely' },
      {
        p: 'If your gateway sends reports to a webhook, your endpoint should respond quickly, verify that the call really came from the gateway, and process each event in a way that is safe to repeat. Delivery reports may be retried when your endpoint is slow, so the same event can arrive twice. Use the message identifier to detect repeats. Keep the endpoint available during peak sends, since that is when reports arrive in volume.',
      },
      { h: 'Reading campaign results' },
      {
        p: 'After a campaign, compare the number submitted with the number delivered, failed and still pending. A high delivered share suggests clean data and a sound route, while a large unknown or expired share suggests list quality or timing issues. Look at the breakdown by operator and by failure reason rather than only the total. Avoid judging a campaign on the first few minutes, because slower networks report later.',
      },
      { h: 'Billing and reconciliation' },
      {
        p: 'Messages are normally billed by what is submitted and accepted, and long messages count by segment. Reconcile your invoice against your own sent log and the delivery reports, and ask your provider how failed messages are treated. Our guide to [SMS segments](/resources/sms-segments-explained) explains why a single message can count as more than one.',
      },
      {
        p: 'Every SMS receives a delivery report through Orian’s messaging service. Include the message reference when contacting support about a specific issue.',
      },
    ],
  },
};
