import photos, { photoSets } from 'virtual:photos';

/** Public URL for a photo, or undefined when that file does not exist (so no broken <img src>). */
export const photo = (path) => photos[path];

/**
 * <img> attributes for a photo: { src, srcSet, width, height } (spread onto the tag), or {} when
 * the file does not exist. Pass `sizes` yourself, e.g. "(min-width: 1024px) 33vw, 100vw".
 * width/height are the intrinsic size, which reserves space and prevents layout shift.
 */
export const photoProps = (path, sizes) => {
  const s = photoSets[path];
  if (!s) return {};
  return { src: s.src, srcSet: s.srcSet, width: s.width, height: s.height, ...(sizes && s.srcSet ? { sizes } : {}) };
};
