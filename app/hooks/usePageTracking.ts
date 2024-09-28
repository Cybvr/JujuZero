import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

// Extend the window interface to include gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const usePageTracking = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      const url = pathname + searchParams.toString();
      window.gtag('config', 'AW-11237044944', {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);
};

export default usePageTracking;
