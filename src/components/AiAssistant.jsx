import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';

const AiAssistant = ({ showHeading = true }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am Orian AI. How can I assist you with our telecom services, enterprise solutions, or support today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const streamRef = useRef(null); // the chat box's own scrollable container

  const quickQuestions = [
    "How fast can I go live?",
    "Do you handle DLT registration for me?",
    "How fast is OTP delivery?",
    "What does WhatsApp green-tick setup involve?"
  ];

  // Auto-scroll — but only inside the chat box itself. Setting scrollTop
  // directly on streamRef stays scoped to that one element; it never
  // touches the page's own scroll position, unlike scrollIntoView() (which
  // walks up and scrolls every scrollable ancestor it finds, including the
  // whole page — that was the "page jumps around" bug).
  useEffect(() => {
    const el = streamRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (userText) => {
    const textToSend = userText || input;
    if (!textToSend.trim()) return;

    const updatedMessages = [...messages, { sender: 'user', text: textToSend }];
    setMessages(updatedMessages);
    if (!userText) setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages, // send prior turns so the AI has context
        }),
      });

      if (!res.ok) {
        // Error responses are still plain JSON (see api/chat.js) — a
        // successful reply is a raw streamed text body instead.
        let errMsg = `Server responded with ${res.status}`;
        try {
          const data = await res.json();
          if (data?.error) errMsg = data.error;
        } catch {
          // ignore — fall back to the generic message below
        }
        throw new Error(errMsg);
      }

      if (!res.body) {
        // Extremely old browsers without ReadableStream support — fall
        // back to reading the whole response at once.
        const text = await res.text();
        setMessages((prev) => [...prev, { sender: 'ai', text }]);
        return;
      }

      // Stream the reply in as it arrives: push one empty AI message, then
      // keep growing its text as chunks come in, so words appear live
      // instead of the whole answer popping in after a long silent wait.
      setMessages((prev) => [...prev, { sender: 'ai', text: '' }]);
      setIsTyping(false);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiText = '';

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        aiText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { sender: 'ai', text: aiText };
          return next;
        });
      }

      // If the stream closed without ever sending a single character
      // (shouldn't normally happen — the API always writes a fallback
      // line — but just in case), show something rather than a blank
      // bubble.
      if (!aiText.trim()) {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            sender: 'ai',
            text: "I'm not sure how to answer that — please reach out via our Contact form!",
          };
          return next;
        });
      }
    } catch (error) {
      console.error('Chat request failed:', error);

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: "I am having trouble processing that request right now. Please reach out via our Contact form!"
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <section id="ai-help" className="relative py-20 bg-transparent text-[var(--text)] overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {showHeading && (
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Have Questions? <span className="text-[#00AEEF]">Ask Orian AI</span>
            </h2>
            <p className="text-[var(--text-dim)] text-sm md:text-base">
              Get instant answers about our services, connectivity, and enterprise solutions.
            </p>
          </div>
        )}

        <div className="mobile-fade-in ambient-glow-border relative overflow-hidden bg-[var(--surface)]/35 border-2 border-[#00AEEF]/60 rounded-2xl p-4 md:p-6 shadow-[0_25px_70px_-20px_rgba(0,174,239,0.25)] flex flex-col h-[68vh] min-h-[420px] md:h-120 backdrop-blur-2xl">

          {/* Orian "A" mark, watermarked centered behind the card content */}
          <img
            src="/logo-icon.png"
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-72 lg:w-96 md:h-72 lg:h-96 object-contain opacity-[0.28] z-0"
          />

          {/* Chat Stream */}
          <div ref={streamRef} className="relative z-10 flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[88%] md:max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#00AEEF] text-black font-medium rounded-tr-none'
                      : 'bg-[var(--surface-strong)]/80 text-[var(--text-soft)] border border-[var(--border)] rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[var(--overlay-strong)] text-[var(--text-dim)] text-xs px-4 py-2 rounded-full animate-pulse">
                  Orian AI is thinking...
                </div>
              </div>
            )}
          </div>

          {/* Prompt Chips — desktop only; removed on mobile per request, where
              the smaller viewport makes a card look cramped, so phones jump
              straight from the chat stream to the input. */}
          <div className="hidden md:flex relative z-10 my-4 flex-wrap gap-2 pt-3 border-t border-[var(--border)]">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-xs bg-[var(--overlay)] hover:bg-[#00AEEF]/20 hover:text-[#00AEEF] text-[var(--text-soft)] border border-[var(--border)] rounded-full px-3 py-1.5 transition-all duration-200"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="md:hidden relative z-10 border-t border-[var(--border)] mt-1 mb-3" />

          {/* Form Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="relative z-10 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about Orian Teleservices..."
              className="flex-1 bg-[var(--overlay)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[#00AEEF] transition-colors"
            />
            <button
              type="submit"
              disabled={isTyping}
              aria-label="Send message"
              className="tap-feedback flex items-center justify-center gap-1.5 bg-[#00AEEF] hover:bg-[#E8A23D] active:scale-95 text-black font-semibold rounded-xl text-sm transition-all duration-300 shadow-[0_0_10px_rgba(0,174,239,0.3)] disabled:opacity-50 w-12 h-12 shrink-0 md:w-auto md:h-auto md:px-5 md:py-3"
            >
              <Send className="w-5 h-5 md:hidden" />
              <span className="hidden md:inline">Send</span>
            </button>
          </form>

        </div>
      </div>
    </section>
  );
};

export default AiAssistant;
