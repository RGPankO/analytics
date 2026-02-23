"use strict";
/**
 * Analytics Sessions Stats Handler Factory
 * Returns GET handler for /api/analytics/sessions/stats?period=7d
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSessionsStatsHandler = createSessionsStatsHandler;
const server_1 = require("next/server");
function createSessionsStatsHandler(config) {
    return async function GET(request) {
        try {
            const { searchParams } = new URL(request.url);
            const period = searchParams.get('period') || '7d';
            // Parse period into days
            const days = parseInt(period.replace('d', '')) || 7;
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            // Fetch session stats
            const [totalSessions, devices, browsers] = await Promise.all([
                // Total sessions
                config.prisma.analyticsSession.count({
                    where: { createdAt: { gte: startDate } },
                }),
                // Device breakdown
                config.prisma.analyticsSession.groupBy({
                    by: ['device'],
                    where: { createdAt: { gte: startDate } },
                    _count: { device: true },
                }),
                // Browser breakdown
                config.prisma.analyticsSession.groupBy({
                    by: ['browser'],
                    where: { createdAt: { gte: startDate } },
                    _count: { browser: true },
                }),
            ]);
            return server_1.NextResponse.json({
                totalSessions,
                devices: devices.map((d) => ({
                    device: d.device || 'Unknown',
                    count: d._count.device,
                })),
                browsers: browsers.map((b) => ({
                    browser: b.browser || 'Unknown',
                    count: b._count.browser,
                })),
            });
        }
        catch (error) {
            console.error('[Analytics] Sessions stats error:', error);
            return server_1.NextResponse.json({ error: 'Internal error' }, { status: 500 });
        }
    };
}
