import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, Check, Copy } from 'lucide-react';
import TypewriterText from './o2/TypewriterText';
import AiOrb from './o2/AiOrb';
import useInView from '../hooks/useInView';

// Same Cloudflare Turnstile site key used by the contact form and admin
// login (see api/_lib/turnstile.js) — safe to expose, only the secret key
// verified server-side is sensitive. Rendered in invisible mode here so a
// chat widget doesn't have to show a visible checkbox before every message;
// Cloudflare only surfaces a visible challenge if it judges a request risky.
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';

const GREETING =
  "Hi, I'm Orian AI. Ask me about bulk SMS, DLT registration, OTP delivery, or our Voice and WhatsApp services.";

const CopyButton = ({ text }) => {
  const [ok, setOk] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setOk(true);
      window.setTimeout(() => setOk(false), 1500);
    } catch {
      // clipboard blocked - nothing to do
    }
  };
  return (
    <button type="button" className="o2-copy" onClick={onCopy} aria-label={ok ? 'Copied' : 'Copy answer'} title={ok ? 'Copied' : 'Copy'}>
      {ok ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
};

let nextId = 1;
const makeMsg = (sender, text, extra = {}) => ({
  id: nextId++,
  sender,
  text,
  done: true, // stream finished
  animate: false, // only live replies are typed out
  ...extra,
});

const AiAssistant = ({ showHeading = true, embedded = false, initialQuestion = '' }) => {
  const [messages, setMessages] = useState(() => [makeMsg('ai', GREETING)]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false); // waiting for the first bytes
  const [streaming, setStreaming] = useState(false); // bytes still arriving
  const [headRef, headClass] = useInView();

  const streamRef = useRef(null); // the chat box's own scrollable container
  const stickRef = useRef(true); // follow new text unless the visitor scrolled up
  const taRef = useRef(null); // composer textarea (auto-grows)
  const turnstileRef = useRef(null);
  const tokenRef = useRef('');
  const widgetIdRef = useRef(null);
  const tokenResolverRef = useRef(null);

  const busy = isTyping || streaming;

  // Loads Cloudflare's Turnstile script once and renders an invisible,
  // manually-triggered widget (execution: 'execute' means it sits idle
  // until getTurnstileToken() below explicitly fires it — it does NOT
  // verify on mount, only right before a message is actually sent).
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return undefined;

    const renderWidget = () => {
      if (!window.turnstile || !turnstileRef.current || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        appearance: 'interaction-only',
        // Solve in the background as soon as the widget loads, so a token is
        // usually ready before the visitor presses send (much more reliable
        // on slow mobile connections than solving at send time).
        execution: 'render',
        'refresh-expired': 'auto',
        callback: (token) => {
          if (tokenResolverRef.current) {
            tokenResolverRef.current(token);
            tokenResolverRef.current = null;
          } else {
            tokenRef.current = token;
          }
        },
        'expired-callback': () => {
          tokenRef.current = '';
        },
        'error-callback': () => {
          tokenRef.current = '';
          tokenResolverRef.current?.('');
          tokenResolverRef.current = null;
        },
      });
    };

    if (window.turnstile) {
      renderWidget();
      return undefined;
    }

    const existing = document.getElementById('cf-turnstile-script');
    if (!existing) {
      const script = document.createElement('script');
      script.id = 'cf-turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    const interval = setInterval(() => {
      if (window.turnstile) {
        clearInterval(interval);
        renderWidget();
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Resolves with a fresh, single-use token right before each send. Falls
  // back to an empty string (rather than hanging the chat forever) if
  // Turnstile isn't configured, hasn't finished loading yet, or Cloudflare
  // never calls back within a few seconds — the server treats a missing
  // token as a normal verification failure, same as any other bad token.
  const getTurnstileToken = () => {
    if (!TURNSTILE_SITE_KEY) return Promise.resolve('');

    // A token solved in the background is ready: use it (single-use).
    if (tokenRef.current) {
      const ready = tokenRef.current;
      tokenRef.current = '';
      return Promise.resolve(ready);
    }
    if (!window.turnstile || !widgetIdRef.current) return Promise.resolve('');

    // Not ready yet: wait for it (up to 25s, long enough for slow phones).
    return new Promise((resolve) => {
      tokenResolverRef.current = resolve;
      window.setTimeout(() => {
        if (tokenResolverRef.current === resolve) {
          tokenResolverRef.current = null;
          resolve('');
        }
      }, 25000);
    });
  };

  // Scrolling stays inside the chat box (never the page). While an answer is
  // being typed out the box follows the newest text, unless the visitor has
  // scrolled up to re-read something.
  const scrollToBottom = (smooth = false) => {
    const el = streamRef.current;
    if (!el || !stickRef.current) return;
    if (smooth) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    else el.scrollTop = el.scrollHeight;
  };

  const onStreamScroll = () => {
    const el = streamRef.current;
    if (!el) return;
    stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  useEffect(() => {
    scrollToBottom(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length, isTyping]);

  const patchMessage = (id, patch) =>
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  const handleSend = async (userText) => {
    const textToSend = userText || input;
    if (!textToSend.trim() || busy) return;

    const history = messages.map(({ sender, text }) => ({ sender, text }));
    stickRef.current = true;
    setMessages((prev) => [...prev, makeMsg('user', textToSend)]);
    if (!userText) setInput('');
    setIsTyping(true);

    const turnstileToken = await getTurnstileToken();
    let replyId = null;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history, // send prior turns so the AI has context
          turnstileToken,
        }),
      });

             if (!res.ok) {
        // Error responses are still plain JSON (see api/chat.js) - a
        // successful reply is a raw streamed text body instead.
        let errMsg = `Server responded with ${res.status}`;
        try {
          const data = await res.json();
          if (data?.error) errMsg = data.error;
        } catch {
          // ignore - fall back to the generic message below
        }
        const err = new Error(errMsg);
        // 503 = AI service busy, 429 = too many messages from this visitor
        err.busy = res.status === 503 || res.status === 429;
        throw err;
      }

      if (!res.body) {
        // Browsers without ReadableStream: read the whole reply, then type it out.
        const text = await res.text();
        setIsTyping(false);
        setMessages((prev) => [...prev, makeMsg('ai', text, { animate: true })]);
        return;
      }

      // Push one empty AI message and grow its text as chunks arrive. The
      // TypewriterText component paces what is shown, so large chunks still
      // read as smooth typing.
      const reply = makeMsg('ai', '', { done: false, animate: true });
      replyId = reply.id;
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
      setStreaming(true);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiText = '';

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        aiText += decoder.decode(value, { stream: true });
        patchMessage(replyId, { text: aiText });
      }
      aiText += decoder.decode();

      // Never leave a blank bubble if the stream closed without any text.
      patchMessage(replyId, {
        text: aiText.trim()
          ? aiText
          : "I'm not sure how to answer that - please reach out via our Contact form!",
        done: true,
      });
    } catch (error) {
      console.error('Chat request failed:', error);
      // Show the real reason instead of always blaming "busy": a 400 means Turnstile
      // verification failed, a 500 means the server is misconfigured (e.g. missing API key).
      const fallback = error?.busy
        ? "Lots of clients are chatting with me right now, so I'm running a little behind. Please send that again in a few seconds and I'll get right back to you."
        : (error?.message || 'Something went wrong. Please try again.');
      if (replyId !== null) {
        // a reply bubble already exists (stream broke mid-way): keep what
        // arrived and mark it finished
        setMessages((prev) =>
          prev.map((m) => (m.id === replyId ? { ...m, text: m.text.trim() ? m.text : fallback, done: true } : m))
        );
      } else {
        setMessages((prev) => [...prev, makeMsg('ai', fallback, { animate: true })]);
      }
    } finally {
      setIsTyping(false);
      setStreaming(false);
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
      }
    }
  };

  // When opened from a suggested question elsewhere on the page, ask it once on mount.
  const askedInitial = useRef(false);
  useEffect(() => {
    if (!initialQuestion || askedInitial.current) return;
    askedInitial.current = true;
    handleSend(initialQuestion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuestion]);

  // Grow the composer with its text (up to the CSS max-height), shrink back after sending.
  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [input]);

  const onComposerKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  // Fresh conversation (only the greeting so far): show the welcome screen instead of an empty thread.
  const isWelcome = messages.length === 1 && !busy;

  const lastDone = [...messages].reverse().find((m) => m.sender === 'ai' && m.done && m.text);

  const wrap = (children) =>
    embedded ? <div className="o2 o2-ai-embed">{children}</div> : (
      <section id="ai-help" className="o2 o2-ai">
        <div className="o2-wrap" style={{ maxWidth: '60rem' }}>{children}</div>
      </section>
    );

  return wrap(
    <>
      {showHeading && !embedded && (
        <div ref={headRef} className={headClass} style={{ display: 'grid', gap: '1rem', marginBottom: '2.5rem' }}>
          <span className="o2-eyebrow"><i />Orian AI</span>
          <h2 className="o2-h2">Questions? Ask Orian AI.</h2>
          <p className="o2-lead">Straight answers on bulk SMS, DLT registration, OTP delivery and our other services.</p>
        </div>
      )}

      <div className={`o2-chat${embedded ? ' is-embedded' : ''}`}>
        {/* Orian mark: large, faint, anchored to the bottom of the chat background */}
        <img
          className="o2-watermark"
          src="/logo-icon.webp"
          alt=""
          aria-hidden="true"
          width="840"
          height="631"
          loading="lazy"
          decoding="async"
        />

        {/* Chat stream */}
        <div ref={streamRef} onScroll={onStreamScroll} className={`o2-chat-stream${isWelcome ? ' is-welcome' : ''}`}>
          {isWelcome && (
            <div className="o2-welcome">
              <AiOrb size={56} />
              <p>{GREETING}</p>
            </div>
          )}

          {/* The greeting is shown by the welcome screen; it stays in state so the API history is unchanged. */}
          {messages.slice(1).map((msg) => (
            <div key={msg.id} className={`o2-row ${msg.sender}`}>
              {msg.sender === 'ai' && <AiOrb size={26} />}
              {msg.sender === 'ai' ? (
                <div className="o2-ai-col">
                  <div className="o2-msg ai">
                    <TypewriterText
                      text={msg.text}
                      done={msg.done}
                      animate={msg.animate}
                      onProgress={scrollToBottom}
                    />
                  </div>
                  {msg.done && msg.text && <CopyButton text={msg.text} />}
                </div>
              ) : (
                <div className="o2-msg user">{msg.text}</div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="o2-row ai o2-think-row" aria-hidden="true">
              <AiOrb size={26} state="thinking" />
              <span className="o2-shimmer">Thinking&hellip;</span>
            </div>
          )}
        </div>

        {/* Cloudflare Turnstile mounts here - invisible unless it decides
              a challenge is needed, so this has no visual footprint. */}
        {TURNSTILE_SITE_KEY && <div ref={turnstileRef} />}

        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="o2-composer"
        >
          <textarea
            ref={taRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onComposerKey}
            placeholder="Ask about bulk SMS, DLT, OTPs..."
            aria-label="Your question"
            maxLength={1000}
            className="o2-ta"
            data-autofocus
          />
          <div className="o2-composer-bar">
            {input.length > 800 && <span className="o2-count">{input.length}/1000</span>}
            <button type="submit" disabled={busy || !input.trim()} aria-label="Send message" className="o2-send-orb">
              <ArrowUp size={18} strokeWidth={2.4} />
            </button>
          </div>
        </form>

        {/* Screen readers hear each finished answer once, not every typed character. */}
        <p className="o2-sr" role="status" aria-live="polite">{lastDone ? lastDone.text : ''}</p>
      </div>
    </>
  );
};

export default AiAssistant;
