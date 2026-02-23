/**
 * Analytics Top Pages Handler Factory
 * Returns GET handler for /api/analytics/top-pages?period=7d&limit=10
 */
import { NextRequest, NextResponse } from 'next/server';
import type { AnalyticsConfig } from '../types';
export declare function createTopPagesHandler(config: AnalyticsConfig): (request: NextRequest) => Promise<NextResponse<{
    data: any;
}> | NextResponse<{
    error: string;
}>>;
