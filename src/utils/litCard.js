/**
 * The "lit card" hover treatment used on every card across the site —
 * the Why Choose Orian cards, Services, Industries, Careers stat blocks,
 * checklist chips, and every other bordered card/tile.
 *
 * Behavior (identical everywhere it's used):
 *  - While the cursor is over the card, it tilts toward the cursor in 3D.
 *  - The instant the cursor enters, the border and a soft glow switch on
 *    in the card's own accent color.
 *  - Moving the cursor away only resets the tilt — the border color and
 *    glow are never turned back off, so any card that's ever been
 *    hovered stays lit in its color for the rest of the page visit.
 *
 * Usage: spread the returned object directly onto the element that
 * carries the `border` class (a <Link> or <div>), e.g.
 *   <Link className="... border ..." {...litCardProps(color, glow)}>
 *
 * Pass `tilt: false` for small chips that shouldn't rotate in 3D (e.g. a
 * checklist row) but should still light up and stay lit.
 */
export const litCardProps = (color, glow, { tilt = true } = {}) => {
  const props = {
    style: { boxShadow: '0 10px 30px -10px transparent' },
    onMouseEnter: (e) => {
      e.currentTarget.style.boxShadow = `0 20px 40px -10px ${glow}`;
      e.currentTarget.style.borderColor = color;
    },
  };

  if (!tilt) return props;

  // Perf note: getBoundingClientRect() forces a synchronous layout
  // recalculation, so it must never be called on every mousemove event —
  // that was making the whole site feel laggy once this hover was on
  // every card. It's read once per hover (the card's size doesn't change
  // while you're on it) and the actual transform write is batched to one
  // per animation frame via requestAnimationFrame, instead of one per raw
  // mouse event, so fast mouse movement can't flood the render pipeline.
  let rect = null;
  let rafId = null;
  let pendingEvent = null;

  props.onMouseEnter = (e) => {
    e.currentTarget.style.boxShadow = `0 20px 40px -10px ${glow}`;
    e.currentTarget.style.borderColor = color;
    rect = e.currentTarget.getBoundingClientRect();
  };

  props.onMouseMove = (e) => {
    pendingEvent = e;
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      if (!rect || !pendingEvent) return;
      const target = pendingEvent.currentTarget;
      const x = pendingEvent.clientX - rect.left - rect.width / 2;
      const y = pendingEvent.clientY - rect.top - rect.height / 2;
      target.style.transform = `perspective(1000px) rotateX(${-y / 12}deg) rotateY(${x / 12}deg) translateZ(10px) scale(1.03)`;
    });
  };

  props.onMouseLeave = (e) => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    rect = null;
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)';
  };

  return props;
};
