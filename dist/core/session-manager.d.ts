/**
 * Session Manager - handles analytics session creation and lookup
 * Sessions are ephemeral - identified by client-generated sessionId
 * No cookies, IP discarded after GeoIP lookup
 */
import type { AnalyticsPrismaClient, DeviceInfo } from '../types';
export declare class SessionManager {
    private prisma;
    constructor(prisma: AnalyticsPrismaClient);
    /**
     * Get or create analytics session
     */
    getOrCreateSession(sessionId: string, deviceInfo: DeviceInfo, ip?: string): Promise<string>;
    /**
     * Get country from IP using a GeoIP service
     * IP is discarded after lookup for privacy
     */
    private getCountryFromIp;
}
