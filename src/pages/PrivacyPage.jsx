import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Seo from '../seo/Seo';
import { pageMeta } from '../seo/pageMeta';

const Section = ({ title, children }) => (
  <div className="space-y-3">
    <h2 className="text-xl md:text-2xl font-bold text-(--text) ">{title}</h2>
    <div className="text-sm md:text-base text-(--text-dim) leading-relaxed space-y-3">{children}</div>
  </div>
);

const PrivacyPage = () => {
  return (
    <>
      <Seo title={pageMeta.privacy.title} description={pageMeta.privacy.description} path={pageMeta.privacy.path} />
      <PageHeader
        eyebrow="Legal"
        title="Privacy"
        gradientWord="Policy."
        subtitle="How Orian Teleservices collects, uses and protects your information."
        breadcrumbs={[{ label: 'Privacy Policy' }]}
      />

      <section className="relative pb-24 bg-transparent overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 space-y-10">
          <p className="text-xs font-mono text-(--text-faint)">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <Section title="1. Introduction">
            <p>
              Orian Tele Services Private Limited ("Orian", "we", "us" or "our") provides bulk SMS, voice, WhatsApp
              Business API, DLT compliance, digital marketing and IT solutions services. This Privacy Policy explains
              what information we collect through our website and services, how we use it, and the choices you have.
              By using our website or services, you agree to the practices described here.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <p>We collect information in the following ways:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <span className="text-(--text-soft) font-semibold">Information you provide:</span> name,
                company name, email address, phone number, requirement type and message when you submit an enquiry.
                Enquiry details are stored so our team can respond and manage the request. If you provide a location,
                it may be included in the notification email but is not currently stored in the enquiry record.
              </li>
              <li>
                <span className="text-(--text-soft) font-semibold">Automatically collected information:</span>{' '}
                when visit tracking is available, we store your IP address, browser and device details, pages visited,
                referrer, approximate city and country, and visit timestamps to understand site use and limit abuse.
                A first-party cookie named <code>orian_visitor_id</code> helps link visits and is set for up to one year.
              </li>
              <li>
                <span className="text-(--text-soft) font-semibold">Interaction data:</span> this site records page visits
                and selected interactions for internal reporting. This code does not load a third-party analytics service.
              </li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>To respond to your enquiries and provide the services you request</li>
              <li>To respond to enquiries, send confirmation messages and notify our team</li>
              <li>To understand website usage, prevent abuse and maintain the site's operation</li>
              <li>To comply with applicable legal, regulatory and TRAI/DLT obligations</li>
              <li>To improve our website, services and customer support</li>
            </ul>
          </Section>

          <Section title="4. How We Share Information">
            <p>
              We do not sell your personal information. Enquiry and visit data may be processed by the providers we use
              for database hosting, website hosting, email delivery and spam prevention, only as needed to operate the
              site and respond to you. We may also disclose information when required by law or valid legal process.
            </p>
          </Section>

          <Section title="5. Data Security">
            <p>
              We use reasonable measures to protect information, including encrypted website connections and abuse
              controls on public forms. No method of transmission or storage is completely secure.
            </p>
          </Section>

          <Section title="6. Data Retention">
            <p>
              Website visit records are automatically purged after 90 days. The visitor cookie can remain in your
              browser for up to one year. Enquiry records are kept while needed to handle the request and related
              business or legal records; we do not currently publish a fixed deletion period for those records.
            </p>
          </Section>

          <Section title="7. Your Choices">
            <p>
              You may request access to, correction of, or deletion of your personal information by contacting us
              using the details on our{' '}
              <Link to="/contact" className="text-[#00AEEF] hover:text-[#35C1F4] transition-colors">
                Contact page
              </Link>
              . We will respond to reasonable requests within a reasonable timeframe.
            </p>
          </Section>

          <Section title="8. Children's Privacy">
            <p>
              Our website and services are intended for businesses and are not directed at children. We do not
              knowingly collect personal information from anyone under the age of 18.
            </p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. Material changes will be reflected by updating
              the "Last updated" date above. Continued use of our website after changes take effect constitutes
              acceptance of the revised policy.
            </p>
          </Section>

          <Section title="10. Contact Us">
            <p>
              If you have questions about this Privacy Policy or how we handle your information, reach out via our{' '}
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

export default PrivacyPage;
