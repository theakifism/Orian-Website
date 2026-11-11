import React from 'react';

/**
 * Small, precise animated icons (the site's "doodles").
 *
 * One consistent set: 48x48 grid, 2px rounded strokes, a soft tinted fill
 * and a single accent colour per icon, each with one small, purposeful
 * animation (a check that draws itself, bars that grow, a stopwatch hand,
 * typing dots...). They are meant to be used SMALL -- 48 to 80px, as a
 * marker on a card or process step -- never as hero art.
 *
 * `color`  accent colour (strokes, fill tint, tile background)
 * `tile`   draw the rounded-square tile behind the glyph (default true);
 *          pass tile={false} to place the bare glyph inside your own badge
 *
 * Motion classes live in the "Icon motion" block of index.css and switch off
 * for prefers-reduced-motion. Export names are unchanged from the old
 * illustration set, so existing imports keep working.
 */

// Icons are always rendered at one small, fixed size (a 48px tile) no matter
// what size classes a caller passes -- big illustration-sized icons looked
// heavy, so only spacing/alignment classes (mb-*, mx-auto, shrink-0...) are kept.
const keepClasses = (className = '') =>
  className
    .split(/\s+/)
    .filter((c) => c && !/^(?:[a-z]+:)?(?:w|h|size)-/.test(c))
    .join(' ');

const Icon = ({ color, className = '', tile = true, children }) => (
  <svg
    viewBox="0 0 48 48"
    className={`dd-svg w-12 h-12 shrink-0 ${keepClasses(className)}`}
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    {tile && (
      <rect x="0.75" y="0.75" width="46.5" height="46.5" rx="12" fill={color} fillOpacity="0.08" strokeOpacity="0.2" strokeWidth="1.25" />
    )}
    {children}
  </svg>
);

const tint = (color) => ({ fill: color, fillOpacity: 0.18 });
const solid = (color) => ({ fill: color, stroke: 'none' });
const delay = (s) => ({ animationDelay: `${s}s` });

/* 1. Team */
export const TeamDoodle = ({ color = '#00AEEF', className, tile }) => (
  <Icon color={color} className={className} tile={tile}>
    <g className="pd-float" style={delay(0.6)}>
      <circle cx="12.5" cy="22" r="3.2" {...tint(color)} />
      <path d="M7.5 34c0-3 2.2-5 5-5" />
    </g>
    <g className="pd-float" style={delay(1.2)}>
      <circle cx="35.5" cy="22" r="3.2" {...tint(color)} />
      <path d="M40.5 34c0-3-2.2-5-5-5" />
    </g>
    <g className="pd-float">
      <circle cx="24" cy="17" r="5" {...tint(color)} />
      <path d="M14.5 37c0-5.5 4.2-9 9.5-9s9.5 3.5 9.5 9" />
    </g>
  </Icon>
);

/* 2. Mail */
export const MailDoodle = ({ color = '#00AEEF', className, tile }) => (
  <Icon color={color} className={className} tile={tile}>
    <rect x="9" y="15" width="30" height="21" rx="4.5" {...tint(color)} />
    <path d="M10.5 17.5L24 28l13.5-10.5" />
    <circle className="pd-pop" cx="37" cy="14" r="4.5" {...solid(color)} />
  </Icon>
);

/* 3. Phone (OTP / SMS) */
export const PhoneDoodle = ({ color = '#00AEEF', className, tile }) => (
  <Icon color={color} className={className} tile={tile}>
    <rect x="14.5" y="8" width="19" height="32" rx="4.5" {...tint(color)} />
    <path d="M21 11.5h6" strokeOpacity="0.6" />
    <rect className="pd-pop" x="18.5" y="16.5" width="11" height="7" rx="2.5" {...solid(color)} />
    {[20.5, 24, 27.5].map((x, i) => (
      <circle key={x} className="pd-typing" style={delay(i * 0.2)} cx={x} cy="31.5" r="1.4" {...solid(color)} />
    ))}
  </Icon>
);

