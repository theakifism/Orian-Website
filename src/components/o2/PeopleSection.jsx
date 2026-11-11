import React from 'react';
import SectionHead from './SectionHead';
import { useLang } from '../../context/LangContext';
import { photo, photoProps } from '../../utils/photo';

/**
 * Photo section: the team and the support desk. Alt text describes what is in
 * each photo; captions stay generic so they never claim more than the image shows.
 */
const PeopleSection = () => {
  const { t } = useLang();
  return (
    <section className="o2 o2-sec is-alt" id="people" data-section="people">
      <div className="o2-wrap">
        <SectionHead eyebrow={t('people.eyebrow')} title={t('people.title')} lead={t('people.lead')} />
        <div className="o2-people">
          <figure className="o2-photo p-main">
            <img {...photoProps('o2/team-office.webp', "(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw")} alt="People working at desks in a bright open-plan office" loading="lazy" decoding="async" />
            <figcaption>The team</figcaption>
          </figure>
          <figure className="o2-photo p-a">
            <img {...photoProps('o2/support-desk.webp', "(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw")} alt="A support agent at a desk with two monitors, city lights outside the window" loading="lazy" decoding="async" />
            <figcaption>Support desk</figcaption>
          </figure>
          <figure className="o2-photo p-b">
            <img {...photoProps('o2/team-planning.webp', "(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw")} alt="Three colleagues discussing work around a laptop" loading="lazy" decoding="async" />
            <figcaption>Planning with you</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
};

export default PeopleSection;
