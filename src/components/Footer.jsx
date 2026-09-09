import React from 'react';
import { Link } from 'react-router-dom';
import { services } from '../data/services';

const FooterCTA = () => {
  return (
    <footer className="relative pt-20 pb-12 overflow-hidden text-white bg-transparent">
      <div className="max-w-7xl mx-auto px-6 space-y-16 relative z-10">

        {/* Address & Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-sm text-gray-300">
          <div className="space-y-3 md:col-span-2">
            <div className="text-white font-bold text-base">Orian Teleservices</div>
            <p className="leading-relaxed">
              Plot no 2, Kgn Nagar, near St Joseph School, Godhni &ndash; 441123, Nagpur, Maharashtra, India
            </p>
            <div className="text-xs text-[#00AEEF] font-mono">24/7 Helpline Support Available</div>
          </div>

          <div className="space-y-2">
            <div className="text-white font-bold text-base">Core Solutions</div>
            <ul className="space-y-1.5 text-xs">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link to={`/services/${service.slug}`} className="hover:text-white transition-colors">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <div className="text-white font-bold text-base">Company</div>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/industries" className="hover:text-white transition-colors">Industries We Serve</Link></li>
              <li><Link to="/why-us" className="hover:text-white transition-colors">Why Choose Orian</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4">
          <div>&copy; {new Date().getFullYear()} Orian Teleservices. All rights reserved.</div>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-gray-200">Privacy Policy</Link>
            <Link to="/" className="hover:text-gray-200">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default FooterCTA;
