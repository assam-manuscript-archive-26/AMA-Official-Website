import React, { useState, useEffect } from 'react';
import { Mail, Phone, Clock, Trash2, Search, Eye, X, Loader2, Star, Reply, Download, Filter } from 'lucide-react';
import { getAllContactSubmissions, updateContactSubmission, sendReplyEmail, deleteContactSubmission } from '../../../backend/actions/contact';

interface Contact { id: string; fullName: string; email: string; phone?: string; message: string; subject?: string; created_at: string; status: 'new' | 'read' | 'replied'; starred: boolean; }

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
  filterSelect: { padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-on-dark)', background: 'var(--color-surface-dark-elevated)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', outline: 'none', cursor: 'pointer' },
  exportBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', background: 'var(--color-primary)', color: 'var(--color-on-primary)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 500 },
  mainGrid: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16, alignItems: 'start' },
  listCard: { background: 'var(--color-surface-dark-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' },
  listHead: { padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  listHeadTitle: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--color-on-dark)', margin: 0 },
  listBody: { maxHeight: 500, overflowY: 'auto' as const },
  listItem: { padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', transition: 'background 0.15s', borderLeft: '3px solid transparent' },
  listItemActive: { background: 'rgba(255,255,255,0.04)', borderLeftColor: 'var(--color-primary)' },
  itemHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  avatar: { width: 40, height: 40, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--color-on-primary)' },
  itemName: { fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, color: 'var(--color-on-dark)' },
  itemEmail: { fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-on-dark-soft)' },
  badge: { padding: '2px 10px', borderRadius: 'var(--radius-pill)', fontSize: 11, fontFamily: 'var(--font-body)', fontWeight: 600, textTransform: 'capitalize' as const },
  starBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' },
  itemMsg: { fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-on-dark-soft)', lineHeight: 1.5, marginBottom: 8 },
  itemMeta: { display: 'flex', gap: 12, fontSize: 12, fontFamily: 'var(--font-body)', color: 'var(--color-on-dark-soft)', opacity: 0.6 },
  detailCard: { background: 'var(--color-surface-dark-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.06)', padding: 20 },
  detailHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  detailTitle: { fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--color-on-dark)', margin: 0 },
  detailContact: { display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)', marginBottom: 16 },
  detailAvatar: { width: 48, height: 48, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--color-on-primary)' },
  detailContactName: { fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600, color: 'var(--color-on-dark)' },
  detailContactEmail: { fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-on-dark-soft)' },
  detailContactPhone: { fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-on-dark-soft)' },
  detailSection: { marginBottom: 16 },
  detailLabel: { fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-on-dark-soft)', marginBottom: 4 },
  detailMsg: { fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-on-dark)', lineHeight: 1.6, padding: 12, background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)' },
  detailFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: 'var(--color-on-dark-soft)', marginBottom: 16 },
  actionRow: { display: 'flex', gap: 8, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' },
  actionBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 12px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 500 },
  modal: { position: 'fixed' as const, inset: 0, zIndex: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' },
  modalBox: { background: 'var(--color-surface-dark-elevated)', borderRadius: 'var(--radius-lg)', padding: 28, border: '1px solid rgba(255,255,255,0.1)', maxWidth: 520, width: '90%' },
  modalInput: { width: '100%', padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-on-dark)', background: 'var(--color-surface-dark)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', outline: 'none', boxSizing: 'border-box' as const },
  modalTextarea: { width: '100%', padding: '12px 14px', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-on-dark)', background: 'var(--color-surface-dark)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', outline: 'none', boxSizing: 'border-box' as const, resize: 'vertical' as const, minHeight: 160 },
  cancelBtn: { padding: '10px 20px', background: 'rgba(255,255,255,0.06)', color: 'var(--color-on-dark-soft)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)' },
  delBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', background: 'var(--color-error)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 500 },
  toast: { position: 'fixed' as const, top: 24, right: 24, zIndex: 100, padding: '14px 24px', borderRadius: 'var(--radius-md)', color: '#fff', fontSize: 14, fontFamily: 'var(--font-body)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' },
  empty: { textAlign: 'center', padding: 48, color: 'var(--color-on-dark-soft)', fontFamily: 'var(--font-body)', opacity: 0.6 },
};

export default function ContactAdmin() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected] = useState<Contact | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => { setToast({ msg, type }); setTimeout(() => setToast(null), 4000); };
  const formatDate = (d: string) => { try { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return d; } };

  useEffect(() => { (async () => { setLoading(true); const res = await getAllContactSubmissions(); if (res.success) setContacts(res.contacts || []); setLoading(false); })(); }, []);

  const filtered = contacts.filter(c => {
    const s = searchTerm.toLowerCase();
    const matchSearch = !searchTerm || c.fullName?.toLowerCase().includes(s) || c.email?.toLowerCase().includes(s) || c.message?.toLowerCase().includes(s);
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleStatusUpdate = async (id: string, status: string) => {
    try { await updateContactSubmission(id, { status }); setContacts(p => p.map(c => c.id === id ? { ...c, status: status as Contact['status'] } : c)); if (selected?.id === id) setSelected({ ...selected, status: status as Contact['status'] }); showToast('Status updated', 'success'); }
    catch { showToast('Update failed', 'error'); }
  };

  const handleToggleStar = async (id: string, starred: boolean) => {
    try { await updateContactSubmission(id, { starred }); setContacts(p => p.map(c => c.id === id ? { ...c, starred } : c)); if (selected?.id === id) setSelected({ ...selected, starred }); showToast(starred ? 'Starred' : 'Unstarred', 'success'); }
    catch { showToast('Update failed', 'error'); }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try { await deleteContactSubmission(deleteConfirm); setContacts(p => p.filter(c => c.id !== deleteConfirm)); setDeleteConfirm(null); if (selected?.id === deleteConfirm) setSelected(null); showToast('Submission deleted', 'success'); }
    catch { showToast('Delete failed', 'error'); }
  };

  const handleSendReply = () => {
    if (!selected) return;
    const encodedSubject = encodeURIComponent(replySubject);
    const encodedBody = encodeURIComponent(replyMessage);
    window.location.href = `mailto:${selected.email}?subject=${encodedSubject}&body=${encodedBody}`;
    updateContactSubmission(selected.id, { status: 'replied' }).then(() => {
      setContacts(p => p.map(c => c.id === selected.id ? { ...c, status: 'replied' } : c));
      if (selected) setSelected({ ...selected, status: 'replied' });
    });
    setShowReplyModal(false);
    showToast('Opening email client...', 'success');
  };

  const stats = { total: contacts.length, new: contacts.filter(c => c.status === 'new').length, replied: contacts.filter(c => c.status === 'replied').length, starred: contacts.filter(c => c.starred).length };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 12, color: 'var(--color-on-dark-soft)', fontFamily: 'var(--font-body)' }}><Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} /> Loading submissions...</div>;

  return (
    <div style={cs.page}>
      {toast && <div style={{ ...cs.toast, background: toast.type === 'success' ? 'var(--color-success)' : 'var(--color-error)' }}>{toast.msg}</div>}
      <div style={cs.header}>
        <div><h2 style={cs.title}>Contact Submissions</h2><p style={cs.subtitle}>{contacts.length} total submissions</p></div>
      </div>
      <div style={cs.statsGrid}>
        <div style={cs.stat}><p style={cs.statVal}>{stats.total}</p><p style={cs.statLbl}>Total</p></div>
        <div style={cs.stat}><p style={{ ...cs.statVal, color: '#c64545' }}>{stats.new}</p><p style={cs.statLbl}>New</p></div>
        <div style={cs.stat}><p style={{ ...cs.statVal, color: '#5db8a6' }}>{stats.replied}</p><p style={cs.statLbl}>Replied</p></div>
        <div style={cs.stat}><p style={{ ...cs.statVal, color: '#f59e0b' }}>{stats.starred}</p><p style={cs.statLbl}>Starred</p></div>
      </div>
      <div style={cs.toolRow}>
        <div style={cs.searchWrap}><Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-on-dark-soft)', opacity: 0.5 }} /><input style={cs.searchInput} placeholder="Search by name, email, or message..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
        <select style={cs.filterSelect} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option><option value="new">New</option><option value="read">Read</option><option value="replied">Replied</option>
        </select>
      </div>
      <div style={cs.mainGrid}>
        <div style={cs.listCard}>
          <div style={cs.listHead}><h3 style={cs.listHeadTitle}>Submissions ({filtered.length})</h3></div>
          <div style={cs.listBody}>
            {filtered.map(c => { const sc = STATUS_COLORS[c.status] || STATUS_COLORS.new; return (
              <div key={c.id} style={{ ...cs.listItem, ...(selected?.id === c.id ? cs.listItemActive : {}) }} onClick={() => { setSelected(c); if (c.status === 'new') handleStatusUpdate(c.id, 'read'); }}>
                <div style={cs.itemHead}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={cs.avatar}>{c.fullName?.charAt(0) || 'A'}</div>
                    <div><div style={cs.itemName}>{c.fullName || 'Anonymous'}</div><div style={cs.itemEmail}>{c.email}</div></div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ ...cs.badge, background: sc.bg, color: sc.text }}>{c.status}</span>
                    <button style={cs.starBtn} onClick={e => { e.stopPropagation(); handleToggleStar(c.id, !c.starred); }}><Star size={14} style={{ color: c.starred ? '#f59e0b' : 'rgba(255,255,255,0.2)', fill: c.starred ? '#f59e0b' : 'none' }} /></button>
                  </div>
                </div>
                <p style={cs.itemMsg}>{c.message ? (c.message.length > 120 ? c.message.slice(0, 120) + '...' : c.message) : '—'}</p>
                <div style={cs.itemMeta}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} />{formatDate(c.created_at)}</span>
                  {c.phone && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={11} />{c.phone}</span>}
                </div>
              </div>
            ); })}
            {filtered.length === 0 && <div style={cs.empty}>No submissions found matching your criteria</div>}
          </div>
        </div>
        <div style={cs.detailCard}>
          {selected ? (
            <div>
              <div style={cs.detailHead}>
                <h3 style={cs.detailTitle}>Message Details</h3>
                <button style={{ background: 'none', border: 'none', color: 'var(--color-on-dark-soft)', cursor: 'pointer', padding: 4 }} onClick={() => setSelected(null)}><X size={18} /></button>
              </div>
              <div style={cs.detailContact}>
                <div style={cs.detailAvatar}>{selected.fullName?.charAt(0) || 'A'}</div>
                <div><div style={cs.detailContactName}>{selected.fullName}</div><div style={cs.detailContactEmail}>{selected.email}</div>{selected.phone && <div style={cs.detailContactPhone}>{selected.phone}</div>}</div>
              </div>
              <div style={cs.detailSection}><p style={cs.detailLabel}>Message</p><div style={cs.detailMsg}>{selected.message}</div></div>
              <div style={cs.detailFooter}>
                <span>Received: {formatDate(selected.created_at)}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ ...cs.badge, background: STATUS_COLORS[selected.status].bg, color: STATUS_COLORS[selected.status].text }}>{selected.status}</span>
                  <button style={cs.starBtn} onClick={() => handleToggleStar(selected.id, !selected.starred)}><Star size={14} style={{ color: selected.starred ? '#f59e0b' : 'rgba(255,255,255,0.2)', fill: selected.starred ? '#f59e0b' : 'none' }} /></button>
                </div>
              </div>
              <div style={cs.actionRow}>
                <button style={{ ...cs.actionBtn, background: '#4a90d9', color: '#fff' }} onClick={() => handleStatusUpdate(selected.id, 'read')}><Eye size={14} /> Mark as Read</button>
                <button style={{ ...cs.actionBtn, background: '#5db8a6', color: '#fff' }} onClick={() => { setReplySubject(`Re: Your inquiry`); setReplyMessage(''); setShowReplyModal(true); }}><Reply size={14} /> Reply</button>
                <button style={{ ...cs.actionBtn, background: 'var(--color-error)', color: '#fff' }} onClick={() => { setSelected(null); setDeleteConfirm(selected.id); }}><Trash2 size={14} /> Delete</button>
              </div>
            </div>
          ) : (
            <div style={{ ...cs.empty, padding: 80 }}><Mail size={40} style={{ opacity: 0.3, marginBottom: 12 }} /><p>Select a submission to view details</p></div>
          )}
        </div>
      </div>
      {showReplyModal && selected && (
        <div style={cs.modal} onClick={() => setShowReplyModal(false)}><div style={cs.modalBox} onClick={e => e.stopPropagation()}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--color-on-dark)', margin: '0 0 20px' }}>Reply to {selected.fullName}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div><label style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-on-dark-soft)', display: 'block', marginBottom: 6 }}>Subject</label><input style={cs.modalInput} value={replySubject} onChange={e => setReplySubject(e.target.value)} placeholder="Subject..." /></div>
            <div><label style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-on-dark-soft)', display: 'block', marginBottom: 6 }}>Message</label><textarea style={cs.modalTextarea} value={replyMessage} onChange={e => setReplyMessage(e.target.value)} placeholder="Type your reply here..." rows={8} /></div>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
            <button style={cs.cancelBtn} onClick={() => setShowReplyModal(false)}>Cancel</button>
            <button style={{ ...cs.actionBtn, background: 'var(--color-primary)', color: 'var(--color-on-primary)' }} onClick={handleSendReply}><Reply size={14} /> Send Reply</button>
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