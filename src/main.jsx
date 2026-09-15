import { ViteReactSSG } from 'vite-react-ssg';
import './index.css';
import { routes } from './routes';

// ViteReactSSG replaces the old createRoot(...).render(<App/>) call. In
// dev and in the browser it behaves like a normal client-rendered React
// Router app (BrowserRouter under the hood); at `npm run build` it also
// renders every route in `routes` (including the concrete paths returned
// by each route's getStaticPaths) to real HTML on disk, then hydrates
// from that HTML in the browser — same app, same behavior, now with
// crawlable per-page markup. HelmetProvider (for per-page <title>/meta)
// lives in routes.jsx's RootLayout so it wraps both the client and the
// build-time render the same way.
export const createRoot = ViteReactSSG({ routes });
