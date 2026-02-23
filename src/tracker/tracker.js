/**
 * 21digital Analytics Tracker
 * Privacy-first, cookie-less analytics tracker
 * Adapted from Umami (MIT license)
 * 
 * Usage: <script src="/analytics/tracker.js" data-website-id="your-project"></script>
 */

(function(window) {
  'use strict';

  const {
    screen: { width, height },
    navigator: { language },
    location,
    document,
    history,
  } = window;

  const { currentScript, referrer } = document;
  if (!currentScript) return;

  // Configuration from data attributes
  const attr = currentScript.getAttribute.bind(currentScript);
  const websiteId = attr('data-website-id');
  const hostUrl = attr('data-host-url');
  const autoTrack = attr('data-auto-track') !== 'false';
  const endpoint = (hostUrl || location.origin) + '/api/analytics/collect';

  if (!websiteId) {
    console.warn('[Analytics] data-website-id is required');
    return;
  }

  // Session tracking (in-memory, no cookies)
  let sessionId = generateSessionId();
  let currentUrl = normalizeUrl(location.href);
  let currentRef = referrer ? normalizeUrl(referrer) : '';

  // Utility functions
  function generateSessionId() {
    // Generate UUID v4 compatible with DB schema
    if (crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function normalizeUrl(url) {
    try {
      const u = new URL(url);
      u.search = ''; // Strip query params for privacy
      u.hash = '';   // Strip hash for privacy
      return u.toString();
    } catch {
      return url;
    }
  }

  function getDeviceInfo() {
    const ua = navigator.userAgent;
    const device = /Mobile|Android|iPhone|iPad|iPod/.test(ua) ? 'mobile' : 'desktop';
    
    let os = 'Unknown';
    if (/Windows/.test(ua)) os = 'Windows';
    else if (/Mac OS/.test(ua)) os = 'macOS';
    else if (/Linux/.test(ua)) os = 'Linux';
    else if (/Android/.test(ua)) os = 'Android';
    else if (/iOS|iPhone|iPad/.test(ua)) os = 'iOS';

    let browser = 'Unknown';
    if (/Firefox/.test(ua)) browser = 'Firefox';
    else if (/Chrome/.test(ua) && !/Edg/.test(ua)) browser = 'Chrome';
    else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browser = 'Safari';
    else if (/Edg/.test(ua)) browser = 'Edge';

    return { device, os, browser };
  }

  function sendEvent(payload) {
    const deviceInfo = getDeviceInfo();
    const data = {
      websiteId,
      sessionId,
      screen: `${width}x${height}`,
      language,
      ...deviceInfo,
      ...payload,
    };

    // Send via beacon for reliability
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, JSON.stringify(data));
    } else {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true,
      }).catch(() => {});
    }
  }

  // Track pageview
  function trackPageview() {
    sendEvent({
      type: 'pageview',
      url: currentUrl,
      referrer: currentRef,
      title: document.title,
    });
  }

  // Track custom event
  function trackEvent(eventName, properties) {
    sendEvent({
      type: 'event',
      name: eventName,
      url: currentUrl,
      properties: properties || {},
    });
  }

  // Track click events with data-analytics-event attribute
  function handleClick(e) {
    const el = e.target.closest('[data-analytics-event]');
    if (!el) return;

    const eventName = el.getAttribute('data-analytics-event');
    const properties = {};

    // Collect data-analytics-* attributes
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith('data-analytics-') && attr.name !== 'data-analytics-event') {
        const key = attr.name.replace('data-analytics-', '');
        properties[key] = attr.value;
      }
    });

    trackEvent(eventName, properties);
  }

  // Handle SPA navigation
  function handlePushState(state, title, url) {
    if (!url) return;
    currentRef = currentUrl;
    currentUrl = normalizeUrl(new URL(url, location.href).toString());
    trackPageview();
  }

  // Public API
  window.analytics = {
    track: trackPageview,
    trackEvent: trackEvent,
    sessionId: () => sessionId,
  };

  // Auto-track setup
  if (autoTrack) {
    // Initial pageview
    trackPageview();

    // Track clicks with data-analytics-event
    document.addEventListener('click', handleClick, true);

    // Track SPA navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(this, args);
      handlePushState(...args);
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      handlePushState(...args);
    };

    window.addEventListener('popstate', () => {
      currentRef = currentUrl;
      currentUrl = normalizeUrl(location.href);
      trackPageview();
    });
  }

  // Heartbeat - track page duration
  let pageStartTime = Date.now();
  let isActive = true;

  function trackDuration() {
    if (!isActive) return;
    const duration = Math.floor((Date.now() - pageStartTime) / 1000);
    sendEvent({
      type: 'duration',
      url: currentUrl,
      duration,
    });
  }

  // Track visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isActive = false;
      trackDuration();
    } else {
      isActive = true;
      pageStartTime = Date.now();
    }
  });

  // Track duration on unload
  window.addEventListener('beforeunload', trackDuration);

  // Periodic heartbeat (every 30s)
  setInterval(() => {
    if (isActive) trackDuration();
  }, 30000);

})(window);
