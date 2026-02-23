'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PageviewData {
  date: string;
  views: number;
}

interface TopPage {
  path: string;
  views: number;
}

interface DeviceData {
  device: string;
  count: number;
}

interface BrowserData {
  browser: string;
  count: number;
}

interface SessionStats {
  totalSessions: number;
  devices: DeviceData[];
  browsers: BrowserData[];
}

interface AnalyticsDashboardProps {
  className?: string;
  apiBasePath?: string;
  periods?: Array<{ value: string; label: string }>;
  defaultPeriod?: string;
}

const DEFAULT_COLORS = ['#00c8b4', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
const DEFAULT_PERIODS = [
  { value: '7d', label: '7 days' },
  { value: '14d', label: '14 days' },
  { value: '30d', label: '30 days' },
];

export function AnalyticsDashboard({
  className = '',
  apiBasePath = '/api/analytics',
  periods = DEFAULT_PERIODS,
  defaultPeriod = '7d',
}: AnalyticsDashboardProps) {
  const [pageviews, setPageviews] = useState<PageviewData[]>([]);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [sessionStats, setSessionStats] = useState<SessionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState(defaultPeriod);

  useEffect(() => {
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [period, apiBasePath]);

  if (loading) {
    return (
      <div className={`analytics-dashboard ${className}`}>
        <div className="analytics-loading">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`analytics-dashboard ${className}`}>
        <div className="analytics-error">Error: {error}</div>
      </div>
    );
  }

  const totalPageviews = pageviews.reduce((sum, item) => sum + item.views, 0);

  return (
    <div className={`analytics-dashboard ${className}`}>
      {/* Period selector */}
      <div className="analytics-period-selector">
        {periods.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`analytics-period-button ${period === p.value ? 'active' : ''}`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="analytics-summary-grid">
        <div className="analytics-card">
          <div className="analytics-card-label">Total Pageviews</div>
          <div className="analytics-card-value">{totalPageviews.toLocaleString()}</div>
        </div>

        <div className="analytics-card">
          <div className="analytics-card-label">Sessions</div>
          <div className="analytics-card-value">
            {sessionStats?.totalSessions.toLocaleString() || 0}
          </div>
        </div>

        <div className="analytics-card">
          <div className="analytics-card-label">Avg Views/Session</div>
          <div className="analytics-card-value">
            {sessionStats && sessionStats.totalSessions > 0
              ? (totalPageviews / sessionStats.totalSessions).toFixed(1)
              : '0'}
          </div>
        </div>
      </div>

      {/* Pageviews over time */}
      <div className="analytics-chart-card">
        <h2 className="analytics-chart-title">Pageviews Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={pageviews}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--analytics-grid-color, rgba(255,255,255,0.1))" />
            <XAxis dataKey="date" stroke="var(--analytics-axis-color, #6b7280)" />
            <YAxis stroke="var(--analytics-axis-color, #6b7280)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--analytics-tooltip-bg, rgba(0,0,0,0.8))',
                border: '1px solid var(--analytics-tooltip-border, rgba(255,255,255,0.1))',
                borderRadius: 'var(--analytics-border-radius, 8px)',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="views"
              stroke="var(--analytics-accent, #00c8b4)"
              strokeWidth={2}
              name="Views"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top pages */}
      <div className="analytics-chart-card">
        <h2 className="analytics-chart-title">Top Pages</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topPages}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--analytics-grid-color, rgba(255,255,255,0.1))" />
            <XAxis dataKey="path" stroke="var(--analytics-axis-color, #6b7280)" />
            <YAxis stroke="var(--analytics-axis-color, #6b7280)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--analytics-tooltip-bg, rgba(0,0,0,0.8))',
                border: '1px solid var(--analytics-tooltip-border, rgba(255,255,255,0.1))',
                borderRadius: 'var(--analytics-border-radius, 8px)',
              }}
            />
            <Legend />
            <Bar dataKey="views" fill="var(--analytics-accent, #00c8b4)" name="Views" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Device and browser breakdown */}
      <div className="analytics-breakdown-grid">
        {/* Devices */}
        <div className="analytics-chart-card">
          <h2 className="analytics-chart-title">Devices</h2>
          {sessionStats && sessionStats.devices.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sessionStats.devices}
                  dataKey="count"
                  nameKey="device"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {sessionStats.devices.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={DEFAULT_COLORS[index % DEFAULT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--analytics-tooltip-bg, rgba(0,0,0,0.8))',
                    border: '1px solid var(--analytics-tooltip-border, rgba(255,255,255,0.1))',
                    borderRadius: 'var(--analytics-border-radius, 8px)',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="analytics-no-data">No device data</p>
          )}
        </div>

        {/* Browsers */}
        <div className="analytics-chart-card">
          <h2 className="analytics-chart-title">Browsers</h2>
          {sessionStats && sessionStats.browsers.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sessionStats.browsers}
                  dataKey="count"
                  nameKey="browser"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {sessionStats.browsers.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={DEFAULT_COLORS[index % DEFAULT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--analytics-tooltip-bg, rgba(0,0,0,0.8))',
                    border: '1px solid var(--analytics-tooltip-border, rgba(255,255,255,0.1))',
                    borderRadius: 'var(--analytics-border-radius, 8px)',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="analytics-no-data">No browser data</p>
          )}
        </div>
      </div>
    </div>
  );
}
