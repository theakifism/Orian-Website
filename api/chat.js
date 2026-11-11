import { createGroqCompletion, readGroqStream } from './_lib/groq.js';
import { getClientIp } from './_lib/ip.js';
import { supabase } from './_lib/supabase.js';
import { findBlock } from './_lib/blocklist.js';

// Per-IP throttling protects the metered AI endpoint without making a CAPTCHA
// challenge a prerequisite for normal chat use.
const MAX_ATTEMPTS_PER_IP = 30;
const WINDOW_SECONDS = 10 * 60;
const localAttemptsByIp = new Map();

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
- DLT assistance and compliance: in India every business sender must register on the DLT platform. Orian's compliance team files the entity, sender ID (header) and message templates for you. Entity registration usually clears in 2 to 3 business days, template approvals follow in 24 to 48 hours once submitted correctly. Entity registration is one-time, but every new template needs its own approval.
- Voice SMS and IVR: automated voice calls and broadcasts, interactive voice response, with scheduling and auto-retry on no-answer.
- WhatsApp Business API: verified green tick, chatbots, broadcast messages and webhooks, with hand-off to a live agent. Orian handles the Meta paperwork, but the review time is set by Meta and varies.
- Also available: social media handling and IT solutions (cloud hosting, networks, security, helpdesk).

Reported service metrics: the website shows 99.95% platform uptime and 99.95% message delivery rate. Describe these as reported metrics, not a contractual SLA; account-specific commitments are defined in the applicable service agreement.

Getting started: a sandbox API key can be issued within minutes of sign-up, and most new clients reach their first live send in under 48 hours because the DLT filing starts the same day the documents arrive. Sandbox access can be requested on the Developers page. A named onboarding engineer helps with the first campaign.

Support: the support desk is available 24/7 by phone, email and WhatsApp.
Contact: phone +91 95525 56786, sales email orianteleservices@gmail.com, support email support@orian.in, or the Contact page on the website.

Sectors served include banking, corporates, data centers, education, healthcare, hotels and hospitality, IT services, manufacturing, media and entertainment, real estate, retail, telecom and more.

LIMITS
- Only state facts listed above. If you're asked about things you don't have, like exact pricing, specific contract terms, account details or a guarantee, be honest about it in a natural way (for example, "pricing depends on your volume, so the team will quote you properly") and offer the phone number or the Contact form.
- Never invent numbers, client names, or promises.
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

    // Only the last few turns are sent: every extra turn is more tokens the
    // model has to read before it can start writing a reply, and for a
    // chat-widget FAQ assistant the recent turns carry almost all the
    // useful context anyway.
    const MAX_HISTORY_TURNS = 8;
    const MAX_HISTORY_MESSAGE_LENGTH = 1000;

    // Convert the conversation into OpenAI-compatible chat messages.
    const contents = history
      .filter((m) => m && typeof m.text === 'string' && m.text.length <= MAX_HISTORY_MESSAGE_LENGTH)
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
