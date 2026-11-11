import React from 'react';
import { Link } from 'react-router-dom';
import SectionHead from './SectionHead';
import { useLang } from '../../context/LangContext';
import { Arrow } from './Icons';
import { photo, photoProps } from '../../utils/photo';

// Photo, slug and a short label for each sector (links to the existing industry pages).
const SECTORS = [
  { slug: 'banking', label: 'Banking and fintech', img: 'ind-banking', alt: 'A bank employee helping a customer at a counter' },
  { slug: 'healthcare-hospitals', label: 'Healthcare', img: 'ind-healthcare', alt: 'A hospital receptionist speaking with a patient' },
  { slug: 'retail', label: 'Retail and e-commerce', img: 'ind-retail', alt: 'A shop assistant serving a customer at the till' },
  { slug: 'educational-institutes', label: 'Education', img: 'ind-education', alt: 'A teacher and pupils in a classroom' },
  { slug: 'corporates', label: 'Corporates', img: 'ind-corporates', alt: 'Colleagues in a meeting room reviewing a presentation' },
  { slug: 'it-services', label: 'IT services', img: 'ind-it', alt: 'Two engineers looking at a screen together' },
];

const IndustryPhotos = () => {
  const { t } = useLang();
  return (
    <section className="o2 o2-sec" id="industries-photos" data-section="industries">
      <div className="o2-wrap">
        <SectionHead eyebrow={t('ind.eyebrow')} title={t('ind.title')} />
        <div className="o2-ind">
          {SECTORS.map((s) => (
            <Link key={s.slug} to={`/industries/${s.slug}`} data-track="industry_photo" data-track-label={s.slug}>
              <img {...photoProps(`o2/${s.img}.webp`, "(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw")} alt={s.alt} loading="lazy" decoding="async" />
              <span>{s.label}</span>
            </Link>
          ))}
        </div>
        <p className="o2-ind-more">
          <Link to="/industries" className="o2-btn o2-btn-ghost" data-track="industries_all">{t('ind.all')} <Arrow /></Link>
        </p>
      </div>
    </section>
  );
};

export default IndustryPhotos;
