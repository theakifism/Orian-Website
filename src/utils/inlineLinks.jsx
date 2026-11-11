import React from 'react';
import { Link } from 'react-router-dom';

/** Turns "see [our guide](/resources/x) for more" into text with a router <Link>. Internal paths only. */
export function renderInline(text) {
  const parts = [];
  const re = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;
  let last = 0;
  let m;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <Link key={i++} to={m[2]} className="text-[#00AEEF] hover:text-[#35C1F4] underline underline-offset-2">
        {m[1]}
      </Link>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}
