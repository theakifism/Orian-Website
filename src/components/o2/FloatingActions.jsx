import React from 'react';
import { PHONE_PRIMARY, whatsappLink } from '../../config/site';
import { PhoneIcon, WhatsAppIcon } from './Icons';

/** Mobile-only floating WhatsApp and call buttons. */
const FloatingActions = () => (
  <div className="o2 o2-fab">
    <a className="wa" href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" data-track="fab_whatsapp"><WhatsAppIcon /></a>
    <a href={`tel:${PHONE_PRIMARY}`} aria-label="Call Orian" data-track="fab_call"><PhoneIcon /></a>
  </div>
);

export default FloatingActions;
