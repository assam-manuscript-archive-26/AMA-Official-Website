import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, ExternalLink, BookOpen, Link as LinkIcon, User } from 'lucide-react';
import {
  getAllResources,
  createResource,
  updateResource,
  deleteResource,
} from '../../../backend/actions/resources';
import EditDialog, { DialogGrid } from './EditDialog';
import AdminSpinner from './AdminSpinner';

interface Resource {
  id: string;
  title: string;
  author: string;
  source: string;
  year: string | number;
  url: string;
  category: string;
}

interface FormState {
  title: string;
  author: string;
  source: string;
  year: string;
  url: string;
  category: string;
}

const DEFAULT_CATEGORIES = ['Books', 'Articles', 'Manuscripts', 'Research Papers', 'Online'];

const CAT_PALETTE: string[] = [
  'var(--color-primary)',
  'var(--color-accent-teal)',
  'var(--color-accent-gold)',
  '#9b6fb5',
  '#4a90d9',
  '#e08a4d',
];

const colorForCategory = (_cat: string, index: number) => CAT_PALETTE[index % CAT_PALETTE.length];

const isValidUrl = (s: string) => {
  if (!s) return false;
  try { new URL(s); return true; } catch { return false; }
};

const emptyForm: FormState = { title: '', author: '', source: '', year: '', url: '', category: 'Books' };

