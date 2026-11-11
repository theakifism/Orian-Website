import React from 'react';
import { Link } from 'react-router-dom';
import { useCollection } from '../content';
import { useLang } from '../context/LangContext';
import { CONTACT } from '../seo/siteConfig';
import { PHONE_PRIMARY, PHONE_PRIMARY_DISPLAY, EMAIL_SUPPORT, STATUS_PAGE_URL } from '../config/site';

const Footer = () => {
  const { t } = useLang();
  const services = useCollection('services');
  return (
    <footer className="o2 o2-footer">
      <div className="o2-wrap">
        <div className="o2-foot-grid">
          <div className="o2-foot-brand">
            <img src="/logo-full.webp" alt="Orian Teleservices" width="132" height="45" loading="lazy" style={{ height: '2.2rem', width: 'auto' }} />
            <p>{t('foot.tag')}</p>
            <p>
              {CONTACT.address.streetAddress}, {CONTACT.address.addressLocality} {CONTACT.address.postalCode}, {CONTACT.address.addressRegion}, India
            </p>
            <p>
              <a href={`tel:${PHONE_PRIMARY}`} style={{ color: 'var(--o-text-2)' }}>{PHONE_PRIMARY_DISPLAY}</a><br />
              <a href={`mailto:${EMAIL_SUPPORT}`} style={{ color: 'var(--o-text-2)' }}>{EMAIL_SUPPORT}</a>
            </p>
          </div>

          <div>
            <p className="o2-foot-title">{t('foot.services')}</p>
            <ul>
              {services.map((s) => (<li key={s.slug}><Link to={`/services/${s.slug}`}>{s.title}</Link></li>))}
            </ul>
          </div>

          <div>
            <p className="o2-foot-title">{t('foot.resources')}</p>
            <ul>
              <li><Link to="/use-cases">Use cases</Link></li>
              <li><Link to="/developers">API and docs</Link></li>
              <li><Link to="/compliance">Compliance centre</Link></li>
              <li><Link to="/resources">Guides</Link></li>
              <li><Link to="/help-center">Help centre</Link></li>
              <li><Link to={STATUS_PAGE_URL}>Status</Link></li>
            </ul>
          </div>

          <div>
            <p className="o2-foot-title">{t('foot.company')}</p>
            <ul>
              <li><Link to="/about">{t('nav.about')}</Link></li>
              <li><Link to="/industries">{t('nav.industries')}</Link></li>
              <li><Link to="/why-us">Why Orian</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/contact">{t('nav.contact')}</Link></li>
              <li><Link to="/bulk-sms-service-nagpur">Bulk SMS in Nagpur</Link></li>
            </ul>
          </div>
        </div>

        <div className="o2-foot-base">
          <span>&copy; {new Date().getFullYear()} Orian Teleservices. All rights reserved.</span>
          <nav aria-label="Legal">
            <Link to="/privacy">Privacy policy</Link>
            <Link to="/terms">Terms of service</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
