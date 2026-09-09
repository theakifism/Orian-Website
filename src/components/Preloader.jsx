import React from 'react';

const Preloader = ({ exiting }) => {
  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[var(--bg)] transition-all duration-700 ease-[cubic-bezier(0.6,0,0.2,1)] ${
        exiting ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      role="status"
      aria-live="polite"
      aria-label="Loading Orian Teleservices"
    >
      {/* Ambient glow backdrop — single static-size blur, only opacity ever animates */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] bg-[#00AEEF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col items-center gap-8">
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Orbiting gradient ring loader */}
          <svg className="preloader-spin absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="preloader-gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00AEEF" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#E8A23D" />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="url(#preloader-gradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="130 400"
            />
          </svg>

          {/* Soft pulsing ripple */}
          <span className="preloader-ripple absolute inset-0 rounded-full border-2 border-[#00AEEF]/30" />

          {/* Static-size blurred glow layer behind the logo — only its opacity
              animates, which the browser can composite cheaply. Animating
              `filter: drop-shadow` directly on the image instead forces an
              expensive repaint every frame, which is what caused the jank. */}
          <span className="preloader-glow absolute w-14 h-14 rounded-full bg-[#00AEEF] blur-lg" />

          {/* Orian "A" mark, pops in once then stays put */}
          <img
            src="/logo-icon.png"
            alt="Orian"
            className="preloader-logo relative w-16 h-16 object-contain"
          />
        </div>

        <div className="flex flex-col items-center gap-3">
          <p className="text-xs font-mono tracking-[0.35em] text-[var(--text-faint)] uppercase">
            Orian Teleservices
          </p>
          <div className="w-44 h-1 bg-(--overlay) rounded-full overflow-hidden">
            <div className="preloader-bar h-full w-1/2 bg-gradient-to-r from-[#00AEEF] via-purple-500 to-[#E8A23D] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
