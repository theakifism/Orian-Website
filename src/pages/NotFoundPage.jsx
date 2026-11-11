import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../seo/Seo';
import { notFoundMeta } from '../seo/pageMeta';
import { RobotDoodle } from '../components/DoodleIcons';

const NotFoundPage = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center pt-32 pb-20 bg-transparent overflow-hidden">
      <Seo title={notFoundMeta.title} description={notFoundMeta.description} path={notFoundMeta.path} noindex />
      <div className="max-w-2xl mx-auto px-6 text-center relative z-10 space-y-6">
        <RobotDoodle className="mx-auto mb-6" />
        <p className="text-7xl md:text-9xl font-black tracking-tight text-[#00AEEF]">
          404
        </p>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--text)] tracking-tight">
          This route <span className="text-[#00AEEF]">dropped a packet.</span>
        </h1>
        <p className="text-[var(--text-dim)] text-sm md:text-base max-w-md mx-auto">
          The page you're looking for doesn't exist — or it moved. Try one of the links below.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link to="/" className="px-6 py-3 bg-[#00AEEF] text-black font-semibold rounded-xl text-sm hover:bg-[#35C1F4] transition-colors">
            Back to Home
          </Link>
          <Link to="/services" className="px-6 py-3 bg-[var(--overlay)] border border-[var(--border)] text-[var(--text-soft)] rounded-xl text-sm hover:bg-[var(--overlay-strong)] transition-colors">
            Browse Services
          </Link>
          <Link to="/contact" className="px-6 py-3 bg-[var(--overlay)] border border-[var(--border)] text-[var(--text-soft)] rounded-xl text-sm hover:bg-[var(--overlay-strong)] transition-colors">
            Contact Us
          </Link>
        </div>
        <nav aria-label="Key pages" className="pt-4 text-sm text-[var(--text-dim)]">
          <p className="mb-2">Popular pages</p>
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            <li><Link to="/services/bulk-sms-otp-gateways" className="underline underline-offset-2 hover:text-[#00AEEF]">Bulk SMS &amp; OTP gateway</Link></li>
            <li><Link to="/industries" className="underline underline-offset-2 hover:text-[#00AEEF]">Industries</Link></li>
            <li><Link to="/why-us" className="underline underline-offset-2 hover:text-[#00AEEF]">Why Orian</Link></li>
            <li><Link to="/resources" className="underline underline-offset-2 hover:text-[#00AEEF]">Guides</Link></li>
            <li><Link to="/developers" className="underline underline-offset-2 hover:text-[#00AEEF]">Developers</Link></li>
          </ul>
        </nav>
      </div>
    </section>
  );
};

export default NotFoundPage;
