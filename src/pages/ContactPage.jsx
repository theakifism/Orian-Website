import React from 'react';
import PageHeader from '../components/PageHeader';
import Seo from '../seo/Seo';
import { pageMeta } from '../seo/pageMeta';
import Contact from '../components/Contact';
import SpecialRequirement from '../components/SpecialRequirement';

const ContactPage = () => {
  return (
    <>
      <Seo title={pageMeta.contact.title} description={pageMeta.contact.description} path={pageMeta.contact.path} />
      <PageHeader
        eyebrow="Contact Us"
        title="Let's start a"
        gradientWord="project."
        subtitle="24x7 helpline, email support, or drop by our Nagpur office — every channel reaches the same team."
        breadcrumbs={[{ label: 'Contact' }]}
        glowClass="bg-[#00AEEF]/10"
      />
      <SpecialRequirement />
      <Contact />
    </>
  );
};

export default ContactPage;
