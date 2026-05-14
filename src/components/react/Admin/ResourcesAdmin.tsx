import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Star, StarOff, Save, X, Loader2, LayoutGrid, List, BookOpen } from 'lucide-react';
import { getAllNews, createNews, updateNews, deleteNews } from '../../../backend/actions/news';

interface Resource { id: string; title: string; excerpt: string; content?: string; category: string; featured: boolean; tags: string[]; published_at: string; image?: string; author?: string; }

const CATEGORIES = [
  { id: 'all', label: 'All' }, { id: 'achievements', label: 'Achievements' }, { id: 'exhibition', label: 'Exhibitions' },
  { id: 'workshop', label: 'Workshops' }, { id: 'cultural', label: 'Cultural' }, { id: 'latest news', label: 'Latest News' },
];
const CAT_COLORS: Record<string, string> = { achievements: '#5db8a6', exhibition: '#4a90d9', workshop: '#9b6fb5', cultural: '#cc785c', 'latest news': '#4ab8c9' };

const cs: Record<string, React.CSSProperties> = {
  page: { width: '100%' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap' as const, gap: 12 },
  title: { fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 600, color: 'var(--color-on-dark)', margin: 0 },
  subtitle: { fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-on-dark-soft)', margin: '4px 0 0' },
  addBtn: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'var(--color-primary)', color: 'var(--color-on-primary)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600 },
  toolRow: { display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' as const, alignItems: 'center' },
  searchWrap: { position: 'relative' as const, flex: 1, minWidth: 200 },
  searchInput: { width: '100%', padding: '10px 14px 10px 40px', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-on-dark)', background: 'var(--color-surface-dark-elevated)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', outline: 'none', boxSizing: 'border-box' as const },
  filterBar: { display: 'flex', gap: 6, flexWrap: 'wrap' as const, marginBottom: 20 },
  chip: { padding: '6px 14px', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-on-dark-soft)', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 500 },
  chipActive: { background: 'var(--color-primary)', color: 'var(--color-on-primary)', borderColor: 'var(--color-primary)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 },
  card: { background: 'var(--color-surface-dark-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' },
  cardBody: { padding: 16 },
  cardCat: { fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginBottom: 6, display: 'inline-block', padding: '3px 10px', borderRadius: 'var(--radius-pill)' },
  cardTitle: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, color: 'var(--color-on-dark)', margin: '0 0 6px' },
  cardExcerpt: { fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-on-dark-soft)', lineHeight: 1.6, margin: '0 0 12px' },
  cardMeta: { display: 'flex', gap: 12, fontSize: 12, fontFamily: 'var(--font-body)', color: 'var(--color-on-dark-soft)', opacity: 0.6, marginBottom: 12 },
  tagWrap: { display: 'flex', flexWrap: 'wrap' as const, gap: 4, marginBottom: 12 },
  tag: { padding: '2px 8px', borderRadius: 'var(--radius-pill)', background: 'rgba(255,255,255,0.06)', fontSize: 11, fontFamily: 'var(--font-body)', color: 'var(--color-on-dark-soft)' },
  cardActions: { display: 'flex', justifyContent: 'flex-end', gap: 6, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.04)' },
  actionBtn: { padding: '6px 12px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 4 },
  editBtn: { background: 'rgba(93,184,166,0.15)', color: '#5db8a6' },
  delBtn: { background: 'rgba(198,69,69,0.15)', color: 'var(--color-error)' },
  featBtn: { background: 'rgba(201,162,39,0.15)', color: '#c9a227' },
  modal: { position: 'fixed' as const, inset: 0, zIndex: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' },
  modalBox: { background: 'var(--color-surface-dark-elevated)', borderRadius: 'var(--radius-lg)', padding: 28, border: '1px solid rgba(255,255,255,0.1)', maxWidth: 540, width: '90%', maxHeight: '85vh', overflowY: 'auto' as const },
  label: { fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'var(--color-on-dark-soft)', marginBottom: 4, display: 'block' },
  input: { width: '100%', padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-on-dark)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', outline: 'none', boxSizing: 'border-box' as const },
  select: { width: '100%', padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-on-dark)', background: 'var(--color-surface-dark-elevated)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', outline: 'none', boxSizing: 'border-box' as const },
  textarea: { width: '100%', padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-on-dark)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', outline: 'none', resize: 'vertical' as const, boxSizing: 'border-box' as const },
  saveBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', background: 'var(--color-primary)', color: 'var(--color-on-primary)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 14, fontFamily: 'var(--font-body)', fontWeight: 600 },
  cancelBtn: { padding: '10px 20px', background: 'rgba(255,255,255,0.06)', color: 'var(--color-on-dark-soft)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 14, fontFamily: 'var(--font-body)' },
  toast: { position: 'fixed' as const, top: 24, right: 24, zIndex: 100, padding: '14px 24px', borderRadius: 'var(--radius-md)', color: '#fff', fontSize: 14, fontFamily: 'var(--font-body)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' },
};

export default function ResourcesAdmin() {
  const [items, setItems] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', category: 'achievements', featured: false, tags: [] as string[], image: '', author: '' });

  const showToast = (msg: string, type: 'success' | 'error') => { setToast({ msg, type }); setTimeout(() => setToast(null), 4000); };
  const formatDate = (d: string) => { try { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); } catch { return d; } };

  useEffect(() => { (async () => { setLoading(true); const res = await getAllNews(); if (res.success) setItems(res.news || []); setLoading(false); })(); }, []);

  const filtered = items.filter(i => {
    const s = searchTerm.toLowerCase();
    const matchSearch = !searchTerm || i.title?.toLowerCase().includes(s) || i.excerpt?.toLowerCase().includes(s);
    const matchCat = selectedCat === 'all' || i.category === selectedCat;
    return matchSearch && matchCat;
  });

  const openCreate = () => { setEditing(null); setForm({ title: '', excerpt: '', content: '', category: 'achievements', featured: false, tags: [], image: '', author: '' }); setTagInput(''); setShowModal(true); };
  const openEdit = (r: Resource) => { setEditing(r); setForm({ title: r.title, excerpt: r.excerpt || '', content: r.content || '', category: r.category, featured: r.featured, tags: r.tags || [], image: r.image || '', author: r.author || '' }); setTagInput(''); setShowModal(true); };

  const handleSave = async () => {
    if (!form.title) { showToast('Title is required', 'error'); return; }
    try {
      if (editing) {
        await updateNews(editing.id, form);
        setItems(p => p.map(i => i.id === editing.id ? { ...i, ...form } : i));
        showToast('Resource updated', 'success');
      } else {
        const res = await createNews({ ...form, published_at: new Date().toISOString() });
        if (res.success && res.news) setItems(p => [res.news, ...p]);
        showToast('Resource created', 'success');
      }
      setShowModal(false);
    } catch { showToast('Save failed', 'error'); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await deleteNews(deleteId); setItems(p => p.filter(i => i.id !== deleteId)); setDeleteId(null); showToast('Resource deleted', 'success'); }
    catch { showToast('Delete failed', 'error'); }
  };

  const toggleFeatured = async (r: Resource) => {
    try { await updateNews(r.id, { featured: !r.featured }); setItems(p => p.map(i => i.id === r.id ? { ...i, featured: !i.featured } : i)); }
    catch { showToast('Update failed', 'error'); }
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 12, color: 'var(--color-on-dark-soft)', fontFamily: 'var(--font-body)' }}><Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} /> Loading resources...</div>;

  return (
    <div style={cs.page}>
      {toast && <div style={{ ...cs.toast, background: toast.type === 'success' ? 'var(--color-success)' : 'var(--color-error)' }}>{toast.msg}</div>}
      <div style={cs.header}>
        <div><h2 style={cs.title}>Resources Manager</h2><p style={cs.subtitle}>{filtered.length} resource{filtered.length !== 1 ? 's' : ''}</p></div>
        <button style={cs.addBtn} onClick={openCreate}><Plus size={16} /> New Resource</button>
      </div>
      <div style={cs.toolRow}>
        <div style={cs.searchWrap}><Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-on-dark-soft)', opacity: 0.5 }} /><input style={cs.searchInput} placeholder="Search resources..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
      </div>
      <div style={cs.filterBar}>{CATEGORIES.map(c => <button key={c.id} onClick={() => setSelectedCat(c.id)} style={{ ...cs.chip, ...(selectedCat === c.id ? cs.chipActive : {}) }}>{c.label}</button>)}</div>
      <div style={cs.grid}>
        {filtered.map(r => {
          const catColor = CAT_COLORS[r.category] || '#888';
          return (
            <div key={r.id} style={cs.card}>
              <div style={cs.cardBody}>
                <span style={{ ...cs.cardCat, background: `${catColor}20`, color: catColor }}>{r.category}</span>
                <h3 style={cs.cardTitle}>{r.title}</h3>
                <p style={cs.cardExcerpt}>{r.excerpt ? (r.excerpt.length > 120 ? r.excerpt.slice(0, 120) + '...' : r.excerpt) : '—'}</p>
                <div style={cs.cardMeta}>{r.published_at && <span>{formatDate(r.published_at)}</span>}{r.author && <span>by {r.author}</span>}</div>
                {r.tags?.length > 0 && <div style={cs.tagWrap}>{r.tags.map(t => <span key={t} style={cs.tag}>{t}</span>)}</div>}
                <div style={cs.cardActions}>
                  <button style={{ ...cs.actionBtn, ...cs.featBtn }} onClick={() => toggleFeatured(r)}>{r.featured ? <StarOff size={13} /> : <Star size={13} />} {r.featured ? 'Unfeature' : 'Feature'}</button>
                  <button style={{ ...cs.actionBtn, ...cs.editBtn }} onClick={() => openEdit(r)}><Edit2 size={13} /> Edit</button>
                  <button style={{ ...cs.actionBtn, ...cs.delBtn }} onClick={() => setDeleteId(r.id)}><Trash2 size={13} /> Delete</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-on-dark-soft)', fontFamily: 'var(--font-body)', opacity: 0.6 }}>No resources found</div>}
      {/* Create/Edit Modal */}
      {showModal && (
        <div style={cs.modal} onClick={() => setShowModal(false)}><div style={cs.modalBox} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--color-on-dark)', margin: 0 }}>{editing ? 'Edit Resource' : 'New Resource'}</h3>
            <button style={{ background: 'none', border: 'none', color: 'var(--color-on-dark-soft)', cursor: 'pointer' }} onClick={() => setShowModal(false)}><X size={18} /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div><label style={cs.label}>Title *</label><input style={cs.input} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Resource title" /></div>
            <div><label style={cs.label}>Excerpt</label><textarea style={cs.textarea} rows={2} value={form.excerpt} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))} placeholder="Short excerpt" /></div>
            <div><label style={cs.label}>Content</label><textarea style={cs.textarea} rows={4} value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} placeholder="Full content" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label style={cs.label}>Category</label><select style={cs.select} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>{CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</select></div>
              <div><label style={cs.label}>Author</label><input style={cs.input} value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} placeholder="Author name" /></div>
            </div>
            <div><label style={cs.label}>Image URL</label><input style={cs.input} value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} placeholder="https://..." /></div>
            <div><label style={cs.label}>Tags <span style={{ fontSize: 11, opacity: 0.5 }}>(press enter)</span></label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>{form.tags.map(t => <span key={t} style={{ ...cs.tag, background: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>{t} <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }} onClick={() => setForm(p => ({ ...p, tags: p.tags.filter(x => x !== t) }))}><X size={12} /></button></span>)}</div>
              <input style={cs.input} value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (tagInput.trim() && !form.tags.includes(tagInput.trim())) { setForm(p => ({ ...p, tags: [...p.tags, tagInput.trim()] })); setTagInput(''); } } }} placeholder="Add tag" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" id="feat" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} /><label htmlFor="feat" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-on-dark-soft)', cursor: 'pointer' }}>Featured</label></div>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button style={cs.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
            <button style={cs.saveBtn} onClick={handleSave}><Save size={14} /> {editing ? 'Update' : 'Create'}</button>
          </div>
        </div></div>
      )}
      {/* Delete Confirm */}
      {deleteId && (
        <div style={cs.modal} onClick={() => setDeleteId(null)}><div style={{ ...cs.modalBox, maxWidth: 420 }} onClick={e => e.stopPropagation()}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--color-on-dark)', margin: '0 0 12px' }}>Delete Resource?</h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-on-dark-soft)', margin: '0 0 20px' }}>This action cannot be undone.</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button style={cs.cancelBtn} onClick={() => setDeleteId(null)}>Cancel</button>
            <button style={{ ...cs.saveBtn, background: 'var(--color-error)' }} onClick={handleDelete}><Trash2 size={14} /> Delete</button>
          </div>
        </div></div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
