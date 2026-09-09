import React, { useEffect, useState, useRef } from 'react';

const AnimatedCounter = ({ end, duration = 2000, suffix = '', decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTime = null;

          const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easeOutQuad = 1 - Math.pow(1 - progress, 3);
            setCount(progress * end);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={countRef}>
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;