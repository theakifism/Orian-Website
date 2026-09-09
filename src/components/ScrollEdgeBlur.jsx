import React from 'react';
import { useScrollFX } from '../context/ScrollFXContext';

// Fixed blur/fade strips pinned to the top and bottom of the viewport.
// They hint that there's more content to scroll to, and fade out once
// you actually reach the top or bottom of the page.
const ScrollEdgeBlur = () => {
  const { atTop, atBottom } = useScrollFX();

  return (
    <>
      <div
        aria-hidden="true"
        className={`scroll-edge-blur scroll-edge-blur-top ${atTop ? '' : 'is-visible'}`}
      />
      <div
        aria-hidden="true"
        className={`scroll-edge-blur scroll-edge-blur-bottom ${atBottom ? '' : 'is-visible'}`}
      />
    </>
  );
};

export default ScrollEdgeBlur;
