import React from 'react';
import PageHeader from '../components/PageHeader';
import Seo from '../seo/Seo';
import { pageMeta } from '../seo/pageMeta';
import { localBusinessSchema } from '../seo/jsonld';
import Contact from '../components/Contact';
import SpecialRequirement from '../components/SpecialRequirement';
import { photoProps } from '../utils/photo';
import PageContent from '../components/PageContent';

const ContactPage = () => {
  return (
    <>
      <Seo title={pageMeta.contact.title} description={pageMeta.contact.description} path={pageMeta.contact.path} jsonLd={localBusinessSchema()} />
      <PageHeader
        eyebrow="Contact Us"
        title="Let's start a"
        gradientWord="project."
        subtitle="Reach our team 24/7 by phone, email or WhatsApp, or visit our Nagpur office."
        breadcrumbs={[{ label: 'Contact' }]}
        glowClass="bg-[#00AEEF]/10"
      />

      {/* Real office photo — src/assets/images/contact/office-front.jpg */}
      <section className="relative pb-4 bg-transparent overflow-hidden">
        <div className="max-w-4xl mx-auto px-6">
          <div className="aspect-21/9 rounded-2xl border border-(--border) overflow-hidden bg-(--surface)">
            <img
              {...photoProps('contact/office-front.jpg', "(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw")}
              alt="Orian Teleservices office"
              loading="lazy"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement.style.backgroundColor = 'var(--overlay)';
              }}
            />
          </div>
        </div>
      </section>

      <SpecialRequirement />
      <Contact />
    <PageContent id="contact" />
    </>
  );
};

export default ContactPage;
