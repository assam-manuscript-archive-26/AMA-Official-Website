import React, { useState, useEffect, useMemo } from 'react';
import {
  Edit2, Trash2, Search, Filter, Plus, Image as ImageIcon,
  CheckCircle, AlertCircle, RefreshCw, X, ArrowUpRight
} from 'lucide-react';
import {
  getAllGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
} from '../../../backend/actions/gallery';
import UploadGalleryImage from './UploadGalleryImage';
import CreatableCategorySelect from './CreatableCategorySelect';
import EditDialog, { DialogGrid } from './EditDialog';
import AdminSpinner from './AdminSpinner';

export interface GalleryItem {
  id: string;
  title?: string;
  category: string;
  imageUrl: string;
  accent?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

const DEFAULT_CATEGORIES = [
  'Manuscripts',
  'Palm Leaf',
  'Sattra Heritage',
  'Masks & Mukhas',
  'Vaishnavite Art',
  'Festivals & Life',
];

export default function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [showUploadPanel, setShowUploadPanel] = useState(false);

  // New item form state (Only cloud image and category are compulsory)
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newAccent, setNewAccent] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetUploadTrigger, setResetUploadTrigger] = useState(false);

  // Edit item state
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [editForm, setEditForm] = useState<Partial<GalleryItem>>({});
  const [editIsChangingImage, setEditIsChangingImage] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Delete state
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; item: GalleryItem | null }>({
    show: false,
    item: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Toasts
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ message: msg, type });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getAllGalleryItems();
      if (res.success) {
        setItems(res.items || []);
      } else {
        triggerToast('Failed to load gallery items', 'error');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Error connecting to gallery database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute distinct categories
  const allCategories = useMemo(() => {
    const set = new Set<string>(DEFAULT_CATEGORIES);
    items.forEach((item) => {
      if (item.category && item.category.trim()) {
        set.add(item.category.trim());
      }
    });
    return Array.from(set);
  }, [items]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !searchTerm.trim() ||
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.accent?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [items, searchTerm, selectedCategory]);

  // Handle Add Item Submit (Only image and category are required)
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const categoryToSave = newCategory.trim();

    if (!newImageUrl.trim()) {
      triggerToast('Please upload an image to cloud first', 'error');
      return;
    }
    if (!categoryToSave) {
      triggerToast('Please select or create a category', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: newTitle.trim() || undefined,
        category: categoryToSave,
        imageUrl: newImageUrl.trim(),
        accent: newAccent.trim() || undefined,
        description: newDescription.trim() || undefined,
      };

      const res = await createGalleryItem(payload);
      if (res.success) {
        triggerToast('Gallery exhibit added successfully!', 'success');
        setNewTitle('');
        setNewCategory('');
        setNewAccent('');
        setNewDescription('');
        setNewImageUrl('');
        setResetUploadTrigger((prev) => !prev);
        setShowUploadPanel(false);
        loadData();
      } else {
        triggerToast(res.error || 'Failed to save gallery exhibit', 'error');
      }
    } catch (err: any) {
      console.error(err);
      triggerToast(err.message || 'Error saving gallery exhibit', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Dialog
  const handleEditClick = (item: GalleryItem) => {
    setEditingItem(item);
    setEditForm({
      title: item.title || '',
      category: item.category,
      accent: item.accent || '',
      description: item.description || '',
      imageUrl: item.imageUrl,
    });
    setEditIsChangingImage(false);
  };

  // Save Edit Dialog (Only image and category are required)
  const handleSaveEdit = async () => {
    if (!editingItem) return;

    const categoryToSave = editForm.category?.trim();

    if (!editForm.imageUrl?.trim()) {
      triggerToast('Image URL cannot be empty', 'error');
      return;
    }
    if (!categoryToSave) {
      triggerToast('Category cannot be empty', 'error');
      return;
    }

    setIsSavingEdit(true);
    try {
      const payload = {
        title: editForm.title?.trim() || null,
        category: categoryToSave,
        accent: editForm.accent?.trim() || null,
        description: editForm.description?.trim() || null,
        imageUrl: editForm.imageUrl.trim(),
      };

      const res = await updateGalleryItem(editingItem.id, payload);
      if (res.success) {
        triggerToast('Exhibit updated successfully', 'success');
        setItems((prev) =>
          prev.map((it) => (it.id === editingItem.id ? { ...it, ...payload } : it))
        );
        setEditingItem(null);
      } else {
        triggerToast(res.error || 'Failed to update exhibit', 'error');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Error updating exhibit', 'error');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteConfirm.item) return;

    setIsDeleting(true);
    try {
      const res = await deleteGalleryItem(deleteConfirm.item.id);
      if (res.success) {
        triggerToast('Exhibit deleted successfully', 'success');
        setItems((prev) => prev.filter((it) => it.id !== deleteConfirm.item?.id));
        setDeleteConfirm({ show: false, item: null });
      } else {
        triggerToast(res.error || 'Failed to delete exhibit', 'error');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Error deleting exhibit', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && items.length === 0) {
    return <AdminSpinner label="Loading gallery exhibits from database..." />;
  }

  return (
    <div className="gm-page">
      {showToast && toast && (
        <div className={`ax-toast ${toast.type === 'success' ? 'ax-toast--success' : 'ax-toast--error'}`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="ax-page-header gm-page-header">
        <div className="gm-header-title-wrap">
          <h2 className="ax-page-title">Gallery Manager</h2>
          <p className="ax-page-subtitle">
            Manage, upload, categorize, and update exhibits displayed on the public Picture Gallery.
          </p>
        </div>
        <div className="gm-header-actions">
          <button
            type="button"
            onClick={loadData}
            className="ax-btn ax-btn--secondary gm-btn-sub"
            title="Refresh exhibits list"
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <a
            href="/picture-gallery"
            target="_blank"
            rel="noopener noreferrer"
            className="ax-btn ax-btn--secondary gm-btn-sub"
            title="Open Public Picture Gallery in a new tab"
          >
            <ArrowUpRight size={14} /> View Gallery
          </a>
          <button
            type="button"
            onClick={() => setShowUploadPanel((prev) => !prev)}
            className="ax-btn ax-btn--primary gm-btn-main"
          >
            {showUploadPanel ? <X size={15} /> : <Plus size={15} />}
            {showUploadPanel ? 'Close Upload' : 'Upload New Image'}
          </button>
        </div>
      </div>

      {/* Upload New Image Panel */}
      {showUploadPanel && (
        <div className="gm-upload-card">
          <div className="gm-upload-header">
            <h3 className="gm-upload-title">Add New Gallery Exhibit</h3>
            <p className="gm-upload-subtitle">
              Upload an image to cloud storage and choose or create a category. Title, subtitle, and description are optional.
            </p>
          </div>

          <form onSubmit={handleCreateSubmit}>
            <div className="gm-upload-grid">
              {/* Left Column: Image Uploader (COMPULSORY) */}
              <div className="gm-upload-col">
                <label className="ax-label">Exhibit Image *</label>
                <UploadGalleryImage
                  onUploadSuccess={(url) => setNewImageUrl(url)}
                  resetTrigger={resetUploadTrigger}
                />
                {newImageUrl && (
                  <div className="gm-url-preview">
                    <span className="gm-url-tag">Cloud URL:</span>
                    <input
                      type="text"
                      className="ax-input gm-url-input"
                      value={newImageUrl}
                      readOnly
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                  </div>
                )}
              </div>

              {/* Right Column: Metadata */}
              <div className="gm-upload-col">
                {/* Category Selection (COMPULSORY) */}
                <div>
                  <label className="ax-label">Category *</label>
                  <CreatableCategorySelect
                    value={newCategory}
                    onChange={(cat) => setNewCategory(cat)}
                    categories={allCategories}
                    placeholder="Select or type to create a category..."
                  />
                  <span className="gm-hint">
                    Choose an existing category or type any new name and click <strong>Create</strong> or press <strong>Enter</strong>.
                  </span>
                </div>

                {/* Exhibit Title (OPTIONAL) */}
                <div style={{ marginTop: 14 }}>
                  <label className="ax-label">Exhibit Title (Optional)</label>
                  <input
                    type="text"
                    className="ax-input"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Ancient Palm Leaf Manuscript (optional)"
                  />
                </div>

                {/* Accent Tag (OPTIONAL) */}
                <div style={{ marginTop: 14 }}>
                  <label className="ax-label">
                    Accent Tag / Subtitle (Optional)
                    <span className="gm-hint"> (e.g. 'Heritage archive', 'Fine detail study')</span>
                  </label>
                  <input
                    type="text"
                    className="ax-input"
                    value={newAccent}
                    onChange={(e) => setNewAccent(e.target.value)}
                    placeholder="e.g. Manuscript detail (optional)"
                  />
                </div>

                {/* Description (OPTIONAL) */}
                <div style={{ marginTop: 14 }}>
                  <label className="ax-label">Description (Optional)</label>
                  <textarea
                    className="ax-textarea"
                    rows={3}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Add brief background or historical context (optional)..."
                  />
                </div>

                {/* Submit Row */}
                <div className="gm-upload-submit-row">
                  <button
                    type="button"
                    onClick={() => setShowUploadPanel(false)}
                    className="ax-btn ax-btn--secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !newImageUrl}
                    className="ax-btn ax-btn--primary"
                  >
                    {isSubmitting ? 'Saving to Database...' : 'Publish to Gallery'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Control bar: Search + Category Filter */}
      <div className="gm-controls">
        <div className="ax-search-wrap gm-search-wrap">
          <Search size={15} />
          <input
            className="ax-search-input"
            placeholder="Search by title, category, or accent..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="ax-search-clear"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="gm-controls-right">
          <span className="gm-stats-badge">
            <strong>{filteredItems.length}</strong> {filteredItems.length === 1 ? 'exhibit' : 'exhibits'}
          </span>
          <button
            type="button"
            className={`ax-btn ax-btn--secondary gm-filter-toggle-btn ${showFilters ? 'gm-filter-active' : ''}`}
            onClick={() => setShowFilters((prev) => !prev)}
          >
            <Filter size={14} /> Filter Category
          </button>
        </div>
      </div>

      {/* Category filter pills - Horizontally scrollable on mobile */}
      {showFilters && (
        <div className="ax-filter-bar gm-filter-bar">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`ax-chip ${selectedCategory === 'All' ? 'ax-chip--active' : ''}`}
          >
            All Exhibits ({items.length})
          </button>
          {allCategories.map((cat) => {
            const count = items.filter((it) => it.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`ax-chip ${selectedCategory === cat ? 'ax-chip--active' : ''}`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Gallery Exhibits Grid */}
      <div className="gm-grid">
        {filteredItems.map((item) => (
          <div key={item.id} className="gm-card">
            <div className="gm-card-img-wrap">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.title || item.category} className="gm-card-img" loading="lazy" />
              ) : (
                <div className="gm-card-placeholder">
                  <ImageIcon size={32} />
                  <span>No image</span>
                </div>
              )}
              <span className="gm-card-badge">{item.category}</span>
            </div>

            <div className="gm-card-body">
              {item.title && item.title.trim() && (
                <h3 className="gm-card-title" title={item.title}>
                  {item.title}
                </h3>
              )}

              {item.accent && (
                <span className="gm-card-accent" title={item.accent}>
                  {item.accent}
                </span>
              )}
              {item.description && (
                <p className="gm-card-desc" title={item.description}>
                  {item.description}
                </p>
              )}

              <div className="gm-card-footer">
                <button
                  type="button"
                  className="ax-action-btn ax-action-btn--edit gm-card-action"
                  onClick={() => handleEditClick(item)}
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  type="button"
                  className="ax-action-btn ax-action-btn--delete gm-card-action"
                  onClick={() => setDeleteConfirm({ show: true, item })}
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && !loading && (
        <div className="ax-empty">
          <div className="ax-empty-icon">
            <ImageIcon size={24} />
          </div>
          <h3 className="ax-empty-title">
            {searchTerm || selectedCategory !== 'All'
              ? 'No matching gallery exhibits found'
              : 'Gallery is currently empty'}
          </h3>
          <p>
            {searchTerm || selectedCategory !== 'All'
              ? 'Try modifying your search query or selecting a different category.'
              : 'Upload your first image to the gallery using the button above.'}
          </p>
          {!searchTerm && selectedCategory === 'All' && (
            <button
              type="button"
              onClick={() => setShowUploadPanel(true)}
              className="ax-btn ax-btn--primary"
              style={{ marginTop: 14 }}
            >
              <Plus size={16} /> Upload First Exhibit
            </button>
          )}
        </div>
      )}

      {/* Edit Exhibit Dialog */}
      <EditDialog
        open={!!editingItem}
        onClose={() => setEditingItem(null)}
        title="Edit Gallery Exhibit"
        subtitle={editingItem ? (editingItem.title ? `Editing "${editingItem.title}"` : `Editing exhibit in "${editingItem.category}"`) : 'Update exhibit details'}
        size="lg"
        onSave={handleSaveEdit}
        saving={isSavingEdit}
        saveLabel="Save Changes"
      >
        <div className="gm-edit-layout">
          {/* Left: Image Preview & Replace (COMPULSORY) */}
          <div className="gm-edit-col-img">
            <label className="ax-label">Exhibit Image *</label>
            <div className="gm-edit-img-frame">
              {editForm.imageUrl ? (
                <img src={editForm.imageUrl} alt="Preview" />
              ) : (
                <div className="gm-edit-img-empty">
                  <ImageIcon size={32} />
                  <span>No image selected</span>
                </div>
              )}
            </div>

            <div style={{ marginTop: 12 }}>
              <button
                type="button"
                className="ax-btn ax-btn--secondary"
                style={{ width: '100%', fontSize: 12 }}
                onClick={() => setEditIsChangingImage((prev) => !prev)}
              >
                {editIsChangingImage ? 'Keep Current Image' : 'Replace Image / Upload New'}
              </button>
            </div>

            {editIsChangingImage && (
              <div style={{ marginTop: 12 }}>
                <UploadGalleryImage
                  onUploadSuccess={(url) => {
                    if (url) {
                      setEditForm((prev) => ({ ...prev, imageUrl: url }));
                      triggerToast('New image uploaded for exhibit!', 'success');
                    }
                  }}
                  initialUrl={editForm.imageUrl}
                />
              </div>
            )}
          </div>

          {/* Right: Form fields */}
          <div className="gm-edit-col-fields">
            <DialogGrid cols={1}>
              {/* Category (COMPULSORY) */}
              <div>
                <label className="ax-label">Category *</label>
                <CreatableCategorySelect
                  value={editForm.category || ''}
                  onChange={(cat) => setEditForm((prev) => ({ ...prev, category: cat }))}
                  categories={allCategories}
                  placeholder="Select or type to create a new category..."
                />
              </div>

              {/* Title (OPTIONAL) */}
              <div>
                <label className="ax-label">Exhibit Title (Optional)</label>
                <input
                  type="text"
                  className="ax-input"
                  value={editForm.title || ''}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Sanchipat Manuscript (optional)"
                />
              </div>

              {/* Accent Tag (OPTIONAL) */}
              <div>
                <label className="ax-label">Accent Tag / Subtitle (Optional)</label>
                <input
                  type="text"
                  className="ax-input"
                  value={editForm.accent || ''}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, accent: e.target.value }))}
                  placeholder="e.g. Heritage archive (optional)"
                />
              </div>

              {/* Description (OPTIONAL) */}
              <div>
                <label className="ax-label">Description (Optional)</label>
                <textarea
                  className="ax-textarea"
                  rows={3}
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Additional background notes (optional)..."
                />
              </div>
            </DialogGrid>
          </div>
        </div>
      </EditDialog>

      {/* Delete Confirmation Dialog */}
      <EditDialog
        open={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, item: null })}
        title="Delete Gallery Exhibit?"
        subtitle="This action cannot be undone."
        size="md"
        onSave={handleConfirmDelete}
        saving={isDeleting}
        saveLabel="Delete Exhibit"
      >
        <div className="gm-delete-dialog-body">
          <Trash2 size={32} />
          <p>
            Are you sure you want to permanently delete{' '}
            <strong>"{deleteConfirm.item?.title || deleteConfirm.item?.category || 'Exhibit'}"</strong> from the gallery database?
          </p>
        </div>
      </EditDialog>

      <style>{`
        .gm-page {
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
          box-sizing: border-box;
        }

        /* ── Header ──────────────────────────────────── */
        .gm-page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 24px;
        }

        .gm-header-title-wrap {
          flex: 1;
          min-width: 200px;
        }

        .gm-header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        @media (max-width: 640px) {
          .gm-page-header {
            flex-direction: column;
            gap: 14px;
            margin-bottom: 20px;
          }
          .gm-header-actions {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }
          .gm-btn-sub {
            width: 100%;
            padding: 8px 10px;
            font-size: 12px;
          }
          .gm-btn-main {
            grid-column: 1 / -1;
            width: 100%;
            padding: 12px 16px;
            font-size: 14px;
            font-weight: 600;
          }
        }

        /* ── Upload panel ────────────────────────────── */
        .gm-upload-card {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--radius-lg);
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: var(--admin-shadow-sm);
          animation: adminScaleIn 0.2s cubic-bezier(0.2, 0.8, 0.4, 1);
          overflow: visible;
          position: relative;
          z-index: 30;
          box-sizing: border-box;
          width: 100%;
        }

        @media (max-width: 640px) {
          .gm-upload-card {
            padding: 16px 14px;
            margin-bottom: 20px;
            border-radius: var(--radius-md);
          }
        }

        .gm-upload-header {
          padding-bottom: 14px;
          margin-bottom: 18px;
          border-bottom: 1px solid var(--admin-divider);
        }

        .gm-upload-title {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 600;
          color: var(--admin-text);
          margin: 0;
        }

        @media (max-width: 640px) {
          .gm-upload-title {
            font-size: 17px;
          }
        }

        .gm-upload-subtitle {
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--admin-text-soft);
          margin: 4px 0 0;
        }

        @media (max-width: 640px) {
          .gm-upload-subtitle {
            font-size: 12px;
          }
        }

        .gm-upload-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 24px;
          overflow: visible;
        }

        @media (max-width: 768px) {
          .gm-upload-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }
        }

        .gm-upload-col {
          display: flex;
          flex-direction: column;
          overflow: visible;
          position: relative;
          min-width: 0;
        }

        .gm-hint {
          font-size: 11px;
          color: var(--admin-text-muted);
          font-family: var(--font-body);
          margin-top: 5px;
          display: block;
          line-height: 1.4;
        }

        .gm-url-preview {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 100%;
          min-width: 0;
        }

        .gm-url-tag {
          font-size: 11px;
          font-family: var(--font-body);
          color: var(--admin-text-muted);
        }

        .gm-url-input {
          font-size: 11px !important;
          word-break: break-all;
          text-overflow: ellipsis;
        }

        .gm-upload-submit-row {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid var(--admin-divider);
        }

        @media (max-width: 640px) {
          .gm-upload-submit-row {
            flex-direction: column-reverse;
            gap: 8px;
            margin-top: 18px;
            padding-top: 14px;
          }
          .gm-upload-submit-row .ax-btn {
            width: 100%;
            padding: 12px;
            font-size: 14px;
          }
        }

        /* ── Controls Row ────────────────────────────── */
        .gm-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .gm-search-wrap {
          max-width: 380px;
          flex: 1;
        }

        .gm-controls-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        @media (max-width: 640px) {
          .gm-controls {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }
          .gm-search-wrap {
            max-width: 100% !important;
            width: 100%;
            min-width: 0;
          }
          .gm-controls-right {
            width: 100%;
            justify-content: space-between;
          }
        }

        .gm-stats-badge {
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--admin-text-soft);
          background: var(--admin-chip-bg);
          padding: 6px 12px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--admin-chip-border);
          white-space: nowrap;
        }

        .gm-filter-toggle-btn {
          white-space: nowrap;
        }

        .gm-filter-active {
          background: var(--admin-chip-hover-bg) !important;
          border-color: var(--admin-border-strong) !important;
        }

        /* ── Category Filter Bar (Smooth scroll on mobile) ── */
        .gm-filter-bar {
          margin-bottom: 20px;
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        @media (max-width: 640px) {
          .gm-filter-bar {
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 8px;
            margin-bottom: 16px;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            width: 100%;
            box-sizing: border-box;
          }
          .gm-filter-bar::-webkit-scrollbar {
            display: none;
          }
          .gm-filter-bar .ax-chip {
            flex-shrink: 0;
            white-space: nowrap;
            font-size: 11px;
            padding: 6px 12px;
          }
        }

        /* ── Exhibits Grid (Fluid & Mobile Optimized) ── */
        .gm-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 18px;
          width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 580px) {
          .gm-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }

        @media (min-width: 581px) and (max-width: 860px) {
          .gm-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }

        .gm-card {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
          width: 100%;
          box-sizing: border-box;
        }

        .gm-card:hover {
          border-color: var(--admin-border-strong);
          box-shadow: var(--admin-shadow-md);
          transform: translateY(-2px);
        }

        .gm-card-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          background: var(--admin-chip-bg);
          overflow: hidden;
        }

        .gm-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        .gm-card:hover .gm-card-img {
          transform: scale(1.04);
        }

        .gm-card-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--admin-text-muted);
          gap: 6px;
          font-size: 11px;
        }

        .gm-card-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(20,20,19,0.78);
          backdrop-filter: blur(8px);
          color: #fff;
          font-family: var(--font-body);
          font-size: 11px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: var(--radius-pill);
          border: 1px solid rgba(255,255,255,0.18);
        }

        .gm-card-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        @media (max-width: 640px) {
          .gm-card-body {
            padding: 14px;
          }
        }

        .gm-card-title {
          font-family: var(--font-display);
          font-size: 17px;
          font-weight: 600;
          color: var(--admin-text);
          margin: 0;
          line-height: 1.3;
        }

        .gm-card-accent {
          font-family: var(--font-body);
          font-size: 11px;
          color: var(--color-primary);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .gm-card-desc {
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--admin-text-soft);
          margin: 0;
          line-clamp: 2;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .gm-card-footer {
          display: flex;
          justify-content: flex-end;
          gap: 6px;
          margin-top: auto;
          padding-top: 10px;
          border-top: 1px solid var(--admin-divider);
        }

        @media (max-width: 580px) {
          .gm-card-footer {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            padding-top: 12px;
          }
          .gm-card-action {
            width: 100% !important;
            justify-content: center !important;
            padding: 9px 12px !important;
            font-size: 12px !important;
            min-height: 38px;
          }
        }

        /* ── Edit Dialog Layout ──────────────────────── */
        .gm-edit-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 20px;
          overflow: visible;
        }

        @media (max-width: 640px) {
          .gm-edit-layout {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }

        .gm-edit-col-fields {
          overflow: visible;
          position: relative;
        }

        .gm-edit-img-frame {
          width: 100%;
          aspect-ratio: 1;
          border-radius: var(--radius-md);
          background: var(--admin-chip-bg);
          border: 1px solid var(--admin-border);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 640px) {
          .gm-edit-img-frame {
            max-width: 200px;
            margin: 0 auto;
          }
        }

        .gm-edit-img-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .gm-edit-img-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: var(--admin-text-muted);
          font-size: 12px;
        }

        .gm-delete-dialog-body {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          padding: 14px 0;
          text-align: center;
          color: var(--admin-text-soft);
          font-family: var(--font-body);
          font-size: 14px;
        }

        .gm-delete-dialog-body svg {
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
