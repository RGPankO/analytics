/**
 * Analytics Pageviews Handler Factory
 * Returns GET handler for /api/analytics/pageviews?period=7d
 */

import { NextRequest, NextResponse } from 'next/server';
import type { AnalyticsConfig } from '../types';

export function createPageviewsHandler(config: AnalyticsConfig) {
  return async function GET(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const period = searchParams.get('period') || '7d';

      // Parse period into days
      const days = parseInt(period.replace('d', '')) || 7;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Fetch pageviews and group by date in application code
      // (Prisma handles schema mapping via @@map in schema.prisma)
      const pageviews = await config.prisma.analyticsPageview.findMany({
        where: {
          timestamp: {
            gte: startDate,
          },
        },
        select: {
          timestamp: true,
        },
      });

      // Group by date
      const viewsByDate: Record<string, number> = {};
      pageviews.forEach(pv => {
        const date = pv.timestamp.toISOString().split('T')[0];
        viewsByDate[date] = (viewsByDate[date] || 0) + 1;
      });

      // Convert to array format
      const formatted = Object.entries(viewsByDate)
        .map(([date, views]) => ({ date, views }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Convert bigint to number
      const formatted = timeseriesData.map(row => ({
        date: row.date,
        views: Number(row.views),
      }));

      return NextResponse.json({ data: formatted });
    } catch (error) {
      console.error('[Analytics] Pageviews error:', error);
      return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
  };
}
