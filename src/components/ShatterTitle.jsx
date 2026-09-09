import React, { useEffect, useMemo, useRef, useState } from "react";
import { useScrollFX } from "../context/ScrollFXContext";

export default function ShatterTitle({ text = "ORIAN", caption }) {
  const wrapRef = useRef(null);
  const [assembled, setAssembled] = useState(false);
  const { reduceMotion } = useScrollFX();
  const chars = text.split("");

  const offsets = useMemo(
    () =>
      chars.map(() => ({
        x: (Math.random() - 0.5) * 260,
        y: (Math.random() - 0.5) * 160,
        r: (Math.random() - 0.5) * 60,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [text]
  );

  useEffect(() => {
    if (reduceMotion) return undefined;
    const el = wrapRef.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setAssembled(entry.isIntersecting),
      { threshold: 0.45 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduceMotion]);

  // On mobile/reduce-motion, skip the fly-in-and-assemble effect entirely
  // and just show the title already assembled and static.
  const isAssembled = reduceMotion || assembled;

  return (
    <section
      ref={wrapRef}
            className="min-h-[60vh] flex flex-col items-center justify-center gap-6 bg-transparent overflow-hidden"
    >
      <h2 className="flex font-black font-[Archivo,sans-serif] tracking-wide text-[clamp(56px,16vw,220px)] text-[var(--text)]">
        {chars.map((c, i) => {
          const o = offsets[i];
          const progress = isAssembled ? 1 : 0;
          const x = reduceMotion ? 0 : o.x * (1 - progress);
          const y = reduceMotion ? 0 : o.y * (1 - progress);
          const r = reduceMotion ? 0 : o.r * (1 - progress);
          return (
            <span
              key={i}
              className={reduceMotion ? 'inline-block' : 'inline-block transition-all duration-[600ms]'}
              style={{
                transform: `translate(${x}px, ${y}px) rotate(${r}deg)`,
                opacity: reduceMotion ? 1 : 0.25 + 0.75 * progress,
                transitionTimingFunction: "cubic-bezier(.22,1,.36,1)",
              }}
            >
              {c === " " ? "\u00A0" : c}
            </span>
          );
        })}
      </h2>
      {caption && (
        <p className="text-[var(--text-faint)] text-sm tracking-wider uppercase text-center px-6">{caption}</p>
      )}
    </section>
  );
}
