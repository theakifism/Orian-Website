import React from 'react';
import { IMAGE_SLOTS } from '../../config/site';
import { photoProps } from '../../utils/photo';

/**
 * A place for a generated photo. Set `src` (a path inside src/assets/images, e.g. 'o2/uc-otp.webp') for the slot in config/site.js and it
 * renders the image; until then a quiet labelled frame holds the space so the
 * layout can be reviewed. Never fills with a stand-in image.
 */
const ImageSlot = ({ name, alt = '', className = '' }) => {
  const slot = IMAGE_SLOTS[name];
  if (!slot) return null;
  const style = { aspectRatio: `${slot.w} / ${slot.h}` };
  const props = slot.src ? photoProps(slot.src, '(min-width: 1024px) 50vw, 100vw') : {};
  if (props.src) {
    return (
      <div className={`o2-slot has-img ${className}`} style={style}>
        <img {...props} alt={alt} loading="lazy" decoding="async" />
      </div>
    );
  }
  return (
    <div className={`o2-slot ${className}`} style={style} role="img" aria-label={`Image placeholder: ${slot.label}`}>
      <span>Image slot: {slot.label}<br />{slot.w} x {slot.h}</span>
    </div>
  );
};

export default ImageSlot;
