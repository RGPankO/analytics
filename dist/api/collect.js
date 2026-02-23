"use strict";
/**
 * Analytics Collection Handler Factory
 * Returns POST handler for /api/analytics/collect
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCollectHandler = createCollectHandler;
exports.createCollectOptionsHandler = createCollectOptionsHandler;
const server_1 = require("next/server");
const session_manager_1 = require("../core/session-manager");
const event_storage_1 = require("../core/event-storage");
function createCollectHandler(config) {
    const sessionManager = new session_manager_1.SessionManager(config.prisma);
    const eventStorage = new event_storage_1.EventStorage(config.prisma);
    return async function POST(request) {
        try {
            const body = await request.json();
            const { websiteId, sessionId, type, url, referrer, title, name, properties, duration, device, os, browser, } = body;
            if (!websiteId || !sessionId || !type) {
                return server_1.NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
            }
            // Get client IP for GeoIP (then discard)
            const ip = request.headers.get('x-forwarded-for')?.split(',')[0]
                || request.headers.get('x-real-ip')
                || undefined;
            // Ensure session exists
            await sessionManager.getOrCreateSession(sessionId, { device, os, browser }, ip);
            // Extract path from URL
            const path = url ? new URL(url).pathname : '/';
            // Store event based on type
            switch (type) {
                case 'pageview':
                    await eventStorage.recordPageview({
                        sessionId,
                        path,
                        referrer,
                    });
                    break;
                case 'event':
                    await eventStorage.recordEvent({
                        sessionId,
                        type: name || 'custom',
                        path,
                        properties,
                    });
                    break;
                case 'duration':
                    if (duration) {
                        await eventStorage.updatePageviewDuration(sessionId, path, duration);
                    }
                    break;
                default:
                    return server_1.NextResponse.json({ error: 'Unknown event type' }, { status: 400 });
            }
            return server_1.NextResponse.json({ success: true });
        }
        catch (error) {
            console.error('[Analytics] Collection error:', error);
            return server_1.NextResponse.json({ error: 'Internal error' }, { status: 500 });
        }
    };
}
function createCollectOptionsHandler() {
    return async function OPTIONS() {
        return new server_1.NextResponse(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    };
}
