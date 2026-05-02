import { useEffect } from 'react';

export const useDisableBackButton = () => {
  useEffect(() => {
    // Only apply on mobile devices
    if (window.innerWidth > 768) return;

    // Push an extra state to the history stack immediately
    window.history.pushState(null, '', window.location.href);

    const handlePopState = (event: PopStateEvent) => {
      // Whenever the back button is pressed, push a new state 
      // preventing the browser from navigating back
      window.history.pushState(null, '', window.location.href);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
};
