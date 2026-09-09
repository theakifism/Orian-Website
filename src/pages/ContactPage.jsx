import React from 'react';
import PageHeader from '../components/PageHeader';
import Contact from '../components/Contact';
import SpecialRequirement from '../components/SpecialRequirement';

const ContactPage = () => {
  return (
    <>
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
