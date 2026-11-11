import { ViteReactSSG } from 'vite-react-ssg';
import './index.css';
import { routes } from './routes';

export const createRoot = ViteReactSSG(
  { routes },
  ({ isClient }) => {
    // Custom setup or side-effects can go here if needed
  },
  {
    rootContainerSelector: '#root',
  }
);
