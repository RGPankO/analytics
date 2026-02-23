/**
 * Event Storage - stores pageviews and custom events
 */
import type { AnalyticsPrismaClient, PageviewData, EventData } from '../types';
export declare class EventStorage {
    private prisma;
    constructor(prisma: AnalyticsPrismaClient);
    /**
     * Store a pageview
     */
    recordPageview(data: PageviewData): Promise<void>;
    /**
     * Store a custom event
     */
    recordEvent(data: EventData): Promise<void>;
    /**
     * Update pageview duration
     */
    updatePageviewDuration(sessionId: string, path: string, duration: number): Promise<void>;
}
