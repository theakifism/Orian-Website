import React, { useState } from 'react';

const URL_TEXT = 'www.orianteleservices.com';

/**
 * Brief branded loading screen: types out the site URL with a blinking cursor, then fades away.
 *
 * It is driven entirely by CSS animations (see .o2-splash in index.css), so it starts at first
 * paint and does not wait for JavaScript to load and hydrate. The old version typed with
 * setTimeout after hydration, which held the real content behind a blank overlay for seconds on
 * slow phones and pushed LCP past 3s. An inline script in index.html marks the session as seen,
 * so the splash plays once per browser session. It is also skipped for prefers-reduced-motion.
 * Purely decorative, so hidden from assistive tech; the page content is already in the HTML.
 */
const TypingPreloader = () => {
  const [done, setDone] = useState(false);
  if (done) return null;
  return (
    <div
      className="o2-splash"
      aria-hidden="true"
      onAnimationEnd={(e) => {
        if (e.animationName === 'o2-splash-out') setDone(true);
      }}
    >
      <p className="o2-splash-text">
        <span className="o2-splash-type">{URL_TEXT}</span>
        <span className="o2-splash-cursor" />
      </p>
    </div>
  );
};

export default TypingPreloader;
