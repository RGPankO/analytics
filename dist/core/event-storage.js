"use strict";
/**
 * Event Storage - stores pageviews and custom events
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventStorage = void 0;
class EventStorage {
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Store a pageview
     */
    async recordPageview(data) {
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
    async recordEvent(data) {
        await this.prisma.analyticsEvent.create({
            data: {
                sessionId: data.sessionId,
                type: data.type,
                path: data.path,
                properties: data.properties ? data.properties : undefined,
            },
        });
    }
    /**
     * Update pageview duration
     */
    async updatePageviewDuration(sessionId, path, duration) {
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
exports.EventStorage = EventStorage;