export default function ResourcesAdmin() {
  const [items, setItems] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const showToast = (msg: string, type: 'success' | 'error') => { setToast({ msg, type }); setTimeout(() => setToast(null), 4000); };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await getAllResources();
      if (res.success) setItems(res.resources || []);
      else showToast(res.error || 'Failed to load resources', 'error');
      setLoading(false);
    })();
  }, []);

  /** Build the unique list of categories from existing resources, plus defaults. */
  const categories = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    [...DEFAULT_CATEGORIES, ...items.map(i => i.category).filter(Boolean)].forEach(c => {
      const key = c.trim();
      if (key && !seen.has(key.toLowerCase())) {
        seen.add(key.toLowerCase());
        list.push(key);
      }
    });
    return list;
  }, [items]);

  const filtered = items.filter(i => {
    const s = searchTerm.toLowerCase();
    const matchSearch = !searchTerm
      || i.title?.toLowerCase().includes(s)
      || i.author?.toLowerCase().includes(s)
      || i.source?.toLowerCase().includes(s);
    const matchCat = selectedCat === 'all' || i.category === selectedCat;
    return matchSearch && matchCat;
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, category: categories[0] || 'Books' });
    setShowModal(true);
  };

  const openEdit = (r: Resource) => {
    setEditing(r);
    setForm({
      title: r.title || '',
      author: r.author || '',
      source: r.source || '',
      year: r.year != null ? String(r.year) : '',
      url: r.url || '',
      category: r.category || 'Books',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { showToast('Title is required', 'error'); return; }
    if (form.url && !isValidUrl(form.url)) { showToast('Please enter a valid URL', 'error'); return; }
    if (form.year) {
      const y = Number(form.year);
      const max = new Date().getFullYear() + 5;
      if (Number.isNaN(y) || y < 1500 || y > max) {
        showToast(`Year must be between 1500 and ${max}`, 'error');
        return;
      }
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        author: form.author.trim(),
        source: form.source.trim(),
        year: form.year ? Number(form.year) : '',
        url: form.url.trim(),
        category: form.category.trim() || 'Books',
      };
      if (editing) {
        const res = await updateResource(editing.id, payload);
        if (res.success) {
          setItems(p => p.map(i => i.id === editing.id ? { ...i, ...payload } as Resource : i));
          showToast('Resource updated', 'success');
        } else {
          showToast(res.error || 'Update failed', 'error');
        }
      } else {
        const res = await createResource(payload);
        if (res.success) {
          const created = (res.resource || { ...payload, id: Date.now().toString() }) as Resource;
          setItems(p => [created, ...p]);
          showToast('Resource added', 'success');
        } else {
          showToast(res.error || 'Create failed', 'error');
        }
      }
      setShowModal(false);
    } catch {
      showToast('Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await deleteResource(deleteId);
      if (res.success) {
        setItems(p => p.filter(i => i.id !== deleteId));
        setDeleteId(null);
        showToast('Resource deleted', 'success');
      } else {
        showToast(res.error || 'Delete failed', 'error');
      }
    } catch { showToast('Delete failed', 'error'); }
  };

  if (loading) return <AdminSpinner label="Loading resources..." />;

  return (
    <div className="resources-page">
      {toast && (
        <div className={`ax-toast ${toast.type === 'success' ? 'ax-toast--success' : 'ax-toast--error'}`}>
          {toast.msg}
        </div>
      )}

      <div className="ax-page-header">
        <div>
          <h2 className="ax-page-title">Resources Manager</h2>
          <p className="ax-page-subtitle">{filtered.length} resource{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="ax-btn ax-btn--primary" onClick={openCreate}>
          <Plus size={15} /> New Resource
        </button>
      </div>

      <div className="ax-tool-row">
        <div className="ax-search-wrap">
          <Search size={15} />
          <input
            className="ax-search-input"
            placeholder="Search by title, author, or source..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="ax-filter-bar">
        <button
          type="button"
          onClick={() => setSelectedCat('all')}
          className={`ax-chip ${selectedCat === 'all' ? 'ax-chip--active' : ''}`}
        >
          All
        </button>
        {categories.map((c, i) => (
          <button
            key={c}
            type="button"
            onClick={() => setSelectedCat(c)}
            className={`ax-chip ${selectedCat === c ? 'ax-chip--active' : ''}`}
            style={selectedCat === c ? undefined : {
              borderColor: `color-mix(in srgb, ${colorForCategory(c, i)} 30%, var(--admin-chip-border))`,
            }}
          >
            <span
              className="resources-chip-dot"
              style={{ background: colorForCategory(c, i) }}
              aria-hidden="true"
            />
            {c}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="resources-grid">
          {filtered.map(r => {
            const catIndex = categories.findIndex(c => c === r.category);
            const catColor = colorForCategory(r.category, Math.max(0, catIndex));
            return (
              <article key={r.id} className="resource-card">
                <header className="resource-card-head">
                  <span
                    className="resource-card-cat"
                    style={{
                      background: `color-mix(in srgb, ${catColor} 14%, transparent)`,
                      color: catColor,
                      borderColor: `color-mix(in srgb, ${catColor} 32%, transparent)`,
                    }}
                  >
                    {r.category || 'Uncategorized'}
                  </span>
                  {r.year && <span className="resource-card-year">{r.year}</span>}
                </header>
                <h3 className="resource-card-title">{r.title}</h3>
                {r.author && (
                  <p className="resource-card-author">
                    <User size={12} /> {r.author}
                  </p>
                )}
                {r.source && (
                  <p className="resource-card-source">{r.source}</p>
                )}

                <footer className="resource-card-footer">
                  {r.url ? (
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resource-card-link"
                    >
                      Open <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span className="resource-card-link resource-card-link--disabled">
                      No link
                    </span>
                  )}
                  <div className="resource-card-actions">
                    <button type="button" className="ax-action-btn ax-action-btn--edit" onClick={() => openEdit(r)}>
                      <Edit2 size={13} /> Edit
                    </button>
                    <button type="button" className="ax-action-btn ax-action-btn--delete" onClick={() => setDeleteId(r.id)}>
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </footer>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="ax-empty">
          <div className="ax-empty-icon"><BookOpen size={22} /></div>
          <h3 className="ax-empty-title">{items.length === 0 ? 'No resources yet' : 'No resources match'}</h3>
          <p>{items.length === 0 ? 'Add your first resource to start building the archive bibliography.' : 'Try adjusting the search or category filter.'}</p>
          {items.length === 0 && (
            <button className="ax-btn ax-btn--primary" onClick={openCreate} style={{ marginTop: 8 }}>
              <Plus size={15} /> Add your first resource
            </button>
          )}
        </div>
      )}

      {/* Create / Edit dialog */}
      <EditDialog
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Edit Resource' : 'New Resource'}
        subtitle={editing ? `Editing "${editing.title}"` : 'Add a new bibliographic entry'}
        size="md"
        onSave={handleSave}
        saving={saving}
        saveLabel={editing ? 'Update resource' : 'Create resource'}
      >
        <DialogGrid cols={1}>
          <div>
            <label className="ax-label">Title *</label>
            <input
              className="ax-input"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="e.g. The Vaishnava Movement in Assam"
            />
          </div>
        </DialogGrid>

        <div style={{ marginTop: 14 }}>
          <DialogGrid cols={2}>
            <div>
              <label className="ax-label">Author</label>
              <input
                className="ax-input"
                value={form.author}
                onChange={e => setForm(p => ({ ...p, author: e.target.value }))}
                placeholder="Author name"
              />
            </div>
            <div>
              <label className="ax-label">Year</label>
              <input
                className="ax-input"
                type="number"
                min={1500}
                max={new Date().getFullYear() + 5}
                value={form.year}
                onChange={e => setForm(p => ({ ...p, year: e.target.value }))}
                placeholder="e.g. 1985"
              />
            </div>
          </DialogGrid>
        </div>

        <div style={{ marginTop: 14 }}>
          <DialogGrid cols={1}>
            <div>
              <label className="ax-label">Source / Publisher</label>
              <input
                className="ax-input"
                value={form.source}
                onChange={e => setForm(p => ({ ...p, source: e.target.value }))}
                placeholder="Journal, publisher, or website name"
              />
            </div>
            <div>
              <label className="ax-label">URL</label>
              <div className="resources-url-wrap">
                <LinkIcon size={14} />
                <input
                  className="ax-input"
                  type="url"
                  value={form.url}
                  onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div>
              <label className="ax-label">Category</label>
              <select
                className="ax-select"
                value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </DialogGrid>
        </div>
      </EditDialog>

      {/* Delete confirm */}
      <EditDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete resource?"
        subtitle="This action cannot be undone."
        size="md"
        onSave={handleDelete}
        saveLabel="Delete resource"
      >
        <div className="resources-delete-body">
          <Trash2 size={28} />
          <p>The resource entry will be permanently removed from the bibliography.</p>
        </div>
      </EditDialog>

      <style>{`
        .resources-page { width: 100%; }

        .resources-chip-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .resources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        .resource-card {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--radius-lg);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
        }
        .resource-card:hover {
          border-color: var(--admin-border-strong);
          box-shadow: var(--admin-shadow-md);
          transform: translateY(-2px);
        }

        .resource-card-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .resource-card-cat {
          display: inline-block;
          padding: 3px 10px;
          border-radius: var(--radius-pill);
          border: 1px solid;
          font-family: var(--font-body);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .resource-card-year {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--admin-text-muted);
          font-variant-numeric: tabular-nums;
        }
        .resource-card-title {
          font-family: var(--font-display);
          font-size: 19px;
          font-weight: 500;
          color: var(--admin-text);
          margin: 0;
          line-height: 1.3;
        }
        .resource-card-author {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--admin-text-soft);
          margin: 0;
        }
        .resource-card-author svg { color: var(--admin-text-muted); }
        .resource-card-source {
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--admin-text-muted);
          font-style: italic;
          margin: 0;
        }

        .resource-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          padding-top: 14px;
          margin-top: auto;
          border-top: 1px solid var(--admin-divider);
        }
        .resource-card-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 500;
          color: var(--color-primary);
          text-decoration: none;
          transition: color 0.15s ease, transform 0.15s ease;
        }
        .resource-card-link:hover {
          color: var(--color-primary-active);
          transform: translateX(2px);
        }
        .resource-card-link--disabled {
          color: var(--admin-text-muted);
          font-style: italic;
        }
        .resource-card-link--disabled:hover {
          transform: none;
          color: var(--admin-text-muted);
        }

        .resource-card-actions {
          display: flex;
          gap: 6px;
        }

        .resources-url-wrap {
          position: relative;
        }
        .resources-url-wrap > svg {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--admin-text-muted);
          pointer-events: none;
        }
        .resources-url-wrap input {
          padding-left: 38px;
        }

        .resources-delete-body {
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
        .resources-delete-body svg {
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
