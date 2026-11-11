const GROQ_CHAT_COMPLETIONS_URL = 'https://api.groq.com/openai/v1/chat/completions';
const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function createGroqCompletion({
  messages,
  model = process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
  maxTokens = 500,
  stream = false,
  retries = 1,
}) {
  const apiKey = process.env.GROQ_API_KEY || '';
  if (!apiKey) {
    const error = new Error('GROQ_API_KEY is missing from environment variables.');
    error.status = 500;
    throw error;
  }

  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    let response;
    try {
      response = await fetch(GROQ_CHAT_COMPLETIONS_URL, {
        method: 'POST',
        signal: AbortSignal.timeout(25000),
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          Accept: stream ? 'text/event-stream' : 'application/json',
        },
        body: JSON.stringify({ model, messages, max_completion_tokens: maxTokens, stream, temperature: 0.4 }),
      });
    } catch (cause) {
      lastError = new Error('Could not connect to Groq.', { cause });
      lastError.status = 503;
    }

    if (response?.ok) return response;
    if (response) {
      let body = {};
      try { body = await response.json(); } catch { /* retain HTTP status */ }
      lastError = new Error(body?.error?.message || `Groq returned HTTP ${response.status}.`);
      lastError.status = response.status;
    }
    if (attempt === retries || !RETRYABLE_STATUS_CODES.has(lastError?.status)) throw lastError;
    await wait(400 * (attempt + 1));
  }
  throw lastError;
}

export async function* readGroqStream(response) {
  if (!response.body) throw new Error('Groq returned an empty response stream.');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  const readEvents = function* (chunk, final = false) {
    buffer += chunk;
    const lines = buffer.split(/\r?\n/);
    buffer = final ? '' : lines.pop() || '';
    for (const line of lines) {
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim();
      if (!data || data === '[DONE]') continue;
      try {
        const event = JSON.parse(data);
        const text = event?.choices?.[0]?.delta?.content;
        if (typeof text === 'string' && text) yield text;
      } catch { /* ignore malformed keep-alive/event lines */ }
    }
  };
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield* readEvents(decoder.decode(value, { stream: true }));
    }
    yield* readEvents(decoder.decode(), true);
  } finally {
    reader.releaseLock();
  }
}
