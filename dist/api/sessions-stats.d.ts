/**
 * Analytics Sessions Stats Handler Factory
 * Returns GET handler for /api/analytics/sessions/stats?period=7d
 */
import { NextRequest, NextResponse } from 'next/server';
import type { AnalyticsConfig } from '../types';
export declare function createSessionsStatsHandler(config: AnalyticsConfig): (request: NextRequest) => Promise<NextResponse<{
    totalSessions: any;
    devices: any;
    browsers: any;
}> | NextResponse<{
    error: string;
}>>;
