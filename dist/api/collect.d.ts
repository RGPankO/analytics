/**
 * Analytics Collection Handler Factory
 * Returns POST handler for /api/analytics/collect
 */
import { NextRequest, NextResponse } from 'next/server';
import type { AnalyticsConfig } from '../types';
export declare function createCollectHandler(config: AnalyticsConfig): (request: NextRequest) => Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
}>>;
export declare function createCollectOptionsHandler(): () => Promise<NextResponse<unknown>>;
