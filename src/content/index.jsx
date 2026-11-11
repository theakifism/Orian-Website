/* eslint-disable react-refresh/only-export-components -- tiny static stand-in for the removed page editor; keeps the original export names */
import { buildData } from './build-data.js';

// Static content helpers.
//
// The site used to read its text through an admin "page editor". That editor
// has been removed, so these helpers now simply return the text and data that
// ships in the code. They keep the same names so <T k="..." d="..." /> and the
// useTx / useData / useCollection calls in the components keep working, and a
// future editor could be plugged back in here without touching the pages.

/** <T k="About.1" d="About Us" /> renders its default text. */
export function T({ d }) {
  return d;
}

/** const t = useTx();  t('Key', 'default') */
export function useTx() {
  return (key, fallback) => fallback;
}

/** Lists / objects: the value that ships in the code. */
export function useData(name, fallback) {
  return fallback;
}

export function useCollection(name) {
  return buildData(name);
}

/** Wraps the app. Nothing to load any more, so it just renders its children. */
export function ContentProvider({ children }) {
  return children;
}

/** Content ships in the code, so it is always ready (no loading state). */
export function useContentReady() {
  return true;
}

/** findBySlug(list, 'sms') -> the item with that slug, or undefined. */
export function findBySlug(list, slug) {
  return Array.isArray(list) ? list.find((x) => x.slug === slug) : undefined;
}
