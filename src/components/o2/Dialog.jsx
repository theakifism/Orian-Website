import React, { useEffect, useRef } from 'react';
import { Close } from './Icons';

/**
 * Accessible modal: role=dialog, labelled, Esc to close, focus moves in and is
 * trapped, page scroll locked, focus returns to the opener on close.
 */
const Dialog = ({ title, onClose, wide = false, className = '', icon = null, subtitle = null, headerRight = null, children }) => {
  const ref = useRef(null);

  useEffect(() => {
    const opener = document.activeElement;
    const node = ref.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusable = () => node.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])');
    // A field marked data-autofocus wins; otherwise skip the close button when there is a field.
    const first = node.querySelector('[data-autofocus]') || focusable()[1] || focusable()[0];
    first?.focus();

    // Listen on the document, not the dialog: when a control inside is replaced (for example the
    // form's submit button after a successful submit) focus falls back to <body>, and Escape
    // must still close the dialog.
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose(); return; }
      if (e.key !== 'Tab') return;
      const items = Array.from(focusable());
      if (!items.length) return;
      const a = items[0];
      const z = items[items.length - 1];
      const active = document.activeElement;
      if (!node.contains(active)) { e.preventDefault(); a.focus(); }
      else if (e.shiftKey && active === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && active === z) { e.preventDefault(); a.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="o2 o2-scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={ref} className={`o2-dialog${wide ? ' is-wide' : ''}${className ? ` ${className}` : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="o2-dialog-head">
          {icon || subtitle ? (
            <div className="o2-head-id">
              {icon}
              <div className="o2-head-title">
                <h2>{title}</h2>
                {subtitle && <span className="o2-head-sub">{subtitle}</span>}
              </div>
            </div>
          ) : (
            <h2>{title}</h2>
          )}
          <div className="o2-head-right">
            {headerRight}
            <button type="button" className="o2-x" onClick={onClose} aria-label="Close"><Close width="14" height="14" /></button>
          </div>
        </div>
        <div className="o2-dialog-body">{children}</div>
      </div>
    </div>
  );
};

export default Dialog;
