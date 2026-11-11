import { createGroqCompletion, readGroqStream } from './_lib/groq.js';
import { getClientIp } from './_lib/ip.js';
import { supabase } from './_lib/supabase.js';
import { findBlock } from './_lib/blocklist.js';

// Per-IP throttling protects the metered AI endpoint without making a CAPTCHA
// challenge a prerequisite for normal chat use.
const MAX_ATTEMPTS_PER_IP = 30;
const WINDOW_SECONDS = 10 * 60;
const localAttemptsByIp = new Map();
const COMPANY_SCOPE_PATTERN = /\b(?:orian(?: teleservices)?|business messaging|bulk\s*sms|business sms|\bsms\b|\botp\b|\bdlt\b|\btrai\b|sender\s*id|header|message\s+template|transactional sms|promotional sms|delivery report|(?:sms|otp|message) delivery|delivery rate|platform uptime|operator route|message routing|throughput|sms api|messaging api|\bsmp\b|webhook|sandbox api|whatsapp business|whatsapp api|voice sms|\bivr\b|social media handling|it solutions|cloud hosting|business network|helpdesk|24/7 support|support desk|contact (?:the )?team|sales team|onboard(?:ing)?|setup time|setup process|first (?:live )?send|our services|your services|your company|about orian|our pricing|your pricing|service pricing|message pricing|phone number|support email)\b/i;
const CODE_SUPPORT_PATTERN = /\b(?:code|coding|programming|debug(?:ging)?|terminal|command line|stack trace|traceback|compiler|compile|npm|node\.?js|python|javascript|typescript|powershell|bash|shell|segmentation fault|package\.json)\b|\b(?:syntaxerror|typeerror|referenceerror|modulenotfounderror|cannot find module|npm err!)\b|\bat\s+[^\s]+\s+\([^\n]*:\d+:\d+\)/i;
const OUT_OF_SCOPE_REPLY = "I can only help with Orian and its services, so I can’t debug general code or terminal errors. For help setting up Orian’s messaging API, see the Developers page or contact support@orian.in.";

function isCompanyQuestion(text) {
  return typeof text === 'string'
    && !CODE_SUPPORT_PATTERN.test(text)
    && COMPANY_SCOPE_PATTERN.test(text);
}

