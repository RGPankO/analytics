/**
 * Analytics Pageviews Handler Factory
 * Returns GET handler for /api/analytics/pageviews?period=7d
 */
import { NextRequest, NextResponse } from 'next/server';
import type { AnalyticsConfig } from '../types';
export declare function createPageviewsHandler(config: AnalyticsConfig): (request: NextRequest) => Promise<NextResponse<{
    data: {
        date: string;
        views: number;
    }[];
}> | NextResponse<{
    error: string;
}>>;
