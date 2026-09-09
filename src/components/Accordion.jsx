import React, { useState } from 'react';
import { ChevronIcon } from './CardIcons';

/**
 * A click-to-expand accordion — used for FAQ blocks so a page full of
 * question/answer text becomes something you interact with (open one at a
 * time) rather than a wall of paragraphs you have to scroll past.
 */
const Accordion = ({ items, accentColor = '#00AEEF' }) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="divide-y divide-[var(--border)]">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : idx)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 py-4 text-left group"
            >
              <span
                className="text-sm font-semibold text-[var(--text)] transition-colors"
                style={{ color: isOpen ? accentColor : undefined }}
              >
                {item.q}
              </span>
              <ChevronIcon
                className={`w-4 h-4 shrink-0 text-[var(--text-faint)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <div
              className="grid transition-all duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p className="text-xs md:text-sm text-[var(--text-dim)] leading-relaxed pb-4 pr-8">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
