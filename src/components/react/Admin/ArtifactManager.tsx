import React, { useState, useEffect, useRef } from 'react';
import { Edit2, Trash2, X, Search, Filter, Volume2, VolumeX, Play, Pause, SkipBack, SkipForward, Image as ImageIcon, Plus } from 'lucide-react';
import { getAllArtifacts, updateArtifact, deleteArtifact } from '../../../backend/actions/artifact';
import EditDialog, { DialogGrid } from './EditDialog';
import AdminSpinner from './AdminSpinner';

interface Artifact { id: string; name: string; category: string; keywords: string[]; imageUrl: string; english_audio_url: string; hindi_audio_url: string; assamese_audio_url: string; english_description: string; hindi_description: string; assamese_description: string; created_at: string; updated_at: string; }
interface AudioState { isPlaying: boolean; currentTime: number; duration: number; volume: number; isMuted: boolean; currentAudioUrl: string | null; currentArtifactId: string | null; currentLanguage: string | null; }

const CATEGORIES = ['All', 'Satras', 'Mukhas', 'Ahom Dynasty', 'Folk Traditions', 'Royal Seals', 'Neo-Vaishnavite Manuscripts Preserved at Samaguri Satra'];

export default function ArtifactManager() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [filtered, setFiltered] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Artifact>>({});
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: string | null }>({ show: false, id: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [audio, setAudio] = useState<AudioState>({ isPlaying: false, currentTime: 0, duration: 0, volume: 0.7, isMuted: false, currentAudioUrl: null, currentArtifactId: null, currentLanguage: null });
  const audioRef = useRef<HTMLAudioElement>(null);

  const triggerToast = (msg: string, type: 'success' | 'error') => { setToast({ message: msg, type }); setShowToast(true); setTimeout(() => setShowToast(false), 4000); };
  const formatTime = (t: number) => `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, '0')}`;

  useEffect(() => { (async () => { setLoading(true); const res = await getAllArtifacts(); if (res.success) { setArtifacts(res.artifacts); setFiltered(res.artifacts); } setLoading(false); })(); }, []);

  useEffect(() => {
    let r = artifacts;
    if (searchTerm) { const t = searchTerm.toLowerCase(); r = r.filter(a => a.name?.toLowerCase().includes(t) || a.keywords?.some(k => k.toLowerCase().includes(t))); }
    if (filterCat !== 'All') r = r.filter(a => a.category === filterCat);
    setFiltered(r);
  }, [searchTerm, filterCat, artifacts]);

  const handlePreviewAudio = (url: string, artId: string, lang: string) => {
    if (!url) return;
    if (audio.currentArtifactId === artId && audio.currentLanguage === lang) { setAudio(p => ({ ...p, isPlaying: !p.isPlaying })); return; }
    setAudio({ isPlaying: true, currentTime: 0, duration: 0, volume: 0.7, isMuted: false, currentAudioUrl: url, currentArtifactId: artId, currentLanguage: lang });
  };

  useEffect(() => {
    if (!audioRef.current || !audio.currentAudioUrl) return;
    if (audioRef.current.src !== audio.currentAudioUrl) { audioRef.current.src = audio.currentAudioUrl; audioRef.current.load(); }
    if (audio.isPlaying) audioRef.current.play().catch(() => setAudio(p => ({ ...p, isPlaying: false })));
    else audioRef.current.pause();
    audioRef.current.volume = audio.volume; audioRef.current.muted = audio.isMuted;
  }, [audio.currentAudioUrl, audio.isPlaying, audio.volume, audio.isMuted]);

  const handleEditClick = (a: Artifact) => {
    setEditingId(a.id);
    setEditForm({ ...a, keywords: [...(a.keywords || [])] });
    setCurrentKeyword('');
  };
  const cancelEdit = () => { setEditingId(null); setEditForm({}); setCurrentKeyword(''); };

  const handleEditSubmit = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      const { id, created_at, updated_at, ...data } = editForm as Artifact;
      void id; void created_at; void updated_at;
      await updateArtifact(editingId, data);
      setArtifacts(p => p.map(a => a.id === editingId ? { ...a, ...data } : a));
      setEditingId(null);
      setEditForm({});
      triggerToast('Artifact updated', 'success');
    } catch { triggerToast('Update failed', 'error'); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.id) return;
    try {
      await deleteArtifact(deleteConfirm.id);
      setArtifacts(p => p.filter(a => a.id !== deleteConfirm.id));
      setDeleteConfirm({ show: false, id: null });
      triggerToast('Artifact deleted', 'success');
    } catch { triggerToast('Delete failed', 'error'); }
  };

  if (loading) return <AdminSpinner label="Loading artifacts..." />;

  const currentArt = artifacts.find(a => a.id === audio.currentArtifactId);

  return (
    <div className="artifact-page">
      {showToast && toast && (
        <div className={`ax-toast ${toast.type === 'success' ? 'ax-toast--success' : 'ax-toast--error'}`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="ax-page-header">
        <div>
          <h2 className="ax-page-title">Artifact Manager</h2>
          <p className="ax-page-subtitle">{filtered.length} artifact{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
        <div className="artifact-tools">
          <div className="ax-search-wrap" style={{ width: 240, flex: 'initial' }}>
            <Search size={15} />
            <input
              className="ax-search-input"
              placeholder="Search artifacts..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className={`ax-btn ax-btn--secondary ${showFilters ? 'artifact-filter-toggled' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={14} /> Filter
          </button>
        </div>
      </div>

      {/* Filter chips */}
      {showFilters && (
        <div className="ax-filter-bar">
          {CATEGORIES.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setFilterCat(c)}
              className={`ax-chip ${filterCat === c ? 'ax-chip--active' : ''}`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="artifact-grid">
        {filtered.map(artifact => {
          const langs = [
            { key: 'english', label: 'EN', url: artifact.english_audio_url },
            { key: 'hindi', label: 'HI', url: artifact.hindi_audio_url },
            { key: 'assamese', label: 'AS', url: artifact.assamese_audio_url },
          ].filter(l => l.url);

          return (
            <div key={artifact.id} className="artifact-card">
              {artifact.imageUrl ? (
                <div className="artifact-card-img-wrap">
                  <img src={artifact.imageUrl} alt={artifact.name} className="artifact-card-img" />
                </div>
              ) : (
                <div className="artifact-card-placeholder">
                  <ImageIcon size={32} />
                </div>
              )}

              <div className="artifact-card-body">
                <p className="artifact-card-cat">{artifact.category}</p>
                <h3 className="artifact-card-name">{artifact.name}</h3>

                {artifact.keywords?.length > 0 && (
                  <div className="artifact-kw-wrap">
                    {artifact.keywords.slice(0, 4).map(k => (
                      <span key={k} className="artifact-kw">{k}</span>
                    ))}
                    {artifact.keywords.length > 4 && (
                      <span className="artifact-kw artifact-kw--more">+{artifact.keywords.length - 4}</span>
                    )}
                  </div>
                )}

                {langs.length > 0 && (
                  <div className="artifact-audio-row">
                    {langs.map(l => {
                      const isActive = audio.currentArtifactId === artifact.id && audio.currentLanguage === l.key;
                      return (
                        <button
                          key={l.key}
                          type="button"
                          className={`artifact-audio-btn ${isActive && audio.isPlaying ? 'artifact-audio-btn--active' : ''}`}
                          onClick={() => handlePreviewAudio(l.url, artifact.id, l.key)}
                        >
                          {isActive && audio.isPlaying ? <Pause size={11} /> : <Play size={11} />} {l.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="artifact-card-actions">
                  <button
                    type="button"
                    className="ax-action-btn ax-action-btn--edit"
                    onClick={() => handleEditClick(artifact)}
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                  <button
                    type="button"
                    className="ax-action-btn ax-action-btn--delete"
                    onClick={() => setDeleteConfirm({ show: true, id: artifact.id })}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && !loading && (
        <div className="ax-empty">
          <div className="ax-empty-icon"><ImageIcon size={22} /></div>
          <h3 className="ax-empty-title">No artifacts found</h3>
          <p>Try adjusting your search or filter.</p>
        </div>
      )}

      {/* Edit Dialog */}
      <EditDialog
        open={!!editingId}
        onClose={cancelEdit}
        title="Edit Artifact"
        subtitle={editForm.name ? `Editing "${editForm.name}"` : 'Update artifact details'}
        size="lg"
        onSave={handleEditSubmit}
        saving={saving}
        saveLabel="Save changes"
      >
        <div className="artifact-edit-grid">
          {/* Left column — image preview */}
          <div className="artifact-edit-image-col">
            <label className="ax-label">Image preview</label>
            <div className="artifact-edit-image-frame">
              {editForm.imageUrl ? (
                <img src={editForm.imageUrl} alt="Preview" />
              ) : (
                <div className="artifact-edit-image-empty">
                  <ImageIcon size={32} />
                  <span>No image</span>
                </div>
              )}
            </div>
            <div style={{ marginTop: 12 }}>
              <label className="ax-label">Image URL</label>
              <input
                className="ax-input"
                value={editForm.imageUrl || ''}
                onChange={e => setEditForm(p => ({ ...p, imageUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Right column — metadata */}
          <div className="artifact-edit-meta-col">
            <DialogGrid cols={1}>
              <div>
                <label className="ax-label">Name</label>
                <input
                  className="ax-input"
                  value={editForm.name || ''}
                  onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Artifact name"
                />
              </div>
              <div>
                <label className="ax-label">Category</label>
                <select
                  className="ax-select"
                  value={editForm.category || ''}
                  onChange={e => setEditForm(p => ({ ...p, category: e.target.value }))}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="ax-label">Keywords</label>
                {(editForm.keywords || []).length > 0 && (
                  <div className="artifact-edit-kw-wrap">
                    {(editForm.keywords || []).map(kw => (
                      <span key={kw} className="artifact-edit-kw">
                        {kw}
                        <button
                          type="button"
                          className="artifact-edit-kw-x"
                          onClick={() => setEditForm(p => ({ ...p, keywords: p.keywords?.filter(k => k !== kw) }))}
                          aria-label={`Remove ${kw}`}
                        >
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    className="ax-input"
                    value={currentKeyword}
                    onChange={e => setCurrentKeyword(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (currentKeyword.trim() && !editForm.keywords?.includes(currentKeyword.trim())) {
                          setEditForm(p => ({ ...p, keywords: [...(p.keywords || []), currentKeyword.trim()] }));
                          setCurrentKeyword('');
                        }
                      }
                    }}
                    placeholder="Add keyword and press Enter"
                  />
                  <button
                    type="button"
                    className="ax-btn ax-btn--secondary"
                    onClick={() => {
                      if (currentKeyword.trim() && !editForm.keywords?.includes(currentKeyword.trim())) {
                        setEditForm(p => ({ ...p, keywords: [...(p.keywords || []), currentKeyword.trim()] }));
                        setCurrentKeyword('');
                      }
                    }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </DialogGrid>
          </div>

          {/* Full-width descriptions */}
          <div className="artifact-edit-descriptions">
            <label className="ax-label">Descriptions (3 languages)</label>
            <div className="artifact-edit-desc-grid">
              {['English', 'Hindi', 'Assamese'].map(lang => (
                <div key={lang}>
                  <label className="artifact-edit-desc-label">{lang}</label>
                  <textarea
                    className="ax-textarea"
                    rows={4}
                    value={(editForm as any)[`${lang.toLowerCase()}_description`] || ''}
                    onChange={e => setEditForm(p => ({ ...p, [`${lang.toLowerCase()}_description`]: e.target.value }))}
                    placeholder={`Description in ${lang}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </EditDialog>

      {/* Delete Confirm */}
      <EditDialog
        open={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, id: null })}
        title="Delete artifact?"
        subtitle="This action cannot be undone."
        size="md"
        onSave={confirmDelete}
        saveLabel="Delete artifact"
      >
        <div className="artifact-delete-body">
          <Trash2 size={32} />
          <p>The artifact, its keywords, and all language descriptions will be permanently removed.</p>
        </div>
      </EditDialog>

      {/* Mini Audio Player */}
      {audio.currentAudioUrl && (
        <div className="artifact-player">
          <div className="artifact-player-head">
            <span>{currentArt?.name} — {audio.currentLanguage}</span>
            <button
              type="button"
              className="artifact-player-close"
              onClick={() => setAudio(p => ({ ...p, currentAudioUrl: null, currentArtifactId: null, currentLanguage: null, isPlaying: false }))}
              aria-label="Close player"
            >
              <X size={14} />
            </button>
          </div>
          <div className="artifact-progress-track">
            <div className="artifact-progress-bar" style={{ width: `${(audio.currentTime / (audio.duration || 1)) * 100}%` }} />
          </div>
          <div className="artifact-player-times">
            <span>{formatTime(audio.currentTime)}</span>
            <span>{formatTime(audio.duration)}</span>
          </div>
          <div className="artifact-player-controls">
            <button type="button" className="artifact-ctrl" onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.max(0, audio.currentTime - 10); }}>
              <SkipBack size={14} />
            </button>
            <button type="button" className="artifact-ctrl-main" onClick={() => setAudio(p => ({ ...p, isPlaying: !p.isPlaying }))}>
              {audio.isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button type="button" className="artifact-ctrl" onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.min(audio.duration, audio.currentTime + 10); }}>
              <SkipForward size={14} />
            </button>
            <button type="button" className="artifact-ctrl" onClick={() => { if (audioRef.current) { audioRef.current.muted = !audio.isMuted; setAudio(p => ({ ...p, isMuted: !p.isMuted })); } }}>
              {audio.isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>
        </div>
      )}

      <audio
        ref={audioRef}
        onTimeUpdate={() => { if (audioRef.current) setAudio(p => ({ ...p, currentTime: audioRef.current!.currentTime })); }}
        onLoadedMetadata={() => { if (audioRef.current) setAudio(p => ({ ...p, duration: audioRef.current!.duration })); }}
        onEnded={() => setAudio(p => ({ ...p, isPlaying: false, currentTime: 0 }))}
      />

      <style>{`
        .artifact-page { width: 100%; }

        .artifact-tools {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }

        .artifact-filter-toggled {
          background: var(--admin-chip-hover-bg) !important;
          border-color: var(--admin-border-strong) !important;
        }

        .artifact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 18px;
        }

        .artifact-card {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
          display: flex;
          flex-direction: column;
        }
        .artifact-card:hover {
          border-color: var(--admin-border-strong);
          box-shadow: var(--admin-shadow-md);
          transform: translateY(-2px);
        }

        .artifact-card-img-wrap {
          width: 100%;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          background: var(--admin-chip-bg);
        }
        .artifact-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }
        .artifact-card:hover .artifact-card-img { transform: scale(1.04); }

        .artifact-card-placeholder {
          width: 100%;
          aspect-ratio: 4 / 3;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--admin-chip-bg);
          color: var(--admin-text-muted);
        }

        .artifact-card-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }

        .artifact-card-cat {
          font-family: var(--font-body);
          font-size: 11px;
          color: var(--color-primary);
          font-weight: 600;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .artifact-card-name {
          font-family: var(--font-display);
          font-size: 19px;
          font-weight: 500;
          color: var(--admin-text);
          margin: 0;
          line-height: 1.25;
        }

        .artifact-kw-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .artifact-kw {
          padding: 3px 10px;
          border-radius: var(--radius-pill);
          background: var(--admin-chip-bg);
          border: 1px solid var(--admin-chip-border);
          font-size: 11px;
          font-family: var(--font-body);
          color: var(--admin-text-soft);
        }
        .artifact-kw--more {
          background: transparent;
          color: var(--admin-text-muted);
          border-style: dashed;
        }

        .artifact-audio-row { display: flex; gap: 6px; flex-wrap: wrap; }
        .artifact-audio-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 10px;
          border-radius: var(--radius-md);
          border: 1px solid var(--admin-input-border);
          background: var(--admin-input-bg);
          color: var(--admin-text-soft);
          cursor: pointer;
          font-size: 11px;
          font-family: var(--font-body);
          font-weight: 500;
          letter-spacing: 0.04em;
          transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
        }
        .artifact-audio-btn:hover {
          background: var(--admin-surface-hover);
          color: var(--admin-text);
          border-color: var(--admin-border-strong);
        }
        .artifact-audio-btn--active,
        .artifact-audio-btn--active:hover {
          background: var(--color-primary);
          color: var(--color-on-primary);
          border-color: var(--color-primary);
        }

        .artifact-card-actions {
          display: flex;
          justify-content: flex-end;
          gap: 6px;
          margin-top: auto;
          padding-top: 8px;
        }

        /* ── Edit dialog layout ──────────────────────────── */
        .artifact-edit-grid {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 24px;
        }
        .artifact-edit-grid > .artifact-edit-descriptions {
          grid-column: 1 / -1;
          margin-top: 4px;
        }
        @media (max-width: 720px) {
          .artifact-edit-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }
        }

        .artifact-edit-image-frame {
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
        .artifact-edit-image-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .artifact-edit-image-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: var(--admin-text-muted);
          font-family: var(--font-body);
          font-size: 12px;
        }

        .artifact-edit-kw-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 8px;
        }
        .artifact-edit-kw {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px 4px 12px;
          background: var(--color-primary);
          color: var(--color-on-primary);
          border-radius: var(--radius-pill);
          font-size: 12px;
          font-family: var(--font-body);
          font-weight: 500;
        }
        .artifact-edit-kw-x {
          background: rgba(255,255,255,0.18);
          border: none;
          color: inherit;
          cursor: pointer;
          padding: 2px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease;
        }
        .artifact-edit-kw-x:hover { background: rgba(255,255,255,0.32); }

        .artifact-edit-desc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        @media (max-width: 720px) {
          .artifact-edit-desc-grid { grid-template-columns: 1fr; }
        }
        .artifact-edit-desc-label {
          font-family: var(--font-body);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--admin-text-muted);
          font-weight: 600;
          display: block;
          margin-bottom: 4px;
        }

        .artifact-delete-body {
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
        .artifact-delete-body svg {
          color: var(--color-error);
          padding: 12px;
          background: color-mix(in srgb, var(--color-error) 12%, transparent);
          border-radius: 50%;
          box-sizing: content-box;
        }

        /* ── Mini player ─────────────────────────────────── */
        .artifact-player {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 80;
          width: 320px;
          max-width: calc(100vw - 32px);
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--radius-lg);
          padding: 14px 16px;
          box-shadow: var(--admin-shadow-lg);
          animation: adminScaleIn 0.18s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .artifact-player-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .artifact-player-head span {
          font-size: 13px;
          font-family: var(--font-body);
          font-weight: 500;
          color: var(--admin-text);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .artifact-player-close {
          background: transparent;
          border: none;
          color: var(--admin-text-soft);
          cursor: pointer;
          padding: 4px;
          border-radius: var(--radius-sm);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .artifact-player-close:hover {
          background: var(--admin-hover-bg);
          color: var(--admin-text);
        }
        .artifact-progress-track {
          width: 100%;
          height: 4px;
          background: var(--admin-divider);
          border-radius: 2px;
          overflow: hidden;
          margin: 4px 0;
        }
        .artifact-progress-bar {
          height: 100%;
          background: var(--color-primary);
          border-radius: 2px;
          transition: width 0.2s ease;
        }
        .artifact-player-times {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: var(--admin-text-soft);
          font-family: var(--font-body);
        }
        .artifact-player-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 8px;
        }
        .artifact-ctrl {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--admin-input-bg);
          border: 1px solid var(--admin-input-border);
          color: var(--admin-text-soft);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
        }
        .artifact-ctrl:hover {
          background: var(--admin-surface-hover);
          color: var(--admin-text);
          border-color: var(--admin-border-strong);
        }
        .artifact-ctrl-main {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--color-primary);
          border: none;
          color: var(--color-on-primary);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease;
        }
        .artifact-ctrl-main:hover { background: var(--color-primary-active); }
      `}</style>
    </div>
  );
}
