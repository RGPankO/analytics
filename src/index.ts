/**
 * @21digital/analytics - Privacy-first analytics for Next.js
 * 
 * @example Basic usage
 * ```ts
 * // 1. Install as git dependency
 * // package.json: "@21digital/analytics": "github:RGPankO/analytics"
 * 
 * // 2. Wire API routes
 * // app/api/analytics/pageviews/route.ts
 * import { createPageviewsHandler } from '@21digital/analytics';
 * import { prisma } from '@/lib/db/prisma';
 * export const GET = createPageviewsHandler({ prisma });
 * 
 * // 3. Use dashboard component
 * import { AnalyticsDashboard } from '@21digital/analytics';
 * import '@21digital/analytics/dist/styles/analytics.css';
 * <AnalyticsDashboard />
 * 
 * // 4. Add tracker script to layout
 * <script src="/analytics/tracker.js" data-website-id="my-site" async />
 * ```
 */

// Core
export { SessionManager } from './core/session-manager';
export { EventStorage } from './core/event-storage';

// API handlers
export { createPageviewsHandler } from './api/pageviews';
export { createTopPagesHandler } from './api/top-pages';
export { createSessionsStatsHandler } from './api/sessions-stats';
export { createCollectHandler, createCollectOptionsHandler } from './api/collect';

// Components
export { AnalyticsDashboard } from './components/AnalyticsDashboard';

// Types
export type {
  AnalyticsPrismaClient,
  AnalyticsConfig,
  SessionData,
  DeviceInfo,
  PageviewData,
  EventData,
  PageviewRow,
  TopPage,
  DeviceData,
  BrowserData,
  SessionStats,
} from './types';
