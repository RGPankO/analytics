/**
 * Core types for analytics package
 */
import { PrismaClient } from '@prisma/client';
export type AnalyticsPrismaClient = Pick<PrismaClient, 'analyticsSession' | 'analyticsPageview' | 'analyticsEvent' | '$queryRaw'>;
export interface SessionData {
    sessionId: string;
    country?: string;
    device?: string;
    os?: string;
    browser?: string;
}
export interface DeviceInfo {
    device: string;
    os: string;
    browser: string;
}
export interface PageviewData {
    sessionId: string;
    path: string;
    referrer?: string;
    duration?: number;
}
export interface EventData {
    sessionId: string;
    type: string;
    path: string;
    name?: string;
    properties?: Record<string, unknown>;
}
export interface AnalyticsConfig {
    prisma: AnalyticsPrismaClient;
    schema?: string;
}
export interface PageviewRow {
    date: string;
    views: number;
}
export interface TopPage {
    path: string;
    views: number;
}
export interface DeviceData {
    device: string;
    count: number;
}
export interface BrowserData {
    browser: string;
    count: number;
}
export interface SessionStats {
    totalSessions: number;
    devices: DeviceData[];
    browsers: BrowserData[];
}
