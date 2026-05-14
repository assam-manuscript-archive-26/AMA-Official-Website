import React, { useState, useEffect } from 'react';
import { Mail, User, Phone, Clock, Trash2, Search, Eye, X, Loader2, MessageSquare, Star, StarOff } from 'lucide-react';
import { getAllContactSubmissions, updateContactStatus, deleteContactSubmission } from '../../../backend/actions/contact';

interface Contact { id: string; name: string; email: string; subject?: string; message: string; created_at: string; status: string; }

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  new: { bg: 'rgba(198,69,69,0.15)', text: '#c64545' }, read: { bg: 'rgba(74,144,217,0.15)', text: '#4a90d9' }, replied: { bg: 'rgba(93,184,166,0.15)', text: '#5db8a6' },
};

const cs: Record<string, React.CSSProperties> = {
  page: { width: '100%' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap' as const, gap: 12 },
  title: { fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 600, color: 'var(--color-on-dark)', margin: 0 },
  subtitle: { fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-on-dark-soft)', margin: '4px 0 0' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 },
  stat: { background: 'var(--color-surface-dark-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.06)', padding: 16, textAlign: 'center' as const },
  statVal: { fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 600, color: 'var(--color-on-dark)', margin: '4px 0' },
  statLbl: { fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-on-dark-soft)' },
  toolRow: { display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' as const },
  searchWrap: { position: 'relative' as const, flex: 1, minWidth: 200 },
  searchInput: { width: '100%', padding: '10px 14px 10px 40px', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-on-dark)', background: 'var(--color-surface-dark-elevated)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', outline: 'none', boxSizing: 'border-box' as const },
  filterBar: { display: 'flex', gap: 6, marginBottom: 20 },
  chip: { padding: '6px 14px', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-on-dark-soft)', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 500 },
  chipActive: { background: 'var(--color-primary)', color: 'var(--color-on-primary)', borderColor: 'var(--color-primary)' },
  list: { display: 'flex', flexDirection: 'column' as const, gap: 10 },
  card: { background: 'var(--color-surface-dark-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.06)', padding: 16, cursor: 'pointer', transition: 'border-color 0.15s' },
  cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardName: { fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, color: 'var(--color-on-dark)' },
  badge: { padding: '2px 10px', borderRadius: 'var(--radius-pill)', fontSize: 11, fontFamily: 'var(--font-body)', fontWeight: 600, textTransform: 'capitalize' as const },
  cardMsg: { fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-on-dark-soft)', lineHeight: 1.5, margin: '0 0 8px' },
  cardMeta: { display: 'flex', gap: 12, fontSize: 12, fontFamily: 'var(--font-body)', color: 'var(--color-on-dark-soft)', opacity: 0.6 },
  modal: { position: 'fixed' as const, inset: 0, zIndex: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' },
  modalBox: { background: 'var(--color-surface-dark-elevated)', borderRadius: 'var(--radius-lg)', padding: 28, border: '1px solid rgba(255,255,255,0.1)', maxWidth: 520, width: '90%' },
  cancelBtn: { padding: '8px 16px', background: 'rgba(255,255,255,0.06)', color: 'var(--color-on-dark-soft)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)' },
  delBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--color-error)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 500 },
  statusBtn: { padding: '6px 14px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 500 },
  toast: { position: 'fixed' as const, top: 24, right: 24, zIndex: 100, padding: '14px 24px', borderRadius: 'var(--radius-md)', color: '#fff', fontSize: 14, fontFamily: 'var(--font-body)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' },
};

export default function ContactAdmin() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected] = useState<Contact | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => { setToast({ msg, type }); setTimeout(() => setToast(null), 4000); };
  const formatDate = (d: string) => { try { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return d; } };

  useEffect(() => { (async () => { setLoading(true); const res = await getAllContactSubmissions({ limit: 1000 }); if (res.success) setContacts(res.contacts || []); setLoading(false); })(); }, []);

  const filtered = contacts.filter(c => {
    const s = searchTerm.toLowerCase();
    const matchSearch = !searchTerm || c.name?.toLowerCase().includes(s) || c.email?.toLowerCase().includes(s) || c.message?.toLowerCase().includes(s);
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleStatusUpdate = async (id: string, status: string) => {
    try { await updateContactStatus(id, status); setContacts(p => p.map(c => c.id === id ? { ...c, status } : c)); if (selected?.id === id) setSelected({ ...selected, status }); showToast('Status updated', 'success'); }
    catch { showToast('Update failed', 'error'); }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try { await deleteContactSubmission(deleteConfirm); setContacts(p => p.filter(c => c.id !== deleteConfirm)); setDeleteConfirm(null); setSelected(null); showToast('Submission deleted', 'success'); }
    catch { showToast('Delete failed', 'error'); }
  };

  const stats = { total: contacts.length, new: contacts.filter(c => c.status === 'new').length, read: contacts.filter(c => c.status === 'read').length, replied: contacts.filter(c => c.status === 'replied').length };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 12, color: 'var(--color-on-dark-soft)', fontFamily: 'var(--font-body)' }}><Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} /> Loading submissions...</div>;

  return (
    <div style={cs.page}>
      {toast && <div style={{ ...cs.toast, background: toast.type === 'success' ? 'var(--color-success)' : 'var(--color-error)' }}>{toast.msg}</div>}
      <div style={cs.header}><div><h2 style={cs.title}>Contact Submissions</h2><p style={cs.subtitle}>{contacts.length} total submissions</p></div></div>
      <div style={cs.statsGrid}>
        <div style={cs.stat}><p style={cs.statVal}>{stats.total}</p><p style={cs.statLbl}>Total</p></div>
        <div style={cs.stat}><p style={{ ...cs.statVal, color: '#c64545' }}>{stats.new}</p><p style={cs.statLbl}>New</p></div>
        <div style={cs.stat}><p style={{ ...cs.statVal, color: '#4a90d9' }}>{stats.read}</p><p style={cs.statLbl}>Read</p></div>
        <div style={cs.stat}><p style={{ ...cs.statVal, color: '#5db8a6' }}>{stats.replied}</p><p style={cs.statLbl}>Replied</p></div>
      </div>
      <div style={cs.toolRow}><div style={cs.searchWrap}><Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-on-dark-soft)', opacity: 0.5 }} /><input style={cs.searchInput} placeholder="Search submissions..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div></div>
      <div style={cs.filterBar}>{['all', 'new', 'read', 'replied'].map(s => <button key={s} onClick={() => setFilterStatus(s)} style={{ ...cs.chip, ...(filterStatus === s ? cs.chipActive : {}) }}>{s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}</button>)}</div>
      <div style={cs.list}>
        {filtered.map(c => { const sc = STATUS_COLORS[c.status] || STATUS_COLORS.new; return (
          <div key={c.id} style={cs.card} onClick={() => { setSelected(c); if (c.status === 'new') handleStatusUpdate(c.id, 'read'); }}>
            <div style={cs.cardHead}><span style={cs.cardName}>{c.name || 'Anonymous'}</span><span style={{ ...cs.badge, background: sc.bg, color: sc.text }}>{c.status}</span></div>
            {c.subject && <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: 'var(--color-on-dark)', margin: '0 0 4px' }}>{c.subject}</p>}
            <p style={cs.cardMsg}>{c.message ? (c.message.length > 140 ? c.message.slice(0, 140) + '...' : c.message) : '—'}</p>
            <div style={cs.cardMeta}>{c.email && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={11} />{c.email}</span>}<span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} />{formatDate(c.created_at)}</span></div>
          </div>
        ); })}
        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-on-dark-soft)', fontFamily: 'var(--font-body)', opacity: 0.6 }}>No submissions found</div>}
      </div>
      {/* Detail Modal */}
      {selected && (
        <div style={cs.modal} onClick={() => setSelected(null)}><div style={cs.modalBox} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--color-on-dark)', margin: 0 }}>Submission Detail</h3>
            <button style={{ background: 'none', border: 'none', color: 'var(--color-on-dark-soft)', cursor: 'pointer' }} onClick={() => setSelected(null)}><X size={18} /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div><span style={{ fontSize: 12, color: 'var(--color-on-dark-soft)', fontFamily: 'var(--font-body)' }}>Name</span><p style={{ fontSize: 15, color: 'var(--color-on-dark)', fontFamily: 'var(--font-body)', margin: '2px 0 0' }}>{selected.name}</p></div>
            <div><span style={{ fontSize: 12, color: 'var(--color-on-dark-soft)', fontFamily: 'var(--font-body)' }}>Email</span><p style={{ fontSize: 14, color: 'var(--color-on-dark)', fontFamily: 'var(--font-body)', margin: '2px 0 0' }}>{selected.email}</p></div>
            {selected.subject && <div><span style={{ fontSize: 12, color: 'var(--color-on-dark-soft)', fontFamily: 'var(--font-body)' }}>Subject</span><p style={{ fontSize: 14, color: 'var(--color-on-dark)', fontFamily: 'var(--font-body)', margin: '2px 0 0' }}>{selected.subject}</p></div>}
            <div><span style={{ fontSize: 12, color: 'var(--color-on-dark-soft)', fontFamily: 'var(--font-body)' }}>Message</span><p style={{ fontSize: 14, color: 'var(--color-on-dark)', fontFamily: 'var(--font-body)', lineHeight: 1.6, margin: '2px 0 0' }}>{selected.message}</p></div>
            <div><span style={{ fontSize: 12, color: 'var(--color-on-dark-soft)', fontFamily: 'var(--font-body)' }}>Date</span><p style={{ fontSize: 13, color: 'var(--color-on-dark-soft)', fontFamily: 'var(--font-body)', margin: '2px 0 0' }}>{formatDate(selected.created_at)}</p></div>
            <div><span style={{ fontSize: 12, color: 'var(--color-on-dark-soft)', fontFamily: 'var(--font-body)' }}>Status</span>
              <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                {['new', 'read', 'replied'].map(s => { const sc = STATUS_COLORS[s]; return <button key={s} onClick={() => handleStatusUpdate(selected.id, s)} style={{ ...cs.statusBtn, background: selected.status === s ? sc.text : sc.bg, color: selected.status === s ? '#fff' : sc.text }}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>; })}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button style={cs.cancelBtn} onClick={() => setSelected(null)}>Close</button>
            <button style={cs.delBtn} onClick={() => { setSelected(null); setDeleteConfirm(selected.id); }}><Trash2 size={14} /> Delete</button>
          </div>
        </div></div>
      )}
      {deleteConfirm && (
        <div style={cs.modal} onClick={() => setDeleteConfirm(null)}><div style={{ ...cs.modalBox, maxWidth: 420 }} onClick={e => e.stopPropagation()}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--color-on-dark)', margin: '0 0 12px' }}>Delete Submission?</h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-on-dark-soft)', margin: '0 0 20px' }}>This action cannot be undone.</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}><button style={cs.cancelBtn} onClick={() => setDeleteConfirm(null)}>Cancel</button><button style={cs.delBtn} onClick={handleDelete}><Trash2 size={14} /> Delete</button></div>
        </div></div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
