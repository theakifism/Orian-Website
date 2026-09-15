import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../seo/Seo';
import { notFoundMeta } from '../seo/pageMeta';
import Interactive3DNetwork from '../components/Interactive3DNetwork';

const NotFoundPage = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center pt-32 pb-20 bg-transparent overflow-hidden">
      <Seo title={notFoundMeta.title} description={notFoundMeta.description} path={notFoundMeta.path} noindex />
      <div className="max-w-2xl mx-auto px-6 text-center relative z-10 space-y-6">
        <Interactive3DNetwork size={220} className="mx-auto" />
        <span className="text-xs font-mono tracking-widest text-[#E8A23D] uppercase">404</span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--text)] tracking-tight">
          This route <span className="bg-gradient-to-r from-[#00AEEF] to-purple-500 bg-clip-text text-transparent">dropped a packet.</span>
        </h1>
        <p className="text-[var(--text-dim)] text-sm md:text-base max-w-md mx-auto">
          The page you're looking for doesn't exist — or it moved. Try one of the links below.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link to="/" className="px-6 py-3 bg-[#00AEEF] text-black font-semibold rounded-xl text-sm hover:bg-[#E8A23D] transition-colors">
            Back to Home
          </Link>
          <Link to="/services" className="px-6 py-3 bg-[var(--overlay)] border border-[var(--border)] text-[var(--text-soft)] rounded-xl text-sm hover:bg-[var(--overlay-strong)] transition-colors">
            Browse Services
          </Link>
          <Link to="/contact" className="px-6 py-3 bg-[var(--overlay)] border border-[var(--border)] text-[var(--text-soft)] rounded-xl text-sm hover:bg-[var(--overlay-strong)] transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
