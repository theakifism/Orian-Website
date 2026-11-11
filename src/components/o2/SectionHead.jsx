import React from 'react';
import useInView from '../../hooks/useInView';

/** Server-rendered section heading with the shared reveal. */
const SectionHead = ({ eyebrow, title, lead, center = false, as: H = 'h2' }) => {
  const [ref, cls] = useInView();
  return (
    <div ref={ref} className={`o2-sec-head${center ? ' is-center' : ''} ${cls}`}>
      {eyebrow && <span className="o2-eyebrow"><i />{eyebrow}</span>}
      <H className="o2-h2">{title}</H>
      {lead && <p className="o2-lead">{lead}</p>}
    </div>
  );
};

export default SectionHead;
