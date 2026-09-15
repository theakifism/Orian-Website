import React from 'react';

const MAP_SRC =
  'https://www.google.com/maps?q=Plot%20no%202%2C%20Kgn%20Nagar%2C%20near%20St%20Joseph%20School%2C%20Godhni%2C%20Nagpur%2C%20Maharashtra%20441123&output=embed';

const DIRECTIONS_URL =
  'https://www.google.com/maps/dir/?api=1&destination=Plot+no+2%2C+Kgn+Nagar%2C+near+St+Joseph+School%2C+Godhni%2C+Nagpur%2C+Maharashtra+441123';

/**
 * Google Maps embed wrapped in a compact "HUD" frame — corner brackets,
 * a scanning sweep line, a radar-style ping over the marker, and a live
 * status chip. Pure CSS/SVG on top of the existing iframe, so it stays
 * cheap and doesn't touch the map's own rendering.
 *
 * `compact` trims the header/footer chrome for tighter spots (e.g. a
 * grid card on the home page) while keeping the same frame styling.
 */
const MapEmbed = ({ className = '', compact = false }) => {
  return (
    <div
      className={`group relative rounded-2xl overflow-hidden border border-[var(--border-strong)] shadow-[var(--shadow-ambient)] hover:border-[#00AEEF]/50 transition-all duration-500 ${className}`}
    >
      {/* Corner brackets */}
      <span className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-[#00AEEF]/70 rounded-tl-md pointer-events-none z-20" />
      <span className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-[#00AEEF]/70 rounded-tr-md pointer-events-none z-20" />
      <span className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-[#00AEEF]/70 rounded-bl-md pointer-events-none z-20" />
      <span className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-[#00AEEF]/70 rounded-br-md pointer-events-none z-20" />

      {/* Scanning sweep */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        <div className="map-scan-line absolute left-0 right-0 h-24 bg-gradient-to-b from-transparent via-[#00AEEF]/15 to-transparent" />
      </div>

      {/* Faint targeting grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.15] mix-blend-overlay"
        style={{
          backgroundImage:
            'linear-gradient(to right, #00AEEF 1px, transparent 1px), linear-gradient(to bottom, #00AEEF 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <iframe
        title="Orian Teleservices Location"
        src={MAP_SRC}
        width="100%"
        height="100%"
        style={{ border: 0, filter: 'var(--map-filter)' }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full min-h-[180px]"
      />

      {/* Live location chip */}
      <div className={`absolute top-3 left-3 z-20 flex items-center gap-1.5 ${compact ? 'px-2 py-1.5 text-[10px]' : 'px-3 py-2 text-xs'} bg-black/80 backdrop-blur-md rounded-xl border border-white/10 font-mono text-white pointer-events-none`}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00AEEF] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00AEEF]" />
        </span>
        <span className="text-[#00AEEF] font-bold">Orian HQ</span>
        {!compact && <span className="text-white/60">&bull; Nagpur, India</span>}
      </div>

      {/* Directions CTA */}
      {!compact && (
        <a
          href={DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 right-4 z-20 inline-flex items-center gap-1.5 px-3 py-2 bg-[#00AEEF] text-black text-[11px] font-bold uppercase tracking-wider rounded-lg shadow-[0_0_15px_rgba(0,174,239,0.5)] hover:bg-[#E8A23D] hover:shadow-[0_0_20px_rgba(232,162,61,0.6)] transition-all duration-300"
        >
          Get Directions &rarr;
        </a>
      )}
    </div>
  );
};

export default MapEmbed;
