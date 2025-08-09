'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import * as gtag from '@/lib/gtag';

export const useAnalytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      gtag.pageview(pathname);
    }
  }, [pathname, searchParams]);

  return {
    trackCardPurchase: gtag.trackCardPurchase,
    trackLessonComplete: gtag.trackLessonComplete,
    trackUserSignup: gtag.trackUserSignup,
    trackUserLogin: gtag.trackUserLogin,
    trackQuestComplete: gtag.trackQuestComplete,
    trackBadgeEarn: gtag.trackBadgeEarn,
    trackCodeExecution: gtag.trackCodeExecution,
    trackEvent: gtag.event,
  };
};