/* 4. Headset */
export const HeadsetDoodle = ({ color = '#00AEEF', className, tile }) => (
  <Icon color={color} className={className} tile={tile}>
    <path d="M11.5 27v-3a12.5 12.5 0 0 1 25 0v3" />
    <rect x="8.5" y="25.5" width="6" height="10" rx="3" {...tint(color)} />
    <rect x="33.5" y="25.5" width="6" height="10" rx="3" {...tint(color)} />
    <path d="M36.5 35.5c0 3.5-3 5-8.5 5" />
    <circle cx="27.5" cy="40.5" r="1.6" {...solid(color)} />
    {[[21, 0], [24, 0.25], [27, 0.5]].map(([x, d]) => (
      <path key={x} className="pd-eq" style={delay(d)} d={`M${x} 20.5v7`} strokeWidth="2.2" />
    ))}
  </Icon>
);

/* 5. Shield (compliance / security) */
export const ShieldDoodle = ({ color = '#00AEEF', className, tile }) => (
  <Icon color={color} className={className} tile={tile}>
    <path d="M24 8.5l13 4.8v9.2c0 8.6-5.6 14.2-13 17-7.4-2.8-13-8.4-13-17v-9.2z" {...tint(color)} />
    <path className="pd-draw" pathLength="1" d="M17.5 24l4.8 4.8L31 19.5" />
  </Icon>
);

/* 6. Chat (WhatsApp / messaging) */
export const ChatDoodle = ({ color = '#00AEEF', className, tile }) => (
  <Icon color={color} className={className} tile={tile}>
    <path d="M12.5 11h23a4.5 4.5 0 0 1 4.5 4.5v11a4.5 4.5 0 0 1-4.5 4.5H24.5l-8 6.5V31h-4A4.5 4.5 0 0 1 8 26.5v-11A4.5 4.5 0 0 1 12.5 11z" transform="translate(0 -1)" {...tint(color)} />
    {[17.5, 24, 30.5].map((x, i) => (
      <circle key={x} className="pd-typing" style={delay(i * 0.2)} cx={x} cy="20.5" r="1.9" {...solid(color)} />
    ))}
  </Icon>
);

/* 7. Globe (worldwide reach) */
export const GlobeDoodle = ({ color = '#00AEEF', className, tile }) => (
  <Icon color={color} className={className} tile={tile}>
    <circle cx="24" cy="24" r="14.5" {...tint(color)} />
    <path d="M9.5 24h29" strokeWidth="1.6" />
    <path d="M12 17.5h24M12 30.5h24" strokeWidth="1.5" strokeOpacity="0.55" />
    <ellipse className="pd-meridian" cx="24" cy="24" rx="6.5" ry="14.5" strokeWidth="1.6" />
    <circle className="pd-ring" cx="33" cy="16.5" r="3" strokeWidth="1.4" />
    <circle cx="33" cy="16.5" r="2" {...solid(color)} />
  </Icon>
);

/* 8. Route (carrier network) */
export const RouteDoodle = ({ color = '#00AEEF', className, tile }) => {
  const nodes = [[11.5, 12], [36.5, 12], [11.5, 36], [36.5, 36]];
  return (
    <Icon color={color} className={className} tile={tile}>
      {nodes.map(([x, y]) => (
        <path key={`l${x}${y}`} d={`M${x} ${y}L24 24`} strokeWidth="1.6" strokeOpacity="0.55" />
      ))}
      {nodes.map(([x, y]) => (
        <circle key={`n${x}${y}`} cx={x} cy={y} r="3.6" {...tint(color)} />
      ))}
      <circle cx="24" cy="24" r="5.2" {...solid(color)} />
      {nodes.map(([x, y], i) => (
        <circle key={`p${x}${y}`} r="1.7" {...solid(color)}>
          <animateMotion dur="2.4s" begin={`-${i * 0.6}s`} repeatCount="indefinite" path={`M${x} ${y}L24 24`} />
        </circle>
      ))}
    </Icon>
  );
};

