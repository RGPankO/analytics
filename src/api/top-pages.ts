/**
 * Analytics Top Pages Handler Factory
 * Returns GET handler for /api/analytics/top-pages?period=7d&limit=10
 */

import { NextRequest, NextResponse } from 'next/server';
import type { AnalyticsConfig } from '../types';

export function createTopPagesHandler(config: AnalyticsConfig) {
  return async function GET(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const period = searchParams.get('period') || '7d';
      const limit = parseInt(searchParams.get('limit') || '10');

      // Parse period into days
      const days = parseInt(period.replace('d', '')) || 7;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Top pages
      const topPages = await config.prisma.analyticsPageview.groupBy({
        by: ['path'],
        where: { timestamp: { gte: startDate } },
        _count: { path: true },
        orderBy: { _count: { path: 'desc' } },
        take: limit,
      });

      const formatted = topPages.map((p: any) => ({
        path: p.path,
        views: p._count.path,
      }));

      return NextResponse.json({ data: formatted });
    } catch (error) {
      console.error('[Analytics] Top pages error:', error);
      return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
  };
}
