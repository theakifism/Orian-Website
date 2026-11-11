import React from 'react';

/**
 * The assistant's avatar: the Orian logo mark with a soft glow behind it.
 * state="thinking" makes the logo pulse while an answer is being prepared.
 * (Kept as AiOrb so existing imports keep working.)
 */
const AiOrb = ({ size = 28, state = 'idle', className = '' }) => (
  <span
    className={`o2-orb${state === 'thinking' ? ' is-thinking' : ''}${className ? ` ${className}` : ''}`}
    style={{ '--orb': `${size}px` }}
    aria-hidden="true"
  >
    <img src="/logo-mark.webp" alt="" width="256" height="256" decoding="async" draggable="false" />
  </span>
);

export default AiOrb;
