"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsDashboard = exports.createCollectOptionsHandler = exports.createCollectHandler = exports.createSessionsStatsHandler = exports.createTopPagesHandler = exports.createPageviewsHandler = exports.EventStorage = exports.SessionManager = void 0;
// Core
var session_manager_1 = require("./core/session-manager");
Object.defineProperty(exports, "SessionManager", { enumerable: true, get: function () { return session_manager_1.SessionManager; } });
var event_storage_1 = require("./core/event-storage");
Object.defineProperty(exports, "EventStorage", { enumerable: true, get: function () { return event_storage_1.EventStorage; } });
// API handlers
var pageviews_1 = require("./api/pageviews");
Object.defineProperty(exports, "createPageviewsHandler", { enumerable: true, get: function () { return pageviews_1.createPageviewsHandler; } });
var top_pages_1 = require("./api/top-pages");
Object.defineProperty(exports, "createTopPagesHandler", { enumerable: true, get: function () { return top_pages_1.createTopPagesHandler; } });
var sessions_stats_1 = require("./api/sessions-stats");
Object.defineProperty(exports, "createSessionsStatsHandler", { enumerable: true, get: function () { return sessions_stats_1.createSessionsStatsHandler; } });
var collect_1 = require("./api/collect");
Object.defineProperty(exports, "createCollectHandler", { enumerable: true, get: function () { return collect_1.createCollectHandler; } });
Object.defineProperty(exports, "createCollectOptionsHandler", { enumerable: true, get: function () { return collect_1.createCollectOptionsHandler; } });
// Components
var AnalyticsDashboard_1 = require("./components/AnalyticsDashboard");
Object.defineProperty(exports, "AnalyticsDashboard", { enumerable: true, get: function () { return AnalyticsDashboard_1.AnalyticsDashboard; } });
