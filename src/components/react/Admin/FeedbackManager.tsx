import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Search, Trash2, X, Loader2, ChevronRight, User, Mail, Clock } from 'lucide-react';
import { getAllFeedback, getFeedbackStats, deleteFeedback } from '../../../backend/actions/feedback';

interface Feedback { id: string; name: string; email: string; rating: number; message: string; created_at: string; }

const cs: Record<string, React.CSSProperties> = {
  page: { width: '100%' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap' as const, gap: 12 },
  title: { fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 600, color: 'var(--color-on-dark)', margin: 0 },
  subtitle: { fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-on-dark-soft)', margin: '4px 0 0' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 },
  statCard: { background: 'var(--color-surface-dark-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.06)', padding: 20 },
  statValue: { fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600, color: 'var(--color-on-dark)', margin: '8px 0 2px' },
  statLabel: { fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-on-dark-soft)' },
  statIcon: { width: 40, height: 40, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  searchWrap: { position: 'relative' as const, marginBottom: 20 },
  searchInput: { width: '100%', padding: '10px 14px 10px 40px', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-on-dark)', background: 'var(--color-surface-dark-elevated)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', outline: 'none', boxSizing: 'border-box' as const },
  list: { display: 'flex', flexDirection: 'column' as const, gap: 12 },
  card: { background: 'var(--color-surface-dark-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.06)', padding: 20, cursor: 'pointer', transition: 'border-color 0.15s' },
  cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardName: { fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, color: 'var(--color-on-dark)' },
  stars: { fontSize: 14, color: 'var(--color-accent-gold)', letterSpacing: 1 },
  cardMsg: { fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-on-dark-soft)', lineHeight: 1.6, margin: '0 0 8px' },
  cardMeta: { display: 'flex', gap: 16, alignItems: 'center', fontSize: 12, fontFamily: 'var(--font-body)', color: 'var(--color-on-dark-soft)', opacity: 0.6 },
  modal: { position: 'fixed' as const, inset: 0, zIndex: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' },
  modalBox: { background: 'var(--color-surface-dark-elevated)', borderRadius: 'var(--radius-lg)', padding: 28, border: '1px solid rgba(255,255,255,0.1)', maxWidth: 500, width: '90%' },
  delBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--color-error)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 500 },
  cancelBtn: { padding: '8px 16px', background: 'rgba(255,255,255,0.06)', color: 'var(--color-on-dark-soft)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)' },
  toast: { position: 'fixed' as const, top: 24, right: 24, zIndex: 100, padding: '14px 24px', borderRadius: 'var(--radius-md)', color: '#fff', fontSize: 14, fontFamily: 'var(--font-body)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' },
};

export default function FeedbackManager() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, averageRating: '0.0' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<Feedback | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: string | null }>({ show: false, id: null });
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const triggerToast = (msg: string, type: 'success' | 'error') => { setToast({ msg, type }); setTimeout(() => setToast(null), 4000); };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [fbRes, statsRes] = await Promise.allSettled([getAllFeedback({ sort: { created_at: 'desc' } }), getFeedbackStats()]);
      if (fbRes.status === 'fulfilled' && fbRes.value.success) setFeedbacks(fbRes.value.feedbacks || []);
      if (statsRes.status === 'fulfilled' && statsRes.value.success) setStats({ total: statsRes.value.total, averageRating: statsRes.value.averageRating });
      setLoading(false);
    })();
  }, []);

  const filtered = [...feedbacks].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).filter(f => {
    if (!searchTerm) return true;
    const t = searchTerm.toLowerCase();
    return f.name?.toLowerCase().includes(t) || f.email?.toLowerCase().includes(t) || f.message?.toLowerCase().includes(t);
  });

  const handleDelete = async () => {
    if (!deleteConfirm.id) return;
    try { await deleteFeedback(deleteConfirm.id); setFeedbacks(p => p.filter(f => f.id !== deleteConfirm.id)); setDeleteConfirm({ show: false, id: null }); setSelected(null); triggerToast('Feedback deleted', 'success'); }
    catch { triggerToast('Delete failed', 'error'); }
  };

  const formatDate = (d: string) => { try { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); } catch { return d; } };
  const renderStars = (r: number) => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));
  const ratingDist = [5, 4, 3, 2, 1].map(r => ({ rating: r, count: feedbacks.filter(f => Math.round(f.rating) === r).length }));

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 12, color: 'var(--color-on-dark-soft)', fontFamily: 'var(--font-body)', fontSize: 14 }}><Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} /> Loading feedback...</div>;

  return (
    <div style={cs.page}>
      {toast && <div style={{ ...cs.toast, background: toast.type === 'success' ? 'var(--color-success)' : 'var(--color-error)' }}>{toast.msg}</div>}

      <div style={cs.header}>
        <div><h2 style={cs.title}>Feedback Manager</h2><p style={cs.subtitle}>{feedbacks.length} feedback entries</p></div>
      </div>

      {/* Stats */}
      <div style={cs.statsGrid}>
        <div style={cs.statCard}>
          <div style={{ ...cs.statIcon, background: 'rgba(93,184,166,0.15)', color: '#5db8a6' }}><MessageSquare size={20} /></div>
          <p style={cs.statValue}>{stats.total}</p>
          <p style={cs.statLabel}>Total Feedback</p>
        </div>
        <div style={cs.statCard}>
          <div style={{ ...cs.statIcon, background: 'rgba(201,162,39,0.15)', color: '#c9a227' }}><Star size={20} /></div>
          <p style={cs.statValue}>{stats.averageRating}</p>
          <p style={cs.statLabel}>Average Rating</p>
        </div>
        <div style={cs.statCard}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {ratingDist.map(r => (
              <div key={r.rating} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontFamily: 'var(--font-body)', color: 'var(--color-on-dark-soft)' }}>
                <span style={{ width: 16 }}>{r.rating}★</span>
                <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${feedbacks.length ? (r.count / feedbacks.length) * 100 : 0}%`, background: 'var(--color-accent-gold)', borderRadius: 2, transition: 'width 0.3s' }} />
                </div>
                <span style={{ width: 24, textAlign: 'right' }}>{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={cs.searchWrap}>
        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-on-dark-soft)', opacity: 0.5 }} />
        <input style={cs.searchInput} placeholder="Search by name, email, or message..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>

      {/* Feedback List */}
      <div style={cs.list}>
        {filtered.map(fb => (
          <div key={fb.id} style={cs.card} onClick={() => setSelected(fb)}>
            <div style={cs.cardHead}>
              <span style={cs.cardName}>{fb.name || 'Anonymous'}</span>
              <span style={cs.stars}>{renderStars(fb.rating)}</span>
            </div>
            <p style={cs.cardMsg}>{fb.message ? (fb.message.length > 150 ? fb.message.slice(0, 150) + '...' : fb.message) : '—'}</p>
            <div style={cs.cardMeta}>
              {fb.email && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={11} />{fb.email}</span>}
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} />{formatDate(fb.created_at)}</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-on-dark-soft)', fontFamily: 'var(--font-body)', opacity: 0.6 }}>No feedback found</div>}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div style={cs.modal} onClick={() => setSelected(null)}>
          <div style={cs.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--color-on-dark)', margin: 0 }}>Feedback Detail</h3>
              <button style={{ background: 'none', border: 'none', color: 'var(--color-on-dark-soft)', cursor: 'pointer' }} onClick={() => setSelected(null)}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div><span style={{ fontSize: 12, color: 'var(--color-on-dark-soft)', fontFamily: 'var(--font-body)' }}>Name</span><p style={{ fontSize: 15, color: 'var(--color-on-dark)', fontFamily: 'var(--font-body)', margin: '2px 0 0' }}>{selected.name || 'Anonymous'}</p></div>
              <div><span style={{ fontSize: 12, color: 'var(--color-on-dark-soft)', fontFamily: 'var(--font-body)' }}>Email</span><p style={{ fontSize: 14, color: 'var(--color-on-dark)', fontFamily: 'var(--font-body)', margin: '2px 0 0' }}>{selected.email || '—'}</p></div>
              <div><span style={{ fontSize: 12, color: 'var(--color-on-dark-soft)', fontFamily: 'var(--font-body)' }}>Rating</span><p style={{ fontSize: 18, color: 'var(--color-accent-gold)', margin: '2px 0 0' }}>{renderStars(selected.rating)}</p></div>
              <div><span style={{ fontSize: 12, color: 'var(--color-on-dark-soft)', fontFamily: 'var(--font-body)' }}>Message</span><p style={{ fontSize: 14, color: 'var(--color-on-dark)', fontFamily: 'var(--font-body)', lineHeight: 1.6, margin: '2px 0 0' }}>{selected.message || '—'}</p></div>
              <div><span style={{ fontSize: 12, color: 'var(--color-on-dark-soft)', fontFamily: 'var(--font-body)' }}>Date</span><p style={{ fontSize: 13, color: 'var(--color-on-dark-soft)', fontFamily: 'var(--font-body)', margin: '2px 0 0' }}>{formatDate(selected.created_at)}</p></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button style={cs.cancelBtn} onClick={() => setSelected(null)}>Close</button>
              <button style={cs.delBtn} onClick={() => { setSelected(null); setDeleteConfirm({ show: true, id: selected.id }); }}><Trash2 size={14} /> Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm.show && (
        <div style={cs.modal} onClick={() => setDeleteConfirm({ show: false, id: null })}>
          <div style={cs.modalBox} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--color-on-dark)', margin: '0 0 12px' }}>Delete Feedback?</h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-on-dark-soft)', margin: '0 0 20px' }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button style={cs.cancelBtn} onClick={() => setDeleteConfirm({ show: false, id: null })}>Cancel</button>
              <button style={cs.delBtn} onClick={handleDelete}><Trash2 size={14} /> Delete</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
