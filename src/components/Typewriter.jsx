import React, { useEffect, useState } from 'react';

/**
 * Classic typewriter / text-cycling effect: types a word out letter by
 * letter, pauses, deletes it, then types the next word in the list — with
 * a blinking cursor the whole time. Modeled on the GoDaddy careers-page
 * "Be part of our culture" hero.
 *
 * Respects prefers-reduced-motion by just showing the first word, static.
 */
const Typewriter = ({
  words,
  typingSpeed = 70,
  deletingSpeed = 40,
  pauseDuration = 1400,
  className = '',
}) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [phase, setPhase] = useState('typing'); // typing | pausing | deleting
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mql.matches);
    const handler = (e) => setReduceMotion(e.matches);
    mql.addEventListener ? mql.addEventListener('change', handler) : mql.addListener(handler);
    return () => {
      mql.removeEventListener ? mql.removeEventListener('change', handler) : mql.removeListener(handler);
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setText(words[0] || '');
      return undefined;
    }

    const current = words[wordIndex % words.length];
    let timeout;

    if (phase === 'typing') {
      if (text.length < current.length) {
        timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), typingSpeed);
      } else {
        timeout = setTimeout(() => setPhase('pausing'), pauseDuration);
      }
    } else if (phase === 'pausing') {
      timeout = setTimeout(() => setPhase('deleting'), 0);
    } else if (phase === 'deleting') {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(current.slice(0, text.length - 1)), deletingSpeed);
      } else {
        setWordIndex((i) => (i + 1) % words.length);
        setPhase('typing');
      }
    }

    return () => clearTimeout(timeout);
  }, [text, phase, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration, reduceMotion]);

  return (
    <span className={className}>
      {text}
      <span className="inline-block w-[2px] h-[0.9em] -mb-0.5 ml-0.5 bg-current animate-[typewriterBlink_1s_step-end_infinite]" />
    </span>
  );
};

export default Typewriter;
