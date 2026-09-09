import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { name: 'Home', href: '/' },
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
            className="text-[var(--text-soft)] hover:text-[var(--text)] focus:outline-none p-2"
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[var(--bg)] border-b border-[var(--border)] px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              end={link.href === '/'}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block text-base transition-colors ${isActive ? 'text-[#00AEEF]' : 'text-[var(--text-soft)] hover:text-[#00AEEF]'}`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <Link
            to="/assistant"
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center justify-center w-full px-5 py-3 text-xs font-semibold tracking-wider text-black bg-[#00AEEF] rounded-full shadow-[0_0_15px_rgba(0,174,239,0.4)]"
          >
            GET STARTED
          </Link>
        </div>
      )}
    </header>
  );
};

export default Nav;
