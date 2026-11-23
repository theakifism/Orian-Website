import { useEffect } from 'react';
import { useRouteError } from 'react-router-dom';

/**
 * User-friendly fallback for route rendering and lazy-chunk failures.
 * Keep the technical details in the browser console rather than exposing
 * framework errors to visitors.
 */
const RouteError = () => {
  const error = useRouteError();

  useEffect(() => {
    console.error('Route failed to load:', error);
  }, [error]);

  const reload = () => window.location.reload();

  return (
    <main
      role="alert"
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeContent: 'center',
        gap: '1rem',
        padding: '2rem',
        background: '#080a0d',
        color: '#f4f7fb',
        font: '16px/1.5 system-ui, sans-serif',
        textAlign: 'center',
      }}
    >
      <p style={{ margin: 0, color: '#00aeef', fontSize: '.8rem', fontWeight: 700, letterSpacing: '.12em' }}>
        ORIAN TELESERVICES
      </p>
      <h1 style={{ margin: 0, fontSize: '1.6rem' }}>We couldn’t open this page.</h1>
      <p style={{ maxWidth: '32rem', margin: 0, color: '#aeb8c6' }}>
        The page may have been updated. Reload it to get the latest version, or return to the home page.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '.75rem', marginTop: '.5rem' }}>
        <button
          type="button"
          onClick={reload}
          style={{ border: 0, borderRadius: '999px', padding: '.8rem 1.3rem', background: '#00aeef', color: '#061018', font: 'inherit', fontWeight: 700, cursor: 'pointer' }}
        >
          Reload page
        </button>
        <a
          href="/"
          style={{ border: '1px solid #39424d', borderRadius: '999px', padding: '.8rem 1.3rem', color: '#f4f7fb', textDecoration: 'none' }}
        >
          Go to home page
        </a>
      </div>
    </main>
  );
};

export default RouteError;