const SYSTEM_INSTRUCTION = `
You are Orian AI, the chat assistant on the Orian Teleservices website. You talk like a friendly, knowledgeable person from the Orian team, not like a brochure or a robot.

HOW TO TALK
- Answer the actual question first, in plain everyday words. No stiff openers like "Certainly!", "Great question!" or "I'd be happy to help". Start differently each time.
- Use contractions (it's, you'll, we're). Sound warm and relaxed, but still professional.
- Keep it short, usually 1 to 4 sentences. Go a bit longer only if the question really needs it.
- Plain text only. No markdown, no asterisks, no bullet lists, no headings. Write it the way you'd text a client.
- Now and then (not every time) end with one natural follow-up question, like what they plan to send or which industry they're in.
- Reply in the language the person writes in. If they write in Hinglish, reply in Hinglish.
- Don't repeat the same sentence or phrase across replies. Don't mention the Contact form unless you truly can't answer, or the person is ready to buy, wants a quote, or needs account help.
- If the question is unrelated to messaging, telecom or Orian, say so lightly and bring the chat back to how you can help.

WHAT YOU KNOW ABOUT ORIAN
Orian Tele Services Private Limited was started by people with 15+ years in the messaging industry, working with OTT, enterprise and aggregator clients. It's a one-stop shop for SMEs and MSMEs for messaging, voice and digital services.

Services:
- Bulk SMS and OTP: transactional and promotional SMS through an API or dashboard. Transactional messages (like OTPs) run on a separate priority lane from promotional ones, so bulk campaigns never slow OTPs down. Every message gets a delivery report, in the API and the dashboard. Orian has direct operator routes with automatic failover if one route is congested. Delivery is quick, with sub-second average delivery on major networks, though actual timing always depends on the operator and the handset.
- DLT assistance and compliance: in India every business sender must register on the DLT platform. Orian's compliance team files the entity, sender ID (header) and message templates for you. Entity registration usually clears in 2 to 3 business days, template approvals follow in 24 to 48 hours once submitted correctly. Entity registration is one-time, but every new template needs its own approval. In telecom messaging, DLT means Distributed Ledger Technology. Do not expand it as "Digital Locker & Telecom" or invent another expansion. This sender, header and content-template process is governed by TRAI's commercial communications regulations. Those timelines are typical estimates, not promises; approvals are handled by the relevant access provider.
- Voice SMS and IVR: automated voice calls and broadcasts, interactive voice response, with scheduling and auto-retry on no-answer.
- WhatsApp Business API: verified green tick, chatbots, broadcast messages and webhooks, with hand-off to a live agent. Orian handles the Meta paperwork, but the review time is set by Meta and varies.
- Also available: social media handling and IT solutions (cloud hosting, networks, security, helpdesk).

Reported service metrics: the website shows 99.95% platform uptime and 99.95% message delivery rate. Describe these as reported metrics, not a contractual SLA; account-specific commitments are defined in the applicable service agreement.

Getting started: a sandbox API key can be issued within minutes of sign-up, and most new clients reach their first live send in under 48 hours because the DLT filing starts the same day the documents arrive. Sandbox access can be requested on the Developers page. A named onboarding engineer helps with the first campaign.

Support: the support desk is available 24/7 by phone, email and WhatsApp.
Contact: phone +91 95525 56786, sales email orianteleservices@gmail.com, support email support@orian.in, or the Contact page on the website.

Sectors served include banking, corporates, data centers, education, healthcare, hotels and hospitality, IT services, manufacturing, media and entertainment, real estate, retail, telecom and more.

LIMITS
- Your scope is only Orian Teleservices, its company information, and its messaging, voice, WhatsApp, compliance and digital services. Do not answer general programming, code, terminal, or unrelated questions, even if the visitor pastes logs or asks politely. For those, use the fixed out-of-scope reply supplied by the server.
- Only state facts listed above. If you're asked about things you don't have, like exact pricing, specific contract terms, account details or a guarantee, be honest about it in a natural way (for example, "pricing depends on your volume, so the team will quote you properly") and offer the phone number or the Contact form.
- Never invent numbers, client names, or promises.
- Do not infer benefits such as "no delays" or guaranteed delivery unless they are explicitly listed above. If a detail is uncertain, say so plainly instead of guessing.
`.trim();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.GROQ_API_KEY) {
    console.error('Groq API Error: GROQ_API_KEY is missing from environment variables.');
    return res.status(500).json({ error: 'The AI assistant is not configured yet.' });
  }

  const clientIp = getClientIp(req);

  // IPs blocked from the admin panel (System -> Blocklist) cannot spend the metered AI quota.
  if (supabase && clientIp && (await findBlock(supabase, { ip: clientIp }))) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  // Chat uses layered per-IP rate limits instead of CAPTCHA, avoiding
  // verification failures before a question reaches the AI.

  // Local backstop works when Supabase is not configured; its shared limit
  // below covers all instances whenever the database is available.
  if (clientIp) {
    const now = Date.now();
    const record = localAttemptsByIp.get(clientIp);
    if (record && record.resetAt > now && record.count >= MAX_ATTEMPTS_PER_IP) {
      return res.status(429).json({ error: 'Too many messages. Please wait a few minutes and try again.' });
    }
    localAttemptsByIp.set(clientIp, record && record.resetAt > now
      ? { count: record.count + 1, resetAt: record.resetAt }
      : { count: 1, resetAt: now + WINDOW_SECONDS * 1000 });
    if (localAttemptsByIp.size > 5000) {
      for (const [ip, item] of localAttemptsByIp) {
        if (item.resetAt <= now) localAttemptsByIp.delete(ip);
      }
    }
  }

  if (supabase && clientIp) {
    try {
      const { data: allowed, error: rateLimitError } = await supabase.rpc('check_rate_limit', {
        p_key: `chat:${clientIp}`,
        p_max: MAX_ATTEMPTS_PER_IP,
        p_window_seconds: WINDOW_SECONDS,
      });
      if (rateLimitError) {
        console.error('Chat rate limit check failed, allowing request:', rateLimitError.message);
      } else if (allowed === false) {
        return res.status(429).json({ error: 'Too many messages. Please wait a few minutes and try again.' });
      }
    } catch (err) {
      console.error('Chat rate limit check threw, allowing request:', err.message);
    }
  }

  try {
    const { message, history = [] } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Missing "message" in request body' });
    }

    const MAX_MESSAGE_LENGTH = 1000;
    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ error: `Message is too long (max ${MAX_MESSAGE_LENGTH} characters)` });
    }

    if (!Array.isArray(history)) {
      return res.status(400).json({ error: '"history" must be an array' });
    }

    // Enforce the assistant's company-only scope before calling Groq. This
    // keeps pasted terminal errors and general programming questions from
    // receiving a general-purpose answer or consuming AI quota.
    if (!isCompanyQuestion(message)) {
      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Content-Type-Options': 'nosniff',
      });
      return res.end(OUT_OF_SCOPE_REPLY);
    }

    // Only the last few turns are sent: every extra turn is more tokens the
    // model has to read before it can start writing a reply, and for a
    // chat-widget FAQ assistant the recent turns carry almost all the
    // useful context anyway.
    const MAX_HISTORY_TURNS = 8;
    const MAX_HISTORY_MESSAGE_LENGTH = 1000;

    // Convert the conversation into OpenAI-compatible chat messages.
    const contents = history
      .filter((m) => m && typeof m.text === 'string' && m.text.length <= MAX_HISTORY_MESSAGE_LENGTH)
      .filter((m) => isCompanyQuestion(m.text))
      .slice(-MAX_HISTORY_TURNS)
      .map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

    while (contents.length > 0 && contents[0].role !== 'user') contents.shift();
    const messages = [
      { role: 'system', content: SYSTEM_INSTRUCTION },
      ...contents,
      { role: 'user', content: message.trim() },
    ];

    const stream = await createGroqCompletion({ messages, stream: true, maxTokens: 500 });

    // The response is a plain streamed text body, not JSON — the client
    // shows it live as it arrives. The 200 header is only sent once the
    // first real text arrives, so if Groq fails before that point the
    // catch block below can still return a proper error instead of an
    // empty reply.
    const sendHeaders = () =>
      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Content-Type-Options': 'nosniff',
      });

    let started = false;
    for await (const piece of readGroqStream(stream)) {
      if (!started) {
        sendHeaders();
        started = true;
      }
      res.write(piece);
    }

    if (!started) {
      sendHeaders();
      res.write("I'm not sure how to answer that — please reach out via our Contact form!");
    }

    return res.end();
  } catch (error) {
    console.error('Groq API Error:', error);

    // If we've already started streaming, headers are locked in — the best
    // we can do is end the stream. Otherwise return a proper error.
    if (res.headersSent) {
      return res.end();
    }
    if ([429, 500, 502, 503, 504].includes(error.status)) {
      return res.status(503).json({ error: "Orian AI is busy right now — please try again in a moment." });
    }
    return res.status(500).json({ error: 'Failed to generate a response. Please try again shortly.' });
  }
}
