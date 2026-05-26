import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Plus, Edit2, Trash2, Search, Star, CalendarCheck } from 'lucide-react';
import { getAllEvents, createEvent, updateEvent, deleteEvent } from '../../../backend/actions/events';
import EditDialog, { DialogGrid } from './EditDialog';
import AdminSpinner from './AdminSpinner';

interface Event { id: string; title: string; description: string; date: string; time: string; location: string; category: string; featured: boolean; }

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'exhibition', label: 'Exhibitions' },
  { id: 'workshop', label: 'Workshops' },
  { id: 'lecture', label: 'Lectures' },
  { id: 'cultural', label: 'Cultural' },
  { id: 'special', label: 'Special' },
];
const CAT_COLORS: Record<string, string> = { exhibition: '#4a90d9', workshop: '#5db8a6', lecture: '#9b6fb5', cultural: '#cc785c', special: '#c9a227' };

export default function EventsAdmin() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [saving, setSaving] = useState(false);
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

  const openCreate = () => {
    setEditing(null);
    setFormData({ title: '', description: '', date: '', time: '', location: '', category: 'exhibition', featured: false });
    setShowModal(true);
  };

  const openEdit = (e: Event) => {
    setEditing(e);
    setFormData({
      title: e.title,
      description: e.description,
      date: e.date?.split('T')[0] || '',
      time: e.time || '',
      location: e.location || '',
      category: e.category || 'exhibition',
      featured: e.featured || false,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.title) { showToast('Title is required', 'error'); return; }
    setSaving(true);
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
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteEvent(deleteId);
      setEvents(p => p.filter(e => e.id !== deleteId));
      setDeleteId(null);
      showToast('Event deleted', 'success');
    } catch { showToast('Delete failed', 'error'); }
  };

  if (loading) return <AdminSpinner label="Loading events..." />;

  return (
    <div className="events-page">
      {toast && (
        <div className={`ax-toast ${toast.type === 'success' ? 'ax-toast--success' : 'ax-toast--error'}`}>
          {toast.msg}
        </div>
      )}

      <div className="ax-page-header">
        <div>
          <h2 className="ax-page-title">Events Manager</h2>
          <p className="ax-page-subtitle">{filtered.length} event{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="ax-btn ax-btn--primary" onClick={openCreate}>
          <Plus size={15} /> New Event
        </button>
      </div>

      <div className="ax-tool-row">
        <div className="ax-search-wrap">
          <Search size={15} />
          <input
            className="ax-search-input"
            placeholder="Search events..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="ax-filter-bar">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedCat(c.id)}
            className={`ax-chip ${selectedCat === c.id ? 'ax-chip--active' : ''}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="events-grid">
        {filtered.map(event => {
          const catColor = CAT_COLORS[event.category] || 'var(--color-primary)';
          return (
            <div key={event.id} className="events-card">
              {event.featured && (
                <div className="events-feat-badge" aria-label="Featured">
                  <Star size={14} fill="currentColor" strokeWidth={0} />
                </div>
              )}
              <span
                className="events-cat-badge"
                style={{
                  background: `color-mix(in srgb, ${catColor} 16%, transparent)`,
                  color: catColor,
                  borderColor: `color-mix(in srgb, ${catColor} 32%, transparent)`,
                }}
              >
                {event.category}
              </span>
              <h3 className="events-card-title">{event.title}</h3>
              <p className="events-card-desc">
                {event.description ? (event.description.length > 130 ? event.description.slice(0, 130) + '...' : event.description) : '—'}
              </p>
              <div className="events-meta-row">
                {event.date && <span className="events-meta"><Calendar size={13} /> {formatDate(event.date)}</span>}
                {event.time && <span className="events-meta"><Clock size={13} /> {event.time}</span>}
                {event.location && <span className="events-meta"><MapPin size={13} /> {event.location}</span>}
              </div>
              <div className="events-card-actions">
                <button type="button" className="ax-action-btn ax-action-btn--edit" onClick={() => openEdit(event)}>
                  <Edit2 size={13} /> Edit
                </button>
                <button type="button" className="ax-action-btn ax-action-btn--delete" onClick={() => setDeleteId(event.id)}>
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="ax-empty">
          <div className="ax-empty-icon"><CalendarCheck size={22} /></div>
          <h3 className="ax-empty-title">No events found</h3>
          <p>Try adjusting your search or filter.</p>
        </div>
      )}

      {/* Create / Edit dialog */}
      <EditDialog
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Edit Event' : 'New Event'}
        subtitle={editing ? 'Update event details' : 'Create a new event'}
        size="md"
        onSave={handleSave}
        saving={saving}
        saveLabel={editing ? 'Update event' : 'Create event'}
      >
        <DialogGrid cols={1}>
          <div>
            <label className="ax-label">Title *</label>
            <input
              className="ax-input"
              value={formData.title}
              onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
              placeholder="Event title"
            />
          </div>
          <div>
            <label className="ax-label">Description</label>
            <textarea
              className="ax-textarea"
              rows={3}
              value={formData.description}
              onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
              placeholder="Event description"
            />
          </div>
        </DialogGrid>

        <div style={{ marginTop: 16 }}>
          <DialogGrid cols={2}>
            <div>
              <label className="ax-label">Date</label>
              <input
                className="ax-input"
                type="date"
                value={formData.date}
                onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
              />
            </div>
            <div>
              <label className="ax-label">Time</label>
              <input
                className="ax-input"
                type="time"
                value={formData.time}
                onChange={e => setFormData(p => ({ ...p, time: e.target.value }))}
              />
            </div>
          </DialogGrid>
        </div>

        <div style={{ marginTop: 16 }}>
          <DialogGrid cols={1}>
            <div>
              <label className="ax-label">Location</label>
              <input
                className="ax-input"
                value={formData.location}
                onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                placeholder="Event location"
              />
            </div>
            <div>
              <label className="ax-label">Category</label>
              <select
                className="ax-select"
                value={formData.category}
                onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
              >
                {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          </DialogGrid>
        </div>

        <label className="events-feat-toggle">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={e => setFormData(p => ({ ...p, featured: e.target.checked }))}
          />
          <span className="events-feat-toggle-track" aria-hidden="true">
            <span className="events-feat-toggle-thumb" />
          </span>
          <span className="events-feat-toggle-label">
            <Star size={14} fill={formData.featured ? 'currentColor' : 'none'} />
            Featured event
          </span>
        </label>
      </EditDialog>

      {/* Delete confirm */}
      <EditDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete event?"
        subtitle="This action cannot be undone."
        size="md"
        onSave={handleDelete}
        saveLabel="Delete event"
      >
        <div className="events-delete-body">
          <Trash2 size={28} />
          <p>The event will be permanently removed.</p>
        </div>
      </EditDialog>

      <style>{`
        .events-page { width: 100%; }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 16px;
        }

        .events-card {
          position: relative;
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--radius-lg);
          padding: 20px;
          transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
          display: flex;
          flex-direction: column;
        }
        .events-card:hover {
          border-color: var(--admin-border-strong);
          box-shadow: var(--admin-shadow-md);
          transform: translateY(-2px);
        }

        .events-feat-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: color-mix(in srgb, var(--color-accent-gold) 16%, transparent);
          color: var(--color-accent-gold);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .events-cat-badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: var(--radius-pill);
          border: 1px solid;
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 12px;
          align-self: flex-start;
        }

        .events-card-title {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 500;
          color: var(--admin-text);
          margin: 0 0 8px;
          line-height: 1.25;
          padding-right: 30px;
        }

        .events-card-desc {
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--admin-text-soft);
          line-height: 1.6;
          margin: 0 0 14px;
        }

        .events-meta-row {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }
        .events-meta {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-family: var(--font-body);
          color: var(--admin-text-muted);
        }

        .events-card-actions {
          display: flex;
          justify-content: flex-end;
          gap: 6px;
          padding-top: 14px;
          border-top: 1px solid var(--admin-divider);
          margin-top: auto;
        }

        /* Featured toggle */
        .events-feat-toggle {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-top: 18px;
          cursor: pointer;
          user-select: none;
        }
        .events-feat-toggle input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }
        .events-feat-toggle-track {
          width: 38px;
          height: 22px;
          border-radius: 9999px;
          background: var(--admin-divider);
          border: 1px solid var(--admin-border);
          position: relative;
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }
        .events-feat-toggle-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #fff;
          transition: transform 0.2s ease, background 0.2s ease;
          box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        .events-feat-toggle input:checked + .events-feat-toggle-track {
          background: var(--color-accent-gold);
          border-color: var(--color-accent-gold);
        }
        .events-feat-toggle input:checked + .events-feat-toggle-track .events-feat-toggle-thumb {
          transform: translateX(16px);
        }
        .events-feat-toggle input:focus-visible + .events-feat-toggle-track {
          box-shadow: var(--admin-focus-ring);
        }
        .events-feat-toggle-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          color: var(--admin-text);
        }
        .events-feat-toggle-label svg { color: var(--color-accent-gold); }

        .events-delete-body {
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
        .events-delete-body svg {
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
