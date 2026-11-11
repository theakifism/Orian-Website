import React from 'react';
import SectionHead from './SectionHead';
import MapEmbed, { MAP_DIRECTIONS_URL } from '../MapEmbed';
import SpecialRequirement from '../SpecialRequirement';
import { quickQuestions as defaultQuickQuestions } from '../../content/defaults/AiAssistant.js';
import { useData } from '../../content';
import { CONTACT } from '../../seo/siteConfig';
import { PHONE_PRIMARY, PHONE_PRIMARY_DISPLAY } from '../../config/site';
import { useLang } from '../../context/LangContext';
import { useUI } from '../../context/UIContext';
import { Arrow } from './Icons';

/**
 * The closing row of the home page: map, AI assistant and the special
 * requirement form. The form is the real one (posts to /api/special-requirement);
 * the assistant card opens the Ctrl+K command bar, optionally with a question.
 */
const GetInTouch = () => {
  const { t } = useLang();
  const { openCommand } = useUI();
  const quickQuestions = useData('AiAssistant.quickQuestions', defaultQuickQuestions);
  const a = CONTACT.address;

  return (
    <section className="o2 o2-sec" id="get-in-touch" data-section="get-in-touch">
      <div className="o2-wrap">
        <SectionHead eyebrow={t('touch.eyebrow')} title={t('touch.title')} lead={t('touch.lead')} />

        <div className="o2-touch">
          <div className="o2-touch-left">
            {/* 1. Map */}
            <div className="o2-panel" data-section="map">
              <span className="o2-t-kicker is-primary">Orian HQ / Nagpur</span>
              <MapEmbed compact />
              <p className="o2-addr">
                {a.streetAddress}, {a.addressLocality}, {a.addressRegion} {a.postalCode}.{' '}
                <a href={MAP_DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" data-track="map_directions">Get directions</a>
                {' '}or call <a href={`tel:${PHONE_PRIMARY}`}>{PHONE_PRIMARY_DISPLAY}</a>.
              </p>
            </div>

            {/* 2. AI assistant */}
            <div className="o2-panel is-ai" data-section="ai-card">
              <span className="o2-t-kicker is-primary"><span className="o2-ai-dot" aria-hidden="true" />Orian AI</span>
              <h3>{t('ai.card.title')}</h3>
              <p>{t('ai.card.lead')}</p>
              <div className="o2-chiprow">
                {quickQuestions.slice(0, 3).map((q) => (
                  <button key={q} type="button" className="o2-chip" onClick={() => openCommand(q)} data-track="ai_card_question">{q}</button>
                ))}
              </div>
              <div>
                <button type="button" className="o2-btn o2-btn-primary" onClick={() => openCommand()} data-track="ai_card_open">
                  {t('ai.card.open')} <Arrow />
                </button>
              </div>
            </div>
          </div>

          {/* 3. Special requirement form */}
          <div className="o2-touch-right">
            <SpecialRequirement embedded />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;
