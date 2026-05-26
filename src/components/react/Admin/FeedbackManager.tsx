import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Search, Trash2, Mail, Clock } from 'lucide-react';
import { getAllFeedback, getFeedbackStats, deleteFeedback } from '../../../backend/actions/feedback';
import EditDialog from './EditDialog';
import AdminSpinner from './AdminSpinner';

interface Feedback { id: string; name: string; email: string; rating: number; message: string; created_at: string; }

type RatingFilter = 'all' | 1 | 2 | 3 | 4 | 5;

export default function FeedbackManager() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, averageRating: '0.0' });
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('all');
  const [selected, setSelected] = useState<Feedback | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: string | null }>({ show: false, id: null });
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const triggerToast = (msg: string, type: 'success' | 'error') => { setToast({ msg, type }); setTimeout(() => setToast(null), 4000); };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [fbRes, statsRes] = await Promise.allSettled([getAllFeedback({ sort: { created_at: 'desc' } }), getFeedbackStats()]);
      if (fbRes.status === 'fulfilled' && fbRes.value.success) setFeedbacks(fbRes.value.feedbacks || []);
      if (statsRes.status === 'fulfilled' && statsRes.value.success) setStats({ total: statsRes.value.total, averageRating: statsRes.value.averageRating ?? '0.0' });
      setLoading(false);
    })();
  }, []);

  const filtered = [...feedbacks]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .filter(f => {
      const matchesSearch = !searchTerm || (() => {
        const t = searchTerm.toLowerCase();
        return f.name?.toLowerCase().includes(t) || f.email?.toLowerCase().includes(t) || f.message?.toLowerCase().includes(t);
      })();
      const matchesRating = ratingFilter === 'all' || Math.round(Number(f.rating) || 0) === ratingFilter;
      return matchesSearch && matchesRating;
    });

  const handleDelete = async () => {
    if (!deleteConfirm.id) return;
    try {
      await deleteFeedback(deleteConfirm.id);
      setFeedbacks(p => p.filter(f => f.id !== deleteConfirm.id));
      setDeleteConfirm({ show: false, id: null });
      setSelected(null);
      triggerToast('Feedback deleted', 'success');
    } catch { triggerToast('Delete failed', 'error'); }
  };

  const formatDate = (d: string) => { try { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); } catch { return d; } };
  const renderStars = (r: number) => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));
  const ratingDist = [5, 4, 3, 2, 1].map(r => ({ rating: r, count: feedbacks.filter(f => Math.round(f.rating) === r).length }));

  if (loading) return <AdminSpinner label="Loading feedback..." />;

  return (
    <div className="feedback-page">
      {toast && (
        <div className={`ax-toast ${toast.type === 'success' ? 'ax-toast--success' : 'ax-toast--error'}`}>
          {toast.msg}
        </div>
      )}

      <div className="ax-page-header">
        <div>
          <h2 className="ax-page-title">Feedback Manager</h2>
          <p className="ax-page-subtitle">{feedbacks.length} feedback entries</p>
        </div>
      </div>

      {/* Stats */}
      <div className="feedback-stats-grid">
        <div className="feedback-stat-card">
          <div className="ax-stat-tint" style={{ background: 'color-mix(in srgb, var(--color-accent-teal) 16%, transparent)', color: 'var(--color-accent-teal)' }}>
            <MessageSquare size={20} />
          </div>
          <p className="feedback-stat-value">{stats.total}</p>
          <p className="feedback-stat-label">Total Feedback</p>
        </div>

        <div className="feedback-stat-card">
          <div className="ax-stat-tint" style={{ background: 'color-mix(in srgb, var(--color-accent-gold) 18%, transparent)', color: 'var(--color-accent-gold)' }}>
            <Star size={20} />
          </div>
          <p className="feedback-stat-value">{stats.averageRating}</p>
          <p className="feedback-stat-label">Average Rating</p>
        </div>

        <div className="feedback-stat-card feedback-stat-card--dist">
          <p className="feedback-dist-title">Rating distribution</p>
          {ratingDist.map(r => (
            <div key={r.rating} className="feedback-dist-row">
              <span className="feedback-dist-label">{r.rating}★</span>
              <div className="feedback-dist-track">
                <div
                  className="feedback-dist-bar"
                  style={{ width: `${feedbacks.length ? (r.count / feedbacks.length) * 100 : 0}%` }}
                />
              </div>
              <span className="feedback-dist-count">{r.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="ax-search-wrap" style={{ marginBottom: 14, maxWidth: 480 }}>
        <Search size={15} />
        <input
          className="ax-search-input"
          placeholder="Search by name, email, or message..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Star rating filter chips */}
      <div className="ax-filter-bar">
        <button
          type="button"
          onClick={() => setRatingFilter('all')}
          className={`ax-chip ${ratingFilter === 'all' ? 'ax-chip--active-gold' : ''}`}
        >
          All ratings
        </button>
        {([5, 4, 3, 2, 1] as const).map(n => (
          <button
            key={n}
            type="button"
            onClick={() => setRatingFilter(n)}
            className={`ax-chip ${ratingFilter === n ? 'ax-chip--active-gold' : ''}`}
            aria-label={`Filter by ${n} star`}
          >
            <Star size={12} fill="currentColor" strokeWidth={0} />
            <span>{n}</span>
            <span className="feedback-chip-count">
              {feedbacks.filter(f => Math.round(Number(f.rating) || 0) === n).length}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="feedback-list">
        {filtered.map(fb => (
          <div
            key={fb.id}
            className="feedback-card"
            onClick={() => setSelected(fb)}
            tabIndex={0}
            role="button"
            onKeyDown={e => { if (e.key === 'Enter') setSelected(fb); }}
          >
            <div className="feedback-card-head">
              <span className="feedback-card-name">{fb.name || 'Anonymous'}</span>
              <span className="feedback-card-stars">{renderStars(fb.rating)}</span>
            </div>
            <p className="feedback-card-msg">
              {fb.message ? (fb.message.length > 150 ? fb.message.slice(0, 150) + '...' : fb.message) : '—'}
            </p>
            <div className="feedback-card-meta">
              {fb.email && <span><Mail size={11} />{fb.email}</span>}
              <span><Clock size={11} />{formatDate(fb.created_at)}</span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="ax-empty">
            <div className="ax-empty-icon"><MessageSquare size={22} /></div>
            <h3 className="ax-empty-title">No feedback matches</h3>
            <p>Try adjusting the search or rating filter.</p>
          </div>
        )}
      </div>

      {/* Detail dialog */}
      <EditDialog
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Feedback details"
        subtitle={selected ? formatDate(selected.created_at) : undefined}
        size="md"
        hideFooter
      >
        {selected && (
          <div className="feedback-detail">
            <div className="feedback-detail-row">
              <span className="feedback-detail-label">Name</span>
              <p className="feedback-detail-value">{selected.name || 'Anonymous'}</p>
            </div>
            <div className="feedback-detail-row">
              <span className="feedback-detail-label">Email</span>
              <p className="feedback-detail-value">{selected.email || '—'}</p>
            </div>
            <div className="feedback-detail-row">
              <span className="feedback-detail-label">Rating</span>
              <p className="feedback-detail-stars">{renderStars(selected.rating)}</p>
            </div>
            <div className="feedback-detail-row">
              <span className="feedback-detail-label">Message</span>
              <p className="feedback-detail-message">{selected.message || '—'}</p>
            </div>
            <div className="feedback-detail-actions">
              <button type="button" className="ax-btn ax-btn--secondary" onClick={() => setSelected(null)}>
                Close
              </button>
              <button
                type="button"
                className="ax-btn ax-btn--danger"
                onClick={() => { setSelected(null); setDeleteConfirm({ show: true, id: selected.id }); }}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        )}
      </EditDialog>

      {/* Delete confirm */}
      <EditDialog
        open={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, id: null })}
        title="Delete feedback?"
        subtitle="This action cannot be undone."
        size="md"
        onSave={handleDelete}
        saveLabel="Delete"
      >
        <div className="feedback-delete-body">
          <Trash2 size={28} />
          <p>The selected feedback will be permanently removed.</p>
        </div>
      </EditDialog>

      <style>{`
        .feedback-page { width: 100%; }

        .feedback-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        .feedback-stat-card {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--radius-lg);
          padding: 20px;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .feedback-stat-card:hover {
          border-color: var(--admin-border-strong);
        }
        .feedback-stat-value {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 600;
          color: var(--admin-text);
          margin: 12px 0 2px;
          line-height: 1.1;
        }
        .feedback-stat-label {
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--admin-text-soft);
          margin: 0;
        }

        .feedback-stat-card--dist {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .feedback-dist-title {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--admin-text-muted);
          margin: 0 0 6px;
        }
        .feedback-dist-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          font-family: var(--font-body);
          color: var(--admin-text-soft);
        }
        .feedback-dist-label {
          width: 24px;
          color: var(--color-accent-gold);
          font-weight: 500;
        }
        .feedback-dist-track {
          flex: 1;
          height: 6px;
          background: var(--admin-divider);
          border-radius: 3px;
          overflow: hidden;
        }
        .feedback-dist-bar {
          height: 100%;
          background: var(--color-accent-gold);
          border-radius: 3px;
          transition: width 0.4s ease;
        }
        .feedback-dist-count {
          width: 24px;
          text-align: right;
          color: var(--admin-text);
          font-weight: 500;
        }

        .feedback-chip-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 6px;
          margin-left: 2px;
          height: 16px;
          background: var(--admin-divider);
          color: var(--admin-text-muted);
          border-radius: var(--radius-pill);
          font-size: 10px;
          font-weight: 600;
          min-width: 16px;
        }
        .ax-chip--active-gold .feedback-chip-count {
          background: rgba(255,255,255,0.22);
          color: #ffffff;
        }

        .feedback-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .feedback-card {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--radius-lg);
          padding: 18px 20px;
          cursor: pointer;
          transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
          outline: none;
        }
        .feedback-card:hover {
          border-color: var(--admin-border-strong);
          box-shadow: var(--admin-shadow-sm);
          transform: translateY(-1px);
        }
        .feedback-card:focus-visible {
          box-shadow: var(--admin-focus-ring);
        }
        .feedback-card-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          gap: 10px;
        }
        .feedback-card-name {
          font-family: var(--font-body);
          font-size: 15px;
          font-weight: 600;
          color: var(--admin-text);
        }
        .feedback-card-stars {
          font-size: 14px;
          color: var(--color-accent-gold);
          letter-spacing: 1px;
          flex-shrink: 0;
        }
        .feedback-card-msg {
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--admin-text-soft);
          line-height: 1.6;
          margin: 0 0 8px;
        }
        .feedback-card-meta {
          display: flex;
          gap: 16px;
          align-items: center;
          font-size: 12px;
          font-family: var(--font-body);
          color: var(--admin-text-muted);
          flex-wrap: wrap;
        }
        .feedback-card-meta span {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        /* Detail */
        .feedback-detail {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .feedback-detail-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .feedback-detail-label {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--admin-text-muted);
        }
        .feedback-detail-value {
          font-size: 15px;
          color: var(--admin-text);
          font-family: var(--font-body);
          margin: 0;
        }
        .feedback-detail-stars {
          font-size: 20px;
          color: var(--color-accent-gold);
          margin: 0;
          letter-spacing: 2px;
        }
        .feedback-detail-message {
          font-size: 14px;
          color: var(--admin-text);
          font-family: var(--font-body);
          line-height: 1.6;
          margin: 0;
          padding: 14px;
          background: var(--admin-chip-bg);
          border-radius: var(--radius-md);
          border: 1px solid var(--admin-divider);
        }
        .feedback-detail-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 8px;
          padding-top: 16px;
          border-top: 1px solid var(--admin-divider);
        }

        .feedback-delete-body {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
          text-align: center;
          color: var(--admin-text-soft);
          font-family: var(--font-body);
          font-size: 14px;
        }
        .feedback-delete-body svg {
          color: var(--color-error);
          padding: 12px;
          background: color-mix(in srgb, var(--color-error) 12%, transparent);
          border-radius: 50%;
          box-sizing: content-box;
        }
      `}</style>
    </div>
  );
}
