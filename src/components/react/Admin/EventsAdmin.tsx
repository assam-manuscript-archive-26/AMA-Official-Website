import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Plus, Edit2, Trash2, Save, X, Search, Filter, Star, Loader2 } from 'lucide-react';
import { getAllEvents, createEvent, updateEvent, deleteEvent } from '../../../backend/actions/events';

interface Event { id: string; title: string; description: string; date: string; time: string; location: string; category: string; featured: boolean; }

const CATEGORIES = [
  { id: 'all', label: 'All' }, { id: 'exhibition', label: 'Exhibitions' }, { id: 'workshop', label: 'Workshops' },
  { id: 'lecture', label: 'Lectures' }, { id: 'cultural', label: 'Cultural' }, { id: 'special', label: 'Special' },
];
const CAT_COLORS: Record<string, string> = { exhibition: '#4a90d9', workshop: '#5db8a6', lecture: '#9b6fb5', cultural: '#cc785c', special: '#c9a227' };

const cs: Record<string, React.CSSProperties> = {
  page: { width: '100%' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap' as const, gap: 12 },
  title: { fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 600, color: 'var(--color-on-dark)', margin: 0 },
  subtitle: { fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-on-dark-soft)', margin: '4px 0 0' },
  addBtn: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'var(--color-primary)', color: 'var(--color-on-primary)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600 },
  toolRow: { display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' as const },
  searchWrap: { position: 'relative' as const, flex: 1, minWidth: 200 },
  searchInput: { width: '100%', padding: '10px 14px 10px 40px', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-on-dark)', background: 'var(--color-surface-dark-elevated)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', outline: 'none', boxSizing: 'border-box' as const },
  filterBar: { display: 'flex', gap: 6, flexWrap: 'wrap' as const, marginBottom: 20 },
  chip: { padding: '6px 14px', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-on-dark-soft)', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 500 },
  chipActive: { background: 'var(--color-primary)', color: 'var(--color-on-primary)', borderColor: 'var(--color-primary)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 },
  card: { background: 'var(--color-surface-dark-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.06)', padding: 20, position: 'relative' as const },
  catBadge: { display: 'inline-block', padding: '3px 10px', borderRadius: 'var(--radius-pill)', fontSize: 11, fontFamily: 'var(--font-body)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginBottom: 10 },
  cardTitle: { fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 500, color: 'var(--color-on-dark)', margin: '0 0 8px' },
  cardDesc: { fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-on-dark-soft)', lineHeight: 1.6, margin: '0 0 12px' },
  metaRow: { display: 'flex', gap: 16, flexWrap: 'wrap' as const, marginBottom: 12 },
  meta: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontFamily: 'var(--font-body)', color: 'var(--color-on-dark-soft)' },
  cardActions: { display: 'flex', justifyContent: 'flex-end', gap: 6, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.04)' },
  actionBtn: { padding: '6px 12px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 4 },
  editBtn: { background: 'rgba(93,184,166,0.15)', color: '#5db8a6' },
  delBtn: { background: 'rgba(198,69,69,0.15)', color: 'var(--color-error)' },
  modal: { position: 'fixed' as const, inset: 0, zIndex: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' },
  modalBox: { background: 'var(--color-surface-dark-elevated)', borderRadius: 'var(--radius-lg)', padding: 28, border: '1px solid rgba(255,255,255,0.1)', maxWidth: 520, width: '90%', maxHeight: '85vh', overflowY: 'auto' as const },
  label: { fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'var(--color-on-dark-soft)', marginBottom: 4, display: 'block' },
  input: { width: '100%', padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-on-dark)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', outline: 'none', boxSizing: 'border-box' as const },
  select: { width: '100%', padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-on-dark)', background: 'var(--color-surface-dark-elevated)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', outline: 'none', boxSizing: 'border-box' as const },
  textarea: { width: '100%', padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-on-dark)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', outline: 'none', resize: 'vertical' as const, boxSizing: 'border-box' as const },
  saveBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: 'var(--color-primary)', color: 'var(--color-on-primary)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 14, fontFamily: 'var(--font-body)', fontWeight: 600 },
  cancelBtn: { padding: '10px 20px', background: 'rgba(255,255,255,0.06)', color: 'var(--color-on-dark-soft)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 14, fontFamily: 'var(--font-body)' },
  toast: { position: 'fixed' as const, top: 24, right: 24, zIndex: 100, padding: '14px 24px', borderRadius: 'var(--radius-md)', color: '#fff', fontSize: 14, fontFamily: 'var(--font-body)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' },
  featBadge: { position: 'absolute' as const, top: 12, right: 12 },
};

export default function EventsAdmin() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', date: '', time: '', location: '', category: 'exhibition', featured: false });

  const showToast = (msg: string, type: 'success' | 'error') => { setToast({ msg, type }); setTimeout(() => setToast(null), 4000); };
  const formatDate = (d: string) => { try { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); } catch { return d; } };

  useEffect(() => { (async () => { setLoading(true); const res = await getAllEvents(); if (res.success) setEvents(res.events); setLoading(false); })(); }, []);

  const filtered = events.filter(e => {
    const s = searchTerm.toLowerCase();
    const matchSearch = !searchTerm || e.title?.toLowerCase().includes(s) || e.description?.toLowerCase().includes(s);
    const matchCat = selectedCat === 'all' || e.category === selectedCat;
    return matchSearch && matchCat;
  });

  const openCreate = () => { setEditing(null); setFormData({ title: '', description: '', date: '', time: '', location: '', category: 'exhibition', featured: false }); setShowModal(true); };
  const openEdit = (e: Event) => { setEditing(e); setFormData({ title: e.title, description: e.description, date: e.date?.split('T')[0] || '', time: e.time || '', location: e.location || '', category: e.category || 'exhibition', featured: e.featured || false }); setShowModal(true); };

  const handleSave = async () => {
    if (!formData.title) { showToast('Title is required', 'error'); return; }
    try {
      if (editing) {
        await updateEvent(editing.id, formData);
        setEvents(p => p.map(e => e.id === editing.id ? { ...e, ...formData } : e));
        showToast('Event updated', 'success');
      } else {
        const res = await createEvent(formData);
        if (res.success && res.event) setEvents(p => [res.event, ...p]);
        showToast('Event created', 'success');
      }
      setShowModal(false);
    } catch { showToast('Save failed', 'error'); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await deleteEvent(deleteId); setEvents(p => p.filter(e => e.id !== deleteId)); setDeleteId(null); showToast('Event deleted', 'success'); }
    catch { showToast('Delete failed', 'error'); }
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 12, color: 'var(--color-on-dark-soft)', fontFamily: 'var(--font-body)' }}><Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} /> Loading events...</div>;

  return (
    <div style={cs.page}>
      {toast && <div style={{ ...cs.toast, background: toast.type === 'success' ? 'var(--color-success)' : 'var(--color-error)' }}>{toast.msg}</div>}

      <div style={cs.header}>
        <div><h2 style={cs.title}>Events Manager</h2><p style={cs.subtitle}>{filtered.length} event{filtered.length !== 1 ? 's' : ''}</p></div>
        <button style={cs.addBtn} onClick={openCreate}><Plus size={16} /> New Event</button>
      </div>

      <div style={cs.toolRow}>
        <div style={cs.searchWrap}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-on-dark-soft)', opacity: 0.5 }} />
          <input style={cs.searchInput} placeholder="Search events..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div style={cs.filterBar}>{CATEGORIES.map(c => <button key={c.id} onClick={() => setSelectedCat(c.id)} style={{ ...cs.chip, ...(selectedCat === c.id ? cs.chipActive : {}) }}>{c.label}</button>)}</div>

      <div style={cs.grid}>
        {filtered.map(event => {
          const catColor = CAT_COLORS[event.category] || '#888';
          return (
            <div key={event.id} style={cs.card}>
              {event.featured && <div style={cs.featBadge}><Star size={16} fill="#c9a227" color="#c9a227" /></div>}
              <span style={{ ...cs.catBadge, background: `${catColor}20`, color: catColor }}>{event.category}</span>
              <h3 style={cs.cardTitle}>{event.title}</h3>
              <p style={cs.cardDesc}>{event.description ? (event.description.length > 120 ? event.description.slice(0, 120) + '...' : event.description) : '—'}</p>
              <div style={cs.metaRow}>
                {event.date && <span style={cs.meta}><Calendar size={13} /> {formatDate(event.date)}</span>}
                {event.time && <span style={cs.meta}><Clock size={13} /> {event.time}</span>}
                {event.location && <span style={cs.meta}><MapPin size={13} /> {event.location}</span>}
              </div>
              <div style={cs.cardActions}>
                <button style={{ ...cs.actionBtn, ...cs.editBtn }} onClick={() => openEdit(event)}><Edit2 size={13} /> Edit</button>
                <button style={{ ...cs.actionBtn, ...cs.delBtn }} onClick={() => setDeleteId(event.id)}><Trash2 size={13} /> Delete</button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-on-dark-soft)', fontFamily: 'var(--font-body)', opacity: 0.6 }}>No events found</div>}

      {/* Create/Edit Modal */}
      {showModal && (
        <div style={cs.modal} onClick={() => setShowModal(false)}>
          <div style={cs.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--color-on-dark)', margin: 0 }}>{editing ? 'Edit Event' : 'New Event'}</h3>
              <button style={{ background: 'none', border: 'none', color: 'var(--color-on-dark-soft)', cursor: 'pointer' }} onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label style={cs.label}>Title *</label><input style={cs.input} value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} placeholder="Event title" /></div>
              <div><label style={cs.label}>Description</label><textarea style={cs.textarea} rows={3} value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} placeholder="Event description" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={cs.label}>Date</label><input style={cs.input} type="date" value={formData.date} onChange={e => setFormData(p => ({ ...p, date: e.target.value }))} /></div>
                <div><label style={cs.label}>Time</label><input style={cs.input} type="time" value={formData.time} onChange={e => setFormData(p => ({ ...p, time: e.target.value }))} /></div>
              </div>
              <div><label style={cs.label}>Location</label><input style={cs.input} value={formData.location} onChange={e => setFormData(p => ({ ...p, location: e.target.value }))} placeholder="Event location" /></div>
              <div><label style={cs.label}>Category</label>
                <select style={cs.select} value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}>
                  {CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" id="featured" checked={formData.featured} onChange={e => setFormData(p => ({ ...p, featured: e.target.checked }))} />
                <label htmlFor="featured" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-on-dark-soft)', cursor: 'pointer' }}>Featured Event</label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button style={cs.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={cs.saveBtn} onClick={handleSave}><Save size={14} /> {editing ? 'Update' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div style={cs.modal} onClick={() => setDeleteId(null)}>
          <div style={{ ...cs.modalBox, maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--color-on-dark)', margin: '0 0 12px' }}>Delete Event?</h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-on-dark-soft)', margin: '0 0 20px' }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button style={cs.cancelBtn} onClick={() => setDeleteId(null)}>Cancel</button>
              <button style={{ ...cs.saveBtn, background: 'var(--color-error)' }} onClick={handleDelete}><Trash2 size={14} /> Delete</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
