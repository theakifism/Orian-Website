import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// React Router doesn't reset scroll position between page navigations on
// its own — without this, jumping from the bottom of one page to a new
// route leaves the new page scrolled halfway down.
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
