// Retries a Gemini API call when the failure looks transient (the model is
// temporarily overloaded, or we've hit a rate limit) instead of giving up
// on the very first hiccup. Anything else (bad API key, invalid request,
// etc.) is thrown immediately since retrying won't fix it.
const RETRYABLE_STATUS_CODES = new Set([429, 503]);

function isRetryableError(err) {
  const status = err?.status ?? err?.error?.code;
  return RETRYABLE_STATUS_CODES.has(status);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Calls ai.models.generateContent(params), retrying with exponential
// backoff (+ jitter) when Gemini responds 429 (rate limited) or 503
// (overloaded). `retries` is the number of *extra* attempts after the
// first, so retries=2 means up to 3 total calls before giving up.
export async function generateContentWithRetry(ai, params, { retries = 2, baseDelayMs = 600 } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await ai.models.generateContent(params);
    } catch (err) {
      lastErr = err;
      if (attempt === retries || !isRetryableError(err)) {
        throw err;
      }
      const delay = baseDelayMs * 2 ** attempt + Math.floor(Math.random() * 250);
      console.warn(
        `Gemini call failed (attempt ${attempt + 1}/${retries + 1}), retrying in ${delay}ms:`,
        err?.message || err
      );
      await sleep(delay);
    }
  }
  throw lastErr;
}

export function isGeminiOverloaded(err) {
  return isRetryableError(err);
}

// Same retry behaviour as generateContentWithRetry, but for
// ai.models.generateContentStream(). Only the *initial* call (which
// returns the async-iterable stream) is retried — once we start reading
// chunks from a stream and forwarding them to the client, a failure
// mid-stream can't be silently retried without either duplicating
// already-sent text or leaving the client hanging, so we just let that
// stop the stream where it is.
export async function generateContentStreamWithRetry(ai, params, { retries = 2, baseDelayMs = 600 } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await ai.models.generateContentStream(params);
    } catch (err) {
      lastErr = err;
      if (attempt === retries || !isRetryableError(err)) {
        throw err;
      }
      const delay = baseDelayMs * 2 ** attempt + Math.floor(Math.random() * 250);
      console.warn(
        `Gemini stream call failed (attempt ${attempt + 1}/${retries + 1}), retrying in ${delay}ms:`,
        err?.message || err
      );
      await sleep(delay);
    }
  }
  throw lastErr;
}
