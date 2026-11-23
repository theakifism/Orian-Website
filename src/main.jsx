import { ViteReactSSG } from 'vite-react-ssg';
import '@fontsource-variable/geist';
import './index.css';
import { routes } from './routes';

// This site does not use React Router route loaders or useLoaderData. By
// supplying an empty manifest, vite-react-ssg can skip fetching its generated
// loader-data manifest on client-side navigation. That manifest is build-hash
// named, so a tab left open across deployments can otherwise request an old
// URL, receive the site's HTML 404 page, and fail while parsing it as JSON.
if (typeof window !== 'undefined') {
  window.__VITE_REACT_SSG_STATIC_LOADER_MANIFEST__ = {};
}

// A visitor can keep an older tab open while a new deployment replaces its
// hashed route chunks. If that stale tab requests a chunk that no longer
// exists, recover once by loading the current HTML. Avoid a reload loop if
// the new deployment is still unavailable, and show a useful retry screen.
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();

    const request = event.payload?.request || window.location.pathname;
    const retryKey = `orian:chunk-reload:${request}`;
    const retryWindowMs = 60_000;
    let retryRecorded = false;

    try {
      const lastRetry = Number(window.sessionStorage.getItem(retryKey)) || 0;
      if (Date.now() - lastRetry > retryWindowMs) {
        window.sessionStorage.setItem(retryKey, String(Date.now()));
        retryRecorded = true;
      }
    } catch {
      // Storage can be unavailable in private browsing; the recovery screen
      // below still lets the visitor retry manually.
    }

    if (retryRecorded) {
      window.location.reload();
      return;
    }

    const root = document.querySelector('#root');
    if (!root) return;

    const panel = document.createElement('main');
    panel.setAttribute('role', 'alert');
    panel.style.cssText = 'min-height:100vh;display:grid;place-content:center;gap:1rem;padding:2rem;background:#080a0d;color:#f4f7fb;font:16px/1.5 system-ui,sans-serif;text-align:center';

    const heading = document.createElement('h1');
    heading.textContent = 'A newer version of the site is available';
    heading.style.cssText = 'margin:0;font-size:1.4rem';

    const message = document.createElement('p');
    message.textContent = 'Reload the page to continue.';
    message.style.cssText = 'margin:0;color:#aeb8c6';

    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Reload page';
    button.style.cssText = 'justify-self:center;border:0;border-radius:999px;padding:.8rem 1.4rem;background:#00aeef;color:#061018;font:inherit;font-weight:700;cursor:pointer';
    button.addEventListener('click', () => {
      try {
        window.sessionStorage.removeItem(retryKey);
      } catch {
        // The page reload below does not depend on storage.
      }
      window.location.reload();
    });

    panel.append(heading, message, button);
    root.replaceChildren(panel);
  });
}

export const createRoot = ViteReactSSG(
  { routes },
  () => {
    // Custom setup or side-effects can go here if needed
  },
  {
    rootContainerSelector: '#root',
  }
);
