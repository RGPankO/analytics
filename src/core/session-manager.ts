/**
 * Session Manager - handles analytics session creation and lookup
 * Sessions are ephemeral - identified by client-generated sessionId
 * No cookies, IP discarded after GeoIP lookup
 */

import type { AnalyticsPrismaClient, DeviceInfo } from '../types';

export class SessionManager {
  constructor(private prisma: AnalyticsPrismaClient) {}

  /**
   * Get or create analytics session
   */
  async getOrCreateSession(sessionId: string, deviceInfo: DeviceInfo, ip?: string): Promise<string> {
    // Check if session exists
    const existing = await this.prisma.analyticsSession.findUnique({
      where: { id: sessionId },
      select: { id: true },
    });

    if (existing) return sessionId;

    // Get country from IP (if provided)
    const country = ip ? await this.getCountryFromIp(ip) : null;

    // Create new session
    await this.prisma.analyticsSession.create({
      data: {
        id: sessionId,
        country,
        device: deviceInfo.device,
        os: deviceInfo.os,
        browser: deviceInfo.browser,
      },
    });

    return sessionId;
  }

  /**
   * Get country from IP using a GeoIP service
   * IP is discarded after lookup for privacy
   */
  private async getCountryFromIp(ip: string): Promise<string | null> {
    // TODO: Integrate GeoIP service (e.g., ipapi.co, geoip-lite)
    // For now, return null
    // Example with ipapi.co:
    // try {
    //   const res = await fetch(`https://ipapi.co/${ip}/country/`);
    //   if (res.ok) return await res.text();
    // } catch {}
    return null;
  }
}
