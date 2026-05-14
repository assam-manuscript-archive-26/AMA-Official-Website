import React, { useEffect, useState } from 'react';
import {
  Users,
  MessageSquare,
  Star,
  Image,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Activity,
  Loader2,
} from 'lucide-react';
import { getVisitorCount } from '../../../backend/actions/visitorApi';
import { getFeedbackStats, getAllFeedback } from '../../../backend/actions/feedback';
import { getAllArtifacts } from '../../../backend/actions/artifact';
import { getAllEvents } from '../../../backend/actions/events';

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  color: string;
}

interface RecentItem {
  action: string;
  detail: string;
  time: string;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    visitors: 0,
    feedbacks: 0,
    avgRating: '0.0',
    artifacts: 0,
    events: 0,
  });
  const [recentFeedback, setRecentFeedback] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [visitorRes, feedbackStatsRes, feedbackRes, artifactRes, eventRes] =
        await Promise.allSettled([
          getVisitorCount(),
          getFeedbackStats(),
          getAllFeedback({ limit: 5, sort: { created_at: 'desc' } }),
          getAllArtifacts(),
          getAllEvents(),
        ]);

      setStats({
        visitors:
          visitorRes.status === 'fulfilled' && visitorRes.value.success
            ? visitorRes.value.count
            : 0,
        feedbacks:
          feedbackStatsRes.status === 'fulfilled' && feedbackStatsRes.value.success
            ? feedbackStatsRes.value.total
            : 0,
        avgRating:
          feedbackStatsRes.status === 'fulfilled' && feedbackStatsRes.value.success
            ? feedbackStatsRes.value.averageRating
            : '0.0',
        artifacts:
          artifactRes.status === 'fulfilled' && artifactRes.value.success
            ? artifactRes.value.artifacts.length
            : 0,
        events:
          eventRes.status === 'fulfilled' && eventRes.value.success
            ? eventRes.value.events.length
            : 0,
      });

      if (feedbackRes.status === 'fulfilled' && feedbackRes.value.success) {
        setRecentFeedback(feedbackRes.value.feedbacks.slice(0, 5));
      }
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards: StatCard[] = [
    {
      label: 'Total Visitors',
      value: stats.visitors.toLocaleString(),
      icon: <Users size={22} />,
      color: '#cc785c',
    },
    {
      label: 'Feedback Received',
      value: stats.feedbacks,
      icon: <MessageSquare size={22} />,
      color: '#5db8a6',
    },
    {
      label: 'Average Rating',
      value: `${stats.avgRating} / 5`,
      icon: <Star size={22} />,
      color: '#c9a227',
    },
    {
      label: 'Total Artifacts',
      value: stats.artifacts,
      icon: <Image size={22} />,
      color: '#a9583e',
    },
  ];

  const quickActions = [
    { label: 'Upload Artifact', href: '/admin/upload', icon: <ArrowUpRight size={16} /> },
    { label: 'Manage Artifacts', href: '/admin/artifacts', icon: <ArrowUpRight size={16} /> },
    { label: 'View Feedback', href: '/admin/feedback', icon: <ArrowUpRight size={16} /> },
    { label: 'Manage Events', href: '/admin/events', icon: <ArrowUpRight size={16} /> },
  ];

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Unknown';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Loader2 size={28} className="dashboard-spinner" />
        <p>Loading dashboard data...</p>
        <style>{`
          .dashboard-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            gap: 12px;
            color: var(--color-on-dark-soft);
            font-family: var(--font-body);
            font-size: 14px;
          }
          .dashboard-spinner {
            animation: dashSpin 1s linear infinite;
          }
          @keyframes dashSpin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">Dashboard</h2>
          <p className="dashboard-subtitle">
            Overview of the Assamese Manuscript Archive digital archive
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="dashboard-refresh"
          title="Refresh data"
        >
          <Activity size={16} />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="dashboard-stats-grid">
        {statCards.map((stat, index) => (
          <div
            key={stat.label}
            className="dashboard-stat-card"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="dashboard-stat-header">
              <div
                className="dashboard-stat-icon"
                style={{ background: `${stat.color}15`, color: stat.color }}
              >
                {stat.icon}
              </div>
              <TrendingUp size={14} className="dashboard-stat-trend" />
            </div>
            <p className="dashboard-stat-value">{stat.value}</p>
            <p className="dashboard-stat-label">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="dashboard-content-grid">
        {/* Recent Feedback */}
        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h3 className="dashboard-panel-title">Recent Feedback</h3>
            <a href="/admin/feedback" className="dashboard-panel-link">
              View all →
            </a>
          </div>
          <div className="dashboard-panel-body">
            {recentFeedback.length === 0 ? (
              <p className="dashboard-empty">No feedback entries yet</p>
            ) : (
              recentFeedback.map((fb, index) => (
                <div key={fb.id || index} className="dashboard-feedback-item">
                  <div className="dashboard-feedback-main">
                    <span className="dashboard-feedback-name">
                      {fb.name || 'Anonymous'}
                    </span>
                    <span className="dashboard-feedback-rating">
                      {'★'.repeat(Math.round(Number(fb.rating) || 0))}
                      {'☆'.repeat(5 - Math.round(Number(fb.rating) || 0))}
                    </span>
                  </div>
                  <p className="dashboard-feedback-message">
                    {fb.message ? (fb.message.length > 80 ? fb.message.slice(0, 80) + '...' : fb.message) : '—'}
                  </p>
                  <span className="dashboard-feedback-date">
                    <Clock size={11} />
                    {formatDate(fb.created_at)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h3 className="dashboard-panel-title">Quick Actions</h3>
          </div>
          <div className="dashboard-actions-grid">
            {quickActions.map((action) => (
              <a key={action.label} href={action.href} className="dashboard-action-card">
                <span>{action.label}</span>
                {action.icon}
              </a>
            ))}
          </div>

          {/* Summary Row */}
          <div className="dashboard-summary">
            <div className="dashboard-summary-item">
              <span className="dashboard-summary-value">{stats.events}</span>
              <span className="dashboard-summary-label">Events</span>
            </div>
            <div className="dashboard-summary-divider" />
            <div className="dashboard-summary-item">
              <span className="dashboard-summary-value">{stats.artifacts}</span>
              <span className="dashboard-summary-label">Artifacts</span>
            </div>
            <div className="dashboard-summary-divider" />
            <div className="dashboard-summary-item">
              <span className="dashboard-summary-value">{stats.feedbacks}</span>
              <span className="dashboard-summary-label">Feedbacks</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        /* Header */
        .dashboard-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .dashboard-title {
          font-family: var(--font-display) !important;
          font-size: 32px !important;
          font-weight: 600 !important;
          color: var(--color-on-dark);
          margin: 0 0 4px 0;
          line-height: 1.1;
        }

        .dashboard-subtitle {
          font-family: var(--font-body);
          font-size: 14px;
          color: var(--color-on-dark-soft);
          margin: 0;
        }

        .dashboard-refresh {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          color: var(--color-on-dark-soft);
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .dashboard-refresh:hover {
          background: rgba(255,255,255,0.1);
          color: var(--color-on-dark);
        }

        /* Stat Cards Grid */
        .dashboard-stats-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 16px;
        }

        @media (min-width: 640px) {
          .dashboard-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .dashboard-stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .dashboard-stat-card {
          background: var(--color-surface-dark-elevated);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: var(--radius-lg);
          padding: 24px;
          animation: dashCardIn 0.4s ease-out both;
        }

        @keyframes dashCardIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dashboard-stat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .dashboard-stat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
        }

        .dashboard-stat-trend {
          color: var(--color-success);
          opacity: 0.7;
        }

        .dashboard-stat-value {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 600;
          color: var(--color-on-dark);
          margin: 0 0 4px 0;
          line-height: 1.2;
        }

        .dashboard-stat-label {
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--color-on-dark-soft);
          margin: 0;
        }

        /* Content Grid */
        .dashboard-content-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        @media (min-width: 1024px) {
          .dashboard-content-grid {
            grid-template-columns: 1.2fr 1fr;
          }
        }

        .dashboard-panel {
          background: var(--color-surface-dark-elevated);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .dashboard-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px 0;
        }

        .dashboard-panel-title {
          font-family: var(--font-display) !important;
          font-size: 20px !important;
          font-weight: 500 !important;
          color: var(--color-on-dark);
          margin: 0;
        }

        .dashboard-panel-link {
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--color-primary);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.15s;
        }

        .dashboard-panel-link:hover {
          color: var(--color-primary-active);
        }

        .dashboard-panel-body {
          padding: 16px 24px 24px;
        }

        .dashboard-empty {
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--color-on-dark-soft);
          text-align: center;
          padding: 32px 0;
          opacity: 0.6;
        }

        /* Feedback Items */
        .dashboard-feedback-item {
          padding: 14px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }

        .dashboard-feedback-item:last-child {
          border-bottom: none;
        }

        .dashboard-feedback-main {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 4px;
        }

        .dashboard-feedback-name {
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 500;
          color: var(--color-on-dark);
        }

        .dashboard-feedback-rating {
          font-size: 13px;
          color: var(--color-accent-gold);
          letter-spacing: 1px;
        }

        .dashboard-feedback-message {
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--color-on-dark-soft);
          margin: 0 0 6px 0;
          line-height: 1.5;
        }

        .dashboard-feedback-date {
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-body);
          font-size: 11px;
          color: var(--color-on-dark-soft);
          opacity: 0.6;
        }

        /* Quick Actions */
        .dashboard-actions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          padding: 16px 24px;
        }

        .dashboard-action-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: var(--radius-md);
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          color: var(--color-on-dark-soft);
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .dashboard-action-card:hover {
          background: rgba(255,255,255,0.06);
          color: var(--color-on-dark);
          border-color: var(--color-primary);
        }

        /* Summary */
        .dashboard-summary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          padding: 20px 24px;
          border-top: 1px solid rgba(255,255,255,0.04);
        }

        .dashboard-summary-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          gap: 2px;
        }

        .dashboard-summary-value {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 600;
          color: var(--color-on-dark);
        }

        .dashboard-summary-label {
          font-family: var(--font-body);
          font-size: 11px;
          color: var(--color-on-dark-soft);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .dashboard-summary-divider {
          width: 1px;
          height: 36px;
          background: rgba(255,255,255,0.06);
        }
      `}</style>
    </div>
  );
}