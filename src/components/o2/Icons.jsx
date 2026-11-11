import React from 'react';

const base = { viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
export const Arrow = (p) => (<svg {...base} {...p}><path d="M3 8h10M9 4l4 4-4 4" /></svg>);
export const Chevron = (p) => (<svg {...base} {...p}><path d="m4 6 4 4 4-4" /></svg>);
export const Close = (p) => (<svg {...base} {...p}><path d="M4 4l8 8M12 4l-8 8" /></svg>);
export const Burger = (p) => (<svg {...base} {...p}><path d="M2.5 5h11M2.5 11h11" /></svg>);
export const Tick = (p) => (<svg {...base} {...p}><path d="m3.5 8.4 2.9 2.9 6.1-6.6" /></svg>);
export const Pin = (p) => (<svg {...base} {...p}><path d="M8 14s4.5-3.6 4.5-7.2A4.5 4.5 0 0 0 3.5 6.8C3.5 10.4 8 14 8 14Z" /><circle cx="8" cy="6.8" r="1.5" /></svg>);
export const Spark = (p) => (<svg {...base} {...p}><path d="M8 2v3M8 11v3M2 8h3M11 8h3M4 4l2 2M10 10l2 2M12 4l-2 2M6 10l-2 2" /></svg>);
export const PhoneIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    <path d="M5 4h3.2l1.6 4-2 1.3a11 11 0 0 0 5.9 5.9l1.3-2 4 1.6V18a2 2 0 0 1-2 2A14 14 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </svg>
);
export const WhatsAppIcon = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.200s.9 2.500 1.100 2.700c.1.200 1.800 2.800 4.400 3.900 1.600.7 2.200.7 3 .6.500-.1 1.500-.6 1.700-1.200.2-.6.2-1.100.1-1.200-.1-.1-.2-.2-.5-.3Z" />
  </svg>
);
