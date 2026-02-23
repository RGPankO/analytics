/**
 * Event Storage - stores pageviews and custom events
 */

import type { AnalyticsPrismaClient, PageviewData, EventData } from '../types';

export class EventStorage {
  constructor(private prisma: AnalyticsPrismaClient) {}

  /**
   * Store a pageview
   */
  async recordPageview(data: PageviewData): Promise<void> {
    await this.prisma.analyticsPageview.create({
      data: {
        sessionId: data.sessionId,
        path: data.path,
        referrer: data.referrer || null,
        duration: data.duration || null,
      },
    });
  }

  /**
   * Store a custom event
   */
  async recordEvent(data: EventData): Promise<void> {
    await this.prisma.analyticsEvent.create({
      data: {
        sessionId: data.sessionId,
        type: data.type,
        path: data.path,
        properties: data.properties ? (data.properties as any) : undefined,
      },
    });
  }

  /**
   * Update pageview duration
   */
  async updatePageviewDuration(sessionId: string, path: string, duration: number): Promise<void> {
    // Find the most recent pageview for this session+path
    const pageview = await this.prisma.analyticsPageview.findFirst({
      where: { sessionId, path },
      orderBy: { timestamp: 'desc' },
    });

    if (pageview) {
      await this.prisma.analyticsPageview.update({
        where: { id: pageview.id },
        data: { duration },
      });
    }
  }
}