/* 9. Rocket (launch / go-live) */
export const RocketDoodle = ({ color = '#00AEEF', className, tile }) => (
  <Icon color={color} className={className} tile={tile}>
    <g className="pd-lift">
      <path d="M24 7.5c6 4.8 8.2 11.8 7 20.5H17c-1.2-8.7 1-15.7 7-20.5z" {...tint(color)} />
      <circle cx="24" cy="18.5" r="2.7" {...solid(color)} />
      <path d="M17.5 23.5L12.5 31l5.5-1.5M30.5 23.5l5 7.5-5.5-1.5" />
      <path className="pd-flicker" d="M21 32c.6 4.2 1.6 6.2 3 8 1.4-1.8 2.4-3.8 3-8z" {...solid(color)} />
    </g>
  </Icon>
);

/* 10. Chart (growth / analytics) */
export const ChartDoodle = ({ color = '#00AEEF', className, tile }) => (
  <Icon color={color} className={className} tile={tile}>
    <path d="M9.5 38.5h29" strokeWidth="1.8" />
    {[[12, 26, 12, 0], [21, 19.5, 18.5, 0.25], [30, 12.5, 25.5, 0.5]].map(([x, y, h, d]) => (
      <rect key={x} className="pd-bar" style={delay(d)} x={x} y={y} width="6.5" height={h} rx="2" {...tint(color)} />
    ))}
  </Icon>
);

/* 11. Speed (instant delivery) -- stopwatch */
export const ClockDoodle = ({ color = '#00AEEF', className, tile }) => (
  <Icon color={color} className={className} tile={tile}>
    <path d="M21.5 8h5M24 8v3.5" />
    <circle cx="24" cy="26.5" r="13.5" {...tint(color)} />
    <path d="M24 15.5v1.6M35 26.5h-1.6M24 37.5v-1.6M13 26.5h1.6" strokeWidth="1.6" strokeOpacity="0.6" />
    <g className="pd-hand" style={{ transformBox: 'view-box', transformOrigin: '24px 26.5px' }}>
      <path d="M24 26.5V18" strokeWidth="2.2" />
    </g>
    <circle cx="24" cy="26.5" r="1.8" {...solid(color)} />
  </Icon>
);

/* 12. AI assistant */
export const RobotDoodle = ({ color = '#00AEEF', className, tile }) => (
  <Icon color={color} className={className} tile={tile}>
    <path d="M22.5 12Q22.5 24 34.5 24Q22.5 24 22.5 36Q22.5 24 10.5 24Q22.5 24 22.5 12z" {...tint(color)} />
    <path className="pd-twinkle" d="M35 8.5Q35 13 39.5 13Q35 13 35 17.5Q35 13 30.5 13Q35 13 35 8.5z" {...solid(color)} />
    <path className="pd-twinkle" style={delay(1.1)} d="M36.5 31.5Q36.5 34.5 39.5 34.5Q36.5 34.5 36.5 37.5Q36.5 34.5 33.5 34.5Q36.5 34.5 36.5 31.5z" {...solid(color)} />
  </Icon>
);

export const SocialDoodle = ({ color = '#EC4899', className, tile }) => (
  <Icon color={color} className={className} tile={tile}>
    <circle cx="16" cy="24" r="4.5" {...tint(color)} />
    <circle cx="32" cy="15" r="4.5" {...tint(color)} />
    <circle cx="32" cy="33" r="4.5" {...tint(color)} />
    <path d="M20 22l8-5M20 26l8 5" />
  </Icon>
);

export const CodeDoodle = ({ color = '#3B82F6', className, tile }) => (
  <Icon color={color} className={className} tile={tile}>
    <rect x="9" y="12" width="30" height="24" rx="3.5" {...tint(color)} />
    <path d="M19 20l-4 4 4 4M29 20l4 4-4 4M25.5 19l-3 10" />
  </Icon>
);
