import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Seo from '../seo/Seo';
import { pageMeta } from '../seo/pageMeta';

const Section = ({ title, children }) => (
  <div className="space-y-3">
    <h2 className="text-xl md:text-2xl font-bold text-(--text)">{title}</h2>
    <div className="text-sm md:text-base text-(--text-dim) leading-relaxed space-y-3">{children}</div>
  </div>
);

const TermsPage = () => {
  return (
    <>
      <Seo title={pageMeta.terms.title} description={pageMeta.terms.description} path={pageMeta.terms.path} />
      <PageHeader
        eyebrow="Legal"
        title="Terms of"
        gradientWord="Service."
        subtitle="The terms that govern your use of the Orian Teleservices website and services."
        breadcrumbs={[{ label: 'Terms of Service' }]}
      />

      <section className="relative pb-24 bg-transparent overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 space-y-10">
          <p className="text-xs font-mono text-(--text-faint)">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <Section title="1. Acceptance of Terms">
            <p>
              These Terms of Service ("Terms") govern your access to and use of the Orian Tele Services Private
              Limited ("Orian", "we", "us" or "our") website and services, including bulk SMS, voice, WhatsApp
              Business API, DLT compliance, digital marketing and IT solutions. By accessing our website or using
              our services, you agree to be bound by these Terms.
            </p>
          </Section>

          <Section title="2. Our Services">
            <p>
              Orian provides enterprise messaging and IT infrastructure services as described on our{' '}
              <Link to="/services" className="text-[#00AEEF] hover:text-[#35C1F4] transition-colors">
                Services page
              </Link>
              . Specific commercial terms and service levels for a given engagement are set out in a
              separate service agreement or order form between Orian and the client.
            </p>
          </Section>

          <Section title="3. Acceptable Use">
            <p>You agree not to use our website or services to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Send unsolicited, unlawful, fraudulent, or DLT-non-compliant messaging content</li>
              <li>Violate any applicable law, regulation, or TRAI guideline</li>
              <li>Infringe the intellectual property or privacy rights of others</li>
              <li>Attempt to gain unauthorized access to our systems, admin panel, or another user's account</li>
              <li>Interfere with or disrupt the integrity or performance of our platform</li>
            </ul>
          </Section>

          <Section title="4. Compliance & DLT Registration">
            <p>
              Clients using our bulk SMS services are responsible for ensuring their entity, sender headers and
              message templates are registered as required under TRAI's DLT framework. Orian's compliance desk
              assists with this process, but the client remains responsible for the lawfulness of message content
              sent through our platform.
            </p>
          </Section>

          <Section title="5. Intellectual Property">
            <p>
              All content on this website — including text, graphics, logos and diagrams — is the property of
              Orian Tele Services Private Limited or its licensors and is protected by applicable intellectual
              property laws. You may not reproduce, distribute or create derivative works from this content without
              our prior written consent.
            </p>
          </Section>

          <Section title="6. Service Availability">
            <p>
              While we target high uptime across our network, we do not guarantee uninterrupted or error-free
              access to our website or services. Specific uptime commitments, where applicable, are set out in the
              relevant service agreement.
            </p>
          </Section>

          <Section title="7. Limitation of Liability">
            <p>
              To the maximum extent permitted by law, Orian shall not be liable for any indirect, incidental or
              consequential damages arising from your use of our website or services. Our total liability for any
              claim arising from a service engagement is limited as set out in the applicable service agreement.
            </p>
          </Section>

          <Section title="8. Termination">
            <p>
              We may suspend or terminate access to our website or services for any user who violates these Terms.
              Termination of a specific client service engagement is governed by the terms of that client's service
              agreement.
            </p>
          </Section>

          <Section title="9. Governing Law">
            <p>
              These Terms are governed by the laws of India, and any disputes arising from them shall be subject to
              the exclusive jurisdiction of the courts in Nagpur, Maharashtra.
            </p>
          </Section>

          <Section title="10. Changes to These Terms">
            <p>
              We may update these Terms from time to time. Material changes will be reflected by updating the "Last
              updated" date above. Continued use of our website or services after changes take effect constitutes
              acceptance of the revised Terms.
            </p>
          </Section>

          <Section title="11. Contact Us">
            <p>
              Questions about these Terms can be sent through our{' '}
              <Link to="/contact" className="text-[#00AEEF] hover:text-[#35C1F4] transition-colors">
                Contact page
              </Link>{' '}
              or call our 24/7 helpline.
            </p>
          </Section>
        </div>
      </section>
    </>
  );
};

export default TermsPage;
