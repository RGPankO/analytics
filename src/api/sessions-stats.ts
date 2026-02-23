/**
 * Analytics Sessions Stats Handler Factory
 * Returns GET handler for /api/analytics/sessions/stats?period=7d
 */

import { NextRequest, NextResponse } from 'next/server';
import type { AnalyticsConfig } from '../types';

export function createSessionsStatsHandler(config: AnalyticsConfig) {
  return async function GET(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const period = searchParams.get('period') || '7d';

      // Parse period into days
      const days = parseInt(period.replace('d', '')) || 7;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Fetch session stats
      const [totalSessions, devices, browsers] = await Promise.all([
        // Total sessions
        config.prisma.analyticsSession.count({
          where: { createdAt: { gte: startDate } },
        }),

        // Device breakdown
        config.prisma.analyticsSession.groupBy({
          by: ['device'],
          where: { createdAt: { gte: startDate } },
          _count: { device: true },
        }),

        // Browser breakdown
        config.prisma.analyticsSession.groupBy({
          by: ['browser'],
          where: { createdAt: { gte: startDate } },
          _count: { browser: true },
        }),
      ]);

      return NextResponse.json({
        totalSessions,
        devices: devices.map((d: any) => ({
          device: d.device || 'Unknown',
          count: d._count.device,
        })),
        browsers: browsers.map((b: any) => ({
          browser: b.browser || 'Unknown',
          count: b._count.browser,
        })),
      });
    } catch (error) {
      console.error('[Analytics] Sessions stats error:', error);
      return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
  };
}
