import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { name: 'Why us', href: '/why-us' },
  { name: 'Services', href: '/services' },
  { name: 'Industries', href: '/industries' },
  { name: 'Careers', href: '/careers' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const Nav = ({ theme, onToggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--border)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        <Link
          to="/"
          className="group relative flex items-center h-16 rounded-xl px-2 [perspective:1000px]"
          aria-label="Orian Teleservices Home"
        >
          {/* Icon mark — default state, flips away on hover */}
          <div className="flex items-center gap-3 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] [transform-style:preserve-3d] group-hover:opacity-0 group-hover:[transform:rotateY(100deg)]">
            <img
              src="/logo-icon.png"
              alt="Orian Mark"
              className="h-14 w-14 object-contain drop-shadow-[0_0_16px_rgba(0,174,239,0.65)]"
            />
          </div>

          {/* Full wordmark — flips in from the opposite side */}
          <div className="absolute inset-0 flex items-center gap-3 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] [transform-style:preserve-3d] [transform:rotateY(-100deg)] group-hover:opacity-100 group-hover:[transform:rotateY(0deg)]">
            <img
              src="/logo-full.png"
              alt="Orian Teleservices"
              className="h-24 md:h-28 w-auto object-contain drop-shadow-[0_0_24px_rgba(0,174,239,0.65)]"
            />
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              end={link.href === '/'}
              className={({ isActive }) =>
                `relative text-sm transition-colors duration-200 font-medium py-2 group ${
                  isActive ? 'text-[var(--text)]' : 'text-[var(--text-soft)] hover:text-[var(--text)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.name}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-linear-to-r from-[#00AEEF] to-purple-500 origin-center transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <Link
            to="/assistant"
            className="inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold tracking-wider text-black bg-[#00AEEF] hover:bg-[#E8A23D] transition-all duration-300 rounded-full shadow-[0_0_15px_rgba(0,174,239,0.4)] hover:shadow-[0_0_20px_rgba(232,162,61,0.6)]"
          >
            GET STARTED
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="tap-feedback text-[var(--text-soft)] hover:text-[var(--text)] focus:outline-none p-2 active:scale-90 transition-transform duration-150"
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                className="transition-all duration-300 origin-center"
                style={{
                  transform: isOpen ? 'translateY(6px) rotate(45deg)' : 'none',
                }}
                d="M4 6h16"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                className="transition-opacity duration-200"
                style={{ opacity: isOpen ? 0 : 1 }}
                d="M4 12h16"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                className="transition-all duration-300 origin-center"
                style={{
                  transform: isOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
                }}
                d="M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu: kept mounted (not conditionally rendered) so it can
          animate both open AND closed via a max-height + fade transition,
          instead of just popping in/out with no motion. Links stagger in
          with a short translateX + fade, offset a few ms apart. */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden bg-[var(--bg)]/95 backdrop-blur-md border-b border-[var(--border)] transition-[max-height,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-6 space-y-1">
          {navLinks.map((link, idx) => (
            <NavLink
              key={link.name}
              to={link.href}
              end={link.href === '/'}
              onClick={() => setIsOpen(false)}
              tabIndex={isOpen ? 0 : -1}
              style={{ transitionDelay: isOpen ? `${idx * 40}ms` : '0ms' }}
              className={({ isActive }) =>
                `tap-feedback block text-base py-2.5 transition-all duration-300 ${
                  isActive ? 'text-[#00AEEF]' : 'text-[var(--text-soft)] hover:text-[#00AEEF]'
                } ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'}`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <Link
            to="/assistant"
            onClick={() => setIsOpen(false)}
            tabIndex={isOpen ? 0 : -1}
            style={{ transitionDelay: isOpen ? `${navLinks.length * 40}ms` : '0ms' }}
            className={`tap-feedback inline-flex items-center justify-center w-full mt-3 px-5 py-3.5 text-xs font-semibold tracking-wider text-black bg-[#00AEEF] rounded-full shadow-[0_0_15px_rgba(0,174,239,0.4)] transition-all duration-300 active:scale-[0.97] ${
              isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'
            }`}
          >
            GET STARTED
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Nav;
