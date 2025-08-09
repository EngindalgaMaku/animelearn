// Google Analytics configuration
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = (
  action: string,
  {
    event_category,
    event_label,
    value,
    ...parameters
  }: {
    event_category?: string;
    event_label?: string;
    value?: number;
    [key: string]: any;
  }
): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category,
      event_label,
      value,
      ...parameters,
    });
  }
};

// Custom events for our gaming platform
export const trackCardPurchase = (cardName: string, price: number): void => {
  event('purchase_card', {
    event_category: 'ecommerce',
    event_label: cardName,
    value: price,
    currency: 'diamonds',
  });
};

export const trackLessonComplete = (lessonName: string, category: string): void => {
  event('lesson_complete', {
    event_category: 'learning',
    event_label: lessonName,
    lesson_category: category,
  });
};

export const trackUserSignup = (method: string): void => {
  event('sign_up', {
    event_category: 'engagement',
    method,
  });
};

export const trackUserLogin = (method: string): void => {
  event('login', {
    event_category: 'engagement',
    method,
  });
};

export const trackQuestComplete = (questName: string, reward: number): void => {
  event('quest_complete', {
    event_category: 'gamification',
    event_label: questName,
    value: reward,
  });
};

export const trackBadgeEarn = (badgeName: string): void => {
  event('badge_earned', {
    event_category: 'gamification',
    event_label: badgeName,
  });
};

export const trackCodeExecution = (language: string, success: boolean): void => {
  event('code_execute', {
    event_category: 'learning',
    event_label: language,
    success: success.toString(),
  });
};