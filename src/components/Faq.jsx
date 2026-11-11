import React, { useState } from 'react';

const faqKnowledgeBase = [
  {
    q: "What is DLT registration and why is it mandatory?",
    a: "DLT (Distributed Ledger Technology) is a blockchain system mandated by TRAI in India to prevent SMS spam and protect consumers. All enterprise senders must register headers and templates before delivering SMS."
  },
  {
    q: "How many carrier routes does Orian cover?",
    a: "Route coverage and fallback options depend on the service. Contact Orian to confirm what applies to your account."
  },
  {
    q: "What is the WhatsApp Business API SLA uptime?",
    a: "Any uptime commitments are set out in the applicable service agreement. Contact Orian to confirm terms for your account."
  },
  {
    q: "How do I start a messaging campaign?",
    a: "Use the contact page to reach the team and discuss registration or integration requirements."
  }
];

const Faq = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! Welcome to Orian Teleservices Support. How can I assist you with carrier routing or API questions?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { text: query, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");

    setTimeout(() => {
      const match = faqKnowledgeBase.find(item => 
        item.q.toLowerCase().includes(query.toLowerCase()) || 
        query.toLowerCase().includes(item.q.toLowerCase().slice(0, 8))
      );

      const botReply = match 
        ? match.a 
        : "For routing, DLT or enterprise setup questions, contact the team using the details on our Contact page.";

      setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
    }, 500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Interactive Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#00AEEF] rounded-full flex items-center justify-center text-white hover:scale-110 transition-all duration-300"
      >
        {isOpen ? <span className="text-xl font-bold">✕</span> : <span className="text-xl font-bold">+</span>}
      </button>

      {/* Floating Chat Box */}
      {isOpen && (
        <div className="absolute bottom-18 right-0 w-80 md:w-96 bg-[#12151C] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col h-[450px] overflow-hidden">
          
          {/* Header */}
          <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-mono text-sm font-bold text-white">Orian Live Assistant</span>
            </div>
            <span className="text-xs text-gray-400 font-mono">Ask a question</span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs text-gray-200">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl max-w-[85%] ${
                  m.sender === "user"
                    ? "bg-[#00AEEF] text-white ml-auto font-medium"
                    : "bg-white/5 border border-white/10 text-gray-300 mr-auto"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Quick Filter Buttons */}
          <div className="p-2 bg-black/40 border-t border-white/5 flex gap-1 overflow-x-auto text-[10px] font-mono text-[#00AEEF]">
            <button onClick={() => handleSend("DLT registration")} className="px-2 py-1 bg-white/5 rounded hover:bg-white/10"># DLT</button>
            <button onClick={() => handleSend("SLA uptime")} className="px-2 py-1 bg-white/5 rounded hover:bg-white/10"># SLA</button>
            <button onClick={() => handleSend("Carrier routes")} className="px-2 py-1 bg-white/5 rounded hover:bg-white/10"># Routes</button>
          </div>

          {/* Chat Input */}
          <div className="p-3 bg-white/5 border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask a question..."
              className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/40"
            />
            <button
              onClick={() => handleSend()}
              className="px-3 py-2 bg-[#00AEEF] text-white rounded-lg text-xs font-bold hover:bg-[#00AEEF] transition-colors"
            >
              Send
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default Faq;
