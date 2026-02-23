"use strict";
'use client';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsDashboard = AnalyticsDashboard;
const react_1 = __importStar(require("react"));
const recharts_1 = require("recharts");
const DEFAULT_COLORS = ['#00c8b4', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
const DEFAULT_PERIODS = [
    { value: '7d', label: '7 days' },
    { value: '14d', label: '14 days' },
    { value: '30d', label: '30 days' },
];
function AnalyticsDashboard({ className = '', apiBasePath = '/api/analytics', periods = DEFAULT_PERIODS, defaultPeriod = '7d', }) {
    const [pageviews, setPageviews] = (0, react_1.useState)([]);
    const [topPages, setTopPages] = (0, react_1.useState)([]);
    const [sessionStats, setSessionStats] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [period, setPeriod] = (0, react_1.useState)(defaultPeriod);
    (0, react_1.useEffect)(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError(null);
                const [pageviewsRes, topPagesRes, sessionsRes] = await Promise.all([
                    fetch(`${apiBasePath}/pageviews?period=${period}`),
                    fetch(`${apiBasePath}/top-pages?period=${period}&limit=10`),
                    fetch(`${apiBasePath}/sessions/stats?period=${period}`),
                ]);
                if (!pageviewsRes.ok || !topPagesRes.ok || !sessionsRes.ok) {
                    throw new Error('Failed to fetch analytics data');
                }
                const [pageviewsData, topPagesData, sessionsData] = await Promise.all([
                    pageviewsRes.json(),
                    topPagesRes.json(),
                    sessionsRes.json(),
                ]);
                setPageviews(pageviewsData.data || []);
                setTopPages(topPagesData.data || []);
                setSessionStats(sessionsData);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            }
            finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [period, apiBasePath]);
    if (loading) {
        return (react_1.default.createElement("div", { className: `analytics-dashboard ${className}` },
            react_1.default.createElement("div", { className: "analytics-loading" }, "Loading analytics...")));
    }
    if (error) {
        return (react_1.default.createElement("div", { className: `analytics-dashboard ${className}` },
            react_1.default.createElement("div", { className: "analytics-error" },
                "Error: ",
                error)));
    }
    const totalPageviews = pageviews.reduce((sum, item) => sum + item.views, 0);
    return (react_1.default.createElement("div", { className: `analytics-dashboard ${className}` },
        react_1.default.createElement("div", { className: "analytics-period-selector" }, periods.map((p) => (react_1.default.createElement("button", { key: p.value, onClick: () => setPeriod(p.value), className: `analytics-period-button ${period === p.value ? 'active' : ''}` }, p.label)))),
        react_1.default.createElement("div", { className: "analytics-summary-grid" },
            react_1.default.createElement("div", { className: "analytics-card" },
                react_1.default.createElement("div", { className: "analytics-card-label" }, "Total Pageviews"),
                react_1.default.createElement("div", { className: "analytics-card-value" }, totalPageviews.toLocaleString())),
            react_1.default.createElement("div", { className: "analytics-card" },
                react_1.default.createElement("div", { className: "analytics-card-label" }, "Sessions"),
                react_1.default.createElement("div", { className: "analytics-card-value" }, sessionStats?.totalSessions.toLocaleString() || 0)),
            react_1.default.createElement("div", { className: "analytics-card" },
                react_1.default.createElement("div", { className: "analytics-card-label" }, "Avg Views/Session"),
                react_1.default.createElement("div", { className: "analytics-card-value" }, sessionStats && sessionStats.totalSessions > 0
                    ? (totalPageviews / sessionStats.totalSessions).toFixed(1)
                    : '0'))),
        react_1.default.createElement("div", { className: "analytics-chart-card" },
            react_1.default.createElement("h2", { className: "analytics-chart-title" }, "Pageviews Over Time"),
            react_1.default.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: 300 },
                react_1.default.createElement(recharts_1.LineChart, { data: pageviews },
                    react_1.default.createElement(recharts_1.CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--analytics-grid-color, rgba(255,255,255,0.1))" }),
                    react_1.default.createElement(recharts_1.XAxis, { dataKey: "date", stroke: "var(--analytics-axis-color, #6b7280)" }),
                    react_1.default.createElement(recharts_1.YAxis, { stroke: "var(--analytics-axis-color, #6b7280)" }),
                    react_1.default.createElement(recharts_1.Tooltip, { contentStyle: {
                            backgroundColor: 'var(--analytics-tooltip-bg, rgba(0,0,0,0.8))',
                            border: '1px solid var(--analytics-tooltip-border, rgba(255,255,255,0.1))',
                            borderRadius: 'var(--analytics-border-radius, 8px)',
                        } }),
                    react_1.default.createElement(recharts_1.Legend, null),
                    react_1.default.createElement(recharts_1.Line, { type: "monotone", dataKey: "views", stroke: "var(--analytics-accent, #00c8b4)", strokeWidth: 2, name: "Views" })))),
        react_1.default.createElement("div", { className: "analytics-chart-card" },
            react_1.default.createElement("h2", { className: "analytics-chart-title" }, "Top Pages"),
            react_1.default.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: 300 },
                react_1.default.createElement(recharts_1.BarChart, { data: topPages },
                    react_1.default.createElement(recharts_1.CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--analytics-grid-color, rgba(255,255,255,0.1))" }),
                    react_1.default.createElement(recharts_1.XAxis, { dataKey: "path", stroke: "var(--analytics-axis-color, #6b7280)" }),
                    react_1.default.createElement(recharts_1.YAxis, { stroke: "var(--analytics-axis-color, #6b7280)" }),
                    react_1.default.createElement(recharts_1.Tooltip, { contentStyle: {
                            backgroundColor: 'var(--analytics-tooltip-bg, rgba(0,0,0,0.8))',
                            border: '1px solid var(--analytics-tooltip-border, rgba(255,255,255,0.1))',
                            borderRadius: 'var(--analytics-border-radius, 8px)',
                        } }),
                    react_1.default.createElement(recharts_1.Legend, null),
                    react_1.default.createElement(recharts_1.Bar, { dataKey: "views", fill: "var(--analytics-accent, #00c8b4)", name: "Views" })))),
        react_1.default.createElement("div", { className: "analytics-breakdown-grid" },
            react_1.default.createElement("div", { className: "analytics-chart-card" },
                react_1.default.createElement("h2", { className: "analytics-chart-title" }, "Devices"),
                sessionStats && sessionStats.devices.length > 0 ? (react_1.default.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: 250 },
                    react_1.default.createElement(recharts_1.PieChart, null,
                        react_1.default.createElement(recharts_1.Pie, { data: sessionStats.devices, dataKey: "count", nameKey: "device", cx: "50%", cy: "50%", outerRadius: 80, label: true }, sessionStats.devices.map((entry, index) => (react_1.default.createElement(recharts_1.Cell, { key: `cell-${index}`, fill: DEFAULT_COLORS[index % DEFAULT_COLORS.length] })))),
                        react_1.default.createElement(recharts_1.Tooltip, { contentStyle: {
                                backgroundColor: 'var(--analytics-tooltip-bg, rgba(0,0,0,0.8))',
                                border: '1px solid var(--analytics-tooltip-border, rgba(255,255,255,0.1))',
                                borderRadius: 'var(--analytics-border-radius, 8px)',
                            } }),
                        react_1.default.createElement(recharts_1.Legend, null)))) : (react_1.default.createElement("p", { className: "analytics-no-data" }, "No device data"))),
            react_1.default.createElement("div", { className: "analytics-chart-card" },
                react_1.default.createElement("h2", { className: "analytics-chart-title" }, "Browsers"),
                sessionStats && sessionStats.browsers.length > 0 ? (react_1.default.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: 250 },
                    react_1.default.createElement(recharts_1.PieChart, null,
                        react_1.default.createElement(recharts_1.Pie, { data: sessionStats.browsers, dataKey: "count", nameKey: "browser", cx: "50%", cy: "50%", outerRadius: 80, label: true }, sessionStats.browsers.map((entry, index) => (react_1.default.createElement(recharts_1.Cell, { key: `cell-${index}`, fill: DEFAULT_COLORS[index % DEFAULT_COLORS.length] })))),
                        react_1.default.createElement(recharts_1.Tooltip, { contentStyle: {
                                backgroundColor: 'var(--analytics-tooltip-bg, rgba(0,0,0,0.8))',
                                border: '1px solid var(--analytics-tooltip-border, rgba(255,255,255,0.1))',
                                borderRadius: 'var(--analytics-border-radius, 8px)',
                            } }),
                        react_1.default.createElement(recharts_1.Legend, null)))) : (react_1.default.createElement("p", { className: "analytics-no-data" }, "No browser data"))))));
}
