import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component that resets scroll position when navigating between routes
 * This fixes the issue where clicking a product on the homepage takes the user to the bottom of the ProductDetail page
 */
const ScrollReset = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset scroll position to top when route changes
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollReset;