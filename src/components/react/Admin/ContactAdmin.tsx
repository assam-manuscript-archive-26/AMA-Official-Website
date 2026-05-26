import React, { useState, useEffect } from 'react';
import { Mail, Phone, Clock, Trash2, Search, Eye, X, Star, Reply } from 'lucide-react';
import { getAllContactSubmissions, updateContactSubmission, deleteContactSubmission } from '../../../backend/actions/contact';
import EditDialog, { DialogGrid } from './EditDialog';
import AdminSpinner from './AdminSpinner';

interface Contact { id: string; fullName: string; email: string; phone?: string; message: string; subject?: string; created_at: string; status: 'new' | 'read' | 'replied'; starred: boolean; }

const STATUS_TOKENS: Record<string, { color: string; tint: string; border: string }> = {
  new: {
    color: 'var(--color-error)',
    tint: 'color-mix(in srgb, var(--color-error) 14%, transparent)',
    border: 'color-mix(in srgb, var(--color-error) 30%, transparent)',
  },
  read: {
    color: '#3a78c0',
    tint: 'color-mix(in srgb, #3a78c0 14%, transparent)',
    border: 'color-mix(in srgb, #3a78c0 30%, transparent)',
  },
  replied: {
    color: 'var(--color-accent-teal)',
    tint: 'color-mix(in srgb, var(--color-accent-teal) 16%, transparent)',
    border: 'color-mix(in srgb, var(--color-accent-teal) 32%, transparent)',
  },
};

export default function ContactAdmin() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected] = useState<Contact | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => { setToast({ msg, type }); setTimeout(() => setToast(null), 4000); };
  const formatDate = (d: string) => { try { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return d; } };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getAllContactSubmissions();
      if (res.success) setContacts(res.contacts || []);
      setLoading(false);
    })();
  }, []);

  const filtered = contacts.filter(c => {
    const s = searchTerm.toLowerCase();
    const matchSearch = !searchTerm || c.fullName?.toLowerCase().includes(s) || c.email?.toLowerCase().includes(s) || c.message?.toLowerCase().includes(s);
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateContactSubmission(id, { status });
      setContacts(p => p.map(c => c.id === id ? { ...c, status: status as Contact['status'] } : c));
      if (selected?.id === id) setSelected({ ...selected, status: status as Contact['status'] });
    } catch { showToast('Update failed', 'error'); }
  };

  const handleToggleStar = async (id: string, starred: boolean) => {
    try {
      await updateContactSubmission(id, { starred });
      setContacts(p => p.map(c => c.id === id ? { ...c, starred } : c));
      if (selected?.id === id) setSelected({ ...selected, starred });
    } catch { showToast('Update failed', 'error'); }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteContactSubmission(deleteConfirm);
      setContacts(p => p.filter(c => c.id !== deleteConfirm));
      setDeleteConfirm(null);
      if (selected?.id === deleteConfirm) setSelected(null);
      showToast('Submission deleted', 'success');
    } catch { showToast('Delete failed', 'error'); }
  };

  const handleSendReply = async () => {
    if (!selected) return;
    setSending(true);
    const encodedSubject = encodeURIComponent(replySubject);
    const encodedBody = encodeURIComponent(replyMessage);
    window.location.href = `mailto:${selected.email}?subject=${encodedSubject}&body=${encodedBody}`;
    try {
      await updateContactSubmission(selected.id, { status: 'replied' });
      setContacts(p => p.map(c => c.id === selected.id ? { ...c, status: 'replied' } : c));
      setSelected(s => s ? { ...s, status: 'replied' } : s);
    } catch {}
    setShowReplyModal(false);
    setSending(false);
    showToast('Opening email client...', 'success');
  };

  const stats = {
    total: contacts.length,
    new: contacts.filter(c => c.status === 'new').length,
    replied: contacts.filter(c => c.status === 'replied').length,
    starred: contacts.filter(c => c.starred).length,
  };

  if (loading) return <AdminSpinner label="Loading submissions..." />;

  return (
    <div className="contact-page">
      {toast && (
        <div className={`ax-toast ${toast.type === 'success' ? 'ax-toast--success' : 'ax-toast--error'}`}>
          {toast.msg}
        </div>
      )}

      <div className="ax-page-header">
        <div>
          <h2 className="ax-page-title">Contact Submissions</h2>
          <p className="ax-page-subtitle">{contacts.length} total submissions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="contact-stats-grid">
        <div className="contact-stat">
          <p className="contact-stat-val">{stats.total}</p>
          <p className="contact-stat-lbl">Total</p>
        </div>
        <div className="contact-stat">
          <p className="contact-stat-val" style={{ color: 'var(--color-error)' }}>{stats.new}</p>
          <p className="contact-stat-lbl">New</p>
        </div>
        <div className="contact-stat">
          <p className="contact-stat-val" style={{ color: 'var(--color-accent-teal)' }}>{stats.replied}</p>
          <p className="contact-stat-lbl">Replied</p>
        </div>
        <div className="contact-stat">
          <p className="contact-stat-val" style={{ color: 'var(--color-accent-gold)' }}>{stats.starred}</p>
          <p className="contact-stat-lbl">Starred</p>
        </div>
      </div>

      {/* Tools */}
      <div className="ax-tool-row">
        <div className="ax-search-wrap">
          <Search size={15} />
          <input
            className="ax-search-input"
            placeholder="Search by name, email, or message..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="ax-select"
          style={{ width: 'auto', minWidth: 160 }}
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
        </select>
      </div>

      <div className="contact-main-grid">
        {/* List */}
        <div className="contact-list-card">
          <div className="contact-list-head">
            <h3 className="contact-list-title">Submissions <span>({filtered.length})</span></h3>
          </div>
          <div className="contact-list-body">
            {filtered.map(c => {
              const sc = STATUS_TOKENS[c.status] || STATUS_TOKENS.new;
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`contact-list-item ${selected?.id === c.id ? 'contact-list-item--active' : ''}`}
                  onClick={() => { setSelected(c); if (c.status === 'new') handleStatusUpdate(c.id, 'read'); }}
                >
                  <div className="contact-list-item-head">
                    <div className="contact-list-item-author">
                      <div className="contact-avatar">{c.fullName?.charAt(0) || 'A'}</div>
                      <div>
                        <div className="contact-list-name">{c.fullName || 'Anonymous'}</div>
                        <div className="contact-list-email">{c.email}</div>
                      </div>
                    </div>
                    <div className="contact-list-meta">
                      <span
                        className="contact-badge"
                        style={{ background: sc.tint, color: sc.color, borderColor: sc.border }}
                      >
                        {c.status}
                      </span>
                      <button
                        type="button"
                        className="contact-star-btn"
                        onClick={e => { e.stopPropagation(); handleToggleStar(c.id, !c.starred); }}
                        aria-label={c.starred ? 'Unstar' : 'Star'}
                      >
                        <Star size={14} fill={c.starred ? 'currentColor' : 'none'} style={{ color: c.starred ? 'var(--color-accent-gold)' : 'var(--admin-text-muted)' }} />
                      </button>
                    </div>
                  </div>
                  <p className="contact-list-msg">
                    {c.message ? (c.message.length > 120 ? c.message.slice(0, 120) + '...' : c.message) : '—'}
                  </p>
                  <div className="contact-list-foot">
                    <span><Clock size={11} />{formatDate(c.created_at)}</span>
                    {c.phone && <span><Phone size={11} />{c.phone}</span>}
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="contact-empty">
                No submissions found matching your criteria
              </div>
            )}
          </div>
        </div>

        {/* Detail panel — desktop sticky sidebar */}
        <div className="contact-detail-card">
          {selected ? (
            <div>
              <div className="contact-detail-head">
                <h3 className="contact-detail-title">Message details</h3>
                <button type="button" className="ax-icon-btn" onClick={() => setSelected(null)} aria-label="Close detail">
                  <X size={15} />
                </button>
              </div>

              <div className="contact-detail-author">
                <div className="contact-avatar contact-avatar--lg">{selected.fullName?.charAt(0) || 'A'}</div>
                <div>
                  <div className="contact-detail-name">{selected.fullName}</div>
                  <a href={`mailto:${selected.email}`} className="contact-detail-email">{selected.email}</a>
                  {selected.phone && (
                    <a href={`tel:${selected.phone}`} className="contact-detail-phone">{selected.phone}</a>
                  )}
                </div>
              </div>

              <div className="contact-detail-section">
                <p className="contact-detail-label">Message</p>
                <div className="contact-detail-msg">{selected.message}</div>
              </div>

              <div className="contact-detail-foot">
                <span>Received: {formatDate(selected.created_at)}</span>
                <div className="contact-detail-foot-meta">
                  <span
                    className="contact-badge"
                    style={{
                      background: STATUS_TOKENS[selected.status].tint,
                      color: STATUS_TOKENS[selected.status].color,
                      borderColor: STATUS_TOKENS[selected.status].border,
                    }}
                  >
                    {selected.status}
                  </span>
                  <button
                    type="button"
                    className="contact-star-btn"
                    onClick={() => handleToggleStar(selected.id, !selected.starred)}
                    aria-label={selected.starred ? 'Unstar' : 'Star'}
                  >
                    <Star size={14} fill={selected.starred ? 'currentColor' : 'none'} style={{ color: selected.starred ? 'var(--color-accent-gold)' : 'var(--admin-text-muted)' }} />
                  </button>
                </div>
              </div>

              <div className="contact-action-row">
                <button
                  type="button"
                  className="ax-btn ax-btn--secondary contact-action-btn"
                  onClick={() => handleStatusUpdate(selected.id, 'read')}
                >
                  <Eye size={14} /> Mark Read
                </button>
                <button
                  type="button"
                  className="ax-btn ax-btn--primary contact-action-btn"
                  onClick={() => { setReplySubject('Re: Your inquiry'); setReplyMessage(''); setShowReplyModal(true); }}
                >
                  <Reply size={14} /> Reply
                </button>
                <button
                  type="button"
                  className="ax-btn ax-btn--danger contact-action-btn"
                  onClick={() => { setDeleteConfirm(selected.id); }}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="contact-detail-empty">
              <Mail size={36} />
              <p>Select a submission to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Reply dialog */}
      <EditDialog
        open={showReplyModal && !!selected}
        onClose={() => setShowReplyModal(false)}
        title={selected ? `Reply to ${selected.fullName}` : 'Reply'}
        subtitle={selected?.email}
        size="md"
        onSave={handleSendReply}
        saving={sending}
        saveLabel="Send reply"
      >
        <DialogGrid cols={1}>
          <div>
            <label className="ax-label">Subject</label>
            <input
              className="ax-input"
              value={replySubject}
              onChange={e => setReplySubject(e.target.value)}
              placeholder="Subject..."
            />
          </div>
          <div>
            <label className="ax-label">Message</label>
            <textarea
              className="ax-textarea"
              rows={8}
              value={replyMessage}
              onChange={e => setReplyMessage(e.target.value)}
              placeholder="Type your reply here..."
              style={{ minHeight: 180 }}
            />
          </div>
        </DialogGrid>
      </EditDialog>

      {/* Delete confirm */}
      <EditDialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete submission?"
        subtitle="This action cannot be undone."
        size="md"
        onSave={handleDelete}
        saveLabel="Delete submission"
      >
        <div className="contact-delete-body">
          <Trash2 size={28} />
          <p>The contact submission will be permanently removed.</p>
        </div>
      </EditDialog>

      <style>{`
        .contact-page { width: 100%; }

        .contact-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }
        .contact-stat {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--radius-lg);
          padding: 16px;
          text-align: center;
          transition: border-color 0.15s ease;
        }
        .contact-stat:hover { border-color: var(--admin-border-strong); }
        .contact-stat-val {
          font-family: var(--font-display);
          font-size: 26px;
          font-weight: 600;
          color: var(--admin-text);
          margin: 4px 0;
          line-height: 1.1;
        }
        .contact-stat-lbl {
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--admin-text-soft);
          margin: 0;
        }

        .contact-main-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 16px;
          align-items: start;
        }
        @media (max-width: 980px) {
          .contact-main-grid { grid-template-columns: 1fr; }
        }

        .contact-list-card {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .contact-list-head {
          padding: 14px 18px;
          border-bottom: 1px solid var(--admin-divider);
        }
        .contact-list-title {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 600;
          color: var(--admin-text);
          margin: 0;
        }
        .contact-list-title span {
          color: var(--admin-text-muted);
          font-weight: 400;
          font-family: var(--font-body);
          font-size: 14px;
        }

        .contact-list-body {
          max-height: 600px;
          overflow-y: auto;
        }

        .contact-list-item {
          display: block;
          width: 100%;
          text-align: left;
          padding: 14px 18px;
          border: none;
          border-bottom: 1px solid var(--admin-divider);
          border-left: 3px solid transparent;
          background: transparent;
          color: inherit;
          cursor: pointer;
          transition: background 0.15s ease, border-color 0.15s ease;
          outline: none;
          font-family: inherit;
        }
        .contact-list-item:hover {
          background: var(--admin-hover-bg);
        }
        .contact-list-item:focus-visible {
          background: var(--admin-hover-bg);
          box-shadow: inset 0 0 0 2px var(--color-primary);
        }
        .contact-list-item--active {
          background: color-mix(in srgb, var(--color-primary) 8%, transparent);
          border-left-color: var(--color-primary);
        }
        .contact-list-item--active:hover {
          background: color-mix(in srgb, var(--color-primary) 12%, transparent);
        }

        .contact-list-item-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
          gap: 10px;
        }
        .contact-list-item-author {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }
        .contact-list-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        .contact-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 600;
          color: var(--color-on-primary);
          flex-shrink: 0;
        }
        .contact-avatar--lg { width: 48px; height: 48px; font-size: 20px; }

        .contact-list-name {
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 600;
          color: var(--admin-text);
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 200px;
        }
        .contact-list-email {
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--admin-text-soft);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 200px;
        }

        .contact-badge {
          padding: 2px 10px;
          border-radius: var(--radius-pill);
          border: 1px solid;
          font-size: 10px;
          font-family: var(--font-body);
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .contact-star-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
          transition: background 0.15s ease;
          outline: none;
        }
        .contact-star-btn:hover { background: var(--admin-hover-bg); }
        .contact-star-btn:focus-visible { box-shadow: var(--admin-focus-ring); }

        .contact-list-msg {
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--admin-text-soft);
          line-height: 1.5;
          margin: 0 0 8px;
        }
        .contact-list-foot {
          display: flex;
          gap: 14px;
          font-size: 12px;
          font-family: var(--font-body);
          color: var(--admin-text-muted);
        }
        .contact-list-foot span {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .contact-empty {
          padding: 56px 24px;
          text-align: center;
          color: var(--admin-text-muted);
          font-family: var(--font-body);
          font-size: 13px;
        }

        /* Detail panel */
        .contact-detail-card {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--radius-lg);
          padding: 20px;
          position: sticky;
          top: 88px;
        }
        @media (max-width: 980px) {
          .contact-detail-card { position: static; }
        }

        .contact-detail-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .contact-detail-title {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 600;
          color: var(--admin-text);
          margin: 0;
        }

        .contact-detail-author {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          background: var(--admin-chip-bg);
          border: 1px solid var(--admin-divider);
          border-radius: var(--radius-md);
          margin-bottom: 16px;
        }
        .contact-detail-name {
          font-family: var(--font-body);
          font-size: 16px;
          font-weight: 600;
          color: var(--admin-text);
          line-height: 1.2;
          margin-bottom: 2px;
        }
        .contact-detail-email,
        .contact-detail-phone {
          display: block;
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--admin-text-soft);
          text-decoration: none;
          line-height: 1.4;
          transition: color 0.15s ease;
        }
        .contact-detail-email:hover,
        .contact-detail-phone:hover { color: var(--color-primary); }

        .contact-detail-section { margin-bottom: 16px; }
        .contact-detail-label {
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--admin-text-muted);
          margin: 0 0 6px;
        }
        .contact-detail-msg {
          font-family: var(--font-body);
          font-size: 14px;
          color: var(--admin-text);
          line-height: 1.6;
          padding: 14px;
          background: var(--admin-chip-bg);
          border: 1px solid var(--admin-divider);
          border-radius: var(--radius-md);
          white-space: pre-wrap;
          word-break: break-word;
        }

        .contact-detail-foot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--admin-text-muted);
          font-family: var(--font-body);
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .contact-detail-foot-meta {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .contact-action-row {
          display: flex;
          gap: 6px;
          padding-top: 16px;
          border-top: 1px solid var(--admin-divider);
        }
        .contact-action-btn {
          flex: 1;
          padding: 9px 10px;
          font-size: 12px;
          gap: 5px;
          white-space: nowrap;
        }

        .contact-detail-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 60px 24px;
          text-align: center;
          color: var(--admin-text-muted);
          font-family: var(--font-body);
          font-size: 13px;
        }
        .contact-detail-empty svg {
          opacity: 0.4;
        }

        .contact-delete-body {
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
        .contact-delete-body svg {
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
