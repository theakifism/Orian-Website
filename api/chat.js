import { GoogleGenAI } from '@google/genai';
import { generateContentStreamWithRetry, isGeminiOverloaded } from './_lib/gemini.js';

// Initialize SDK safely by checking process.env
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const SYSTEM_INSTRUCTION = `
You are "Orian AI," the on-site assistant for Orian Teleservices' website.

About Orian Tele Services Private Limited:
- Founded by veterans of the messaging industry with 15+ years handling OTT, Enterprise, and Aggregator clients globally.
- Connected to more than 1,200 operators across 180 countries.
- Provides messaging, voice, and digital media solutions as a one-stop shop for SMEs and MSMEs.

Services offered:
1. Bulk SMS & OTP Gateways — low-latency transactional & promotional SMS routing with high throughput delivery.
2. Voice SMS & IVR Solutions — automated voice broadcasting, OBD, and interactive voice response systems.
3. DLT Assistance & Compliance — complete TRAI DLT template registration, header support, and compliance management.
4. WhatsApp Business API — verified green tick, chatbots, broadcast messaging, and dynamic webhooks.

Sectors served include Banking, Corporates, Data Centers, Educational Institutes, Healthcare, Hotels & Hospitality,
IT Services, Manufacturing, Media & Entertainment, Real Estate, Retail, Telecom, and more.

Guidelines:
- Answer only questions related to Orian's services, industry sectors, or general telecom/messaging topics.
- Keep answers short and conversational (2-4 sentences), suitable for a chat widget.
- If you don't know something specific (pricing, account details, contract terms), say so and point the user to the Contact form.
- Never invent facts about Orian that aren't listed above.
`.trim();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Handle missing API key cleanly before attempting request
  if (!ai) {
    console.error('Gemini API Error: GEMINI_API_KEY is missing from environment variables.');
    return res.status(500).json({ error: 'Server authentication configuration missing.' });
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

    // Trimmed down from 20 -> 8 turns. Every extra turn is more tokens the
    // model has to read before it can start writing a reply, and for a
    // chat-widget FAQ assistant the last few turns carry almost all of the
    // useful context anyway — this cuts a meaningful chunk of latency off
    // every request without hurting answer quality in practice.
    const MAX_HISTORY_TURNS = 8;
    const MAX_HISTORY_MESSAGE_LENGTH = 1000;

    // Convert frontend history to SDK contents format
    const contents = history
      .filter((m) => m && typeof m.text === 'string' && m.text.length <= MAX_HISTORY_MESSAGE_LENGTH)
      .slice(-MAX_HISTORY_TURNS)
      .map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

    // Ensure contents sequence strictly starts with a user turn if history exists
    while (contents.length > 0 && contents[0].role !== 'user') {
      contents.shift();
    }

    // Append current user message
    contents.push({ role: 'user', parts: [{ text: message.trim() }] });

    const stream = await generateContentStreamWithRetry(ai, {
      model: 'gemini-3.6-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    // From here on the response is a plain streamed text body, not JSON —
    // the client reads it as a live-updating stream instead of waiting for
    // one big res.json() at the end. This is what actually fixes the "it
    // takes forever to answer" feeling: the first words show up as soon as
    // the model writes them, instead of after the whole reply is done.
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Content-Type-Options': 'nosniff',
    });

    let sentAny = false;
    for await (const chunk of stream) {
      const piece = chunk.text;
      if (piece) {
        sentAny = true;
        res.write(piece);
      }
    }

    if (!sentAny) {
      res.write("I'm not sure how to answer that — please reach out via our Contact form!");
    }

    return res.end();
  } catch (error) {
    console.error('Gemini API Error:', error);

    // If we've already sent the 200 + started streaming, headers are
    // locked in — the best we can do is end the stream. The fallback
    // message below only fires when the error happens before any bytes
    // went out.
    if (res.headersSent) {
      return res.end();
    }
    if (isGeminiOverloaded(error)) {
      return res.status(503).json({ error: "Orian AI is getting a lot of requests right now — please try again in a moment." });
    }
    return res.status(500).json({ error: 'Failed to generate a response. Please try again shortly.' });
  }
}
