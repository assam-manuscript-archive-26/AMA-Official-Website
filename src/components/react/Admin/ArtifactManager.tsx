import React, { useState, useEffect, useRef } from 'react';
import { Edit2, Trash2, X, Save, Search, Filter, Volume2, VolumeX, Play, Pause, SkipBack, SkipForward, Loader2, Image as ImageIcon } from 'lucide-react';
import { getAllArtifacts, updateArtifact, deleteArtifact } from '../../../backend/actions/artifact';

interface Artifact { id: string; name: string; category: string; keywords: string[]; imageUrl: string; english_audio_url: string; hindi_audio_url: string; assamese_audio_url: string; english_description: string; hindi_description: string; assamese_description: string; created_at: string; updated_at: string; }
interface AudioState { isPlaying: boolean; currentTime: number; duration: number; volume: number; isMuted: boolean; currentAudioUrl: string | null; currentArtifactId: string | null; currentLanguage: string | null; }

const CATEGORIES = ['All', 'Satras', 'Mukhas', 'Ahom Dynasty', 'Folk Traditions', 'Royal Seals', 'Neo-Vaishnavite Manuscripts Preserved at Samaguri Satra'];

const cs: Record<string, React.CSSProperties> = {
  page: { width: '100%' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' as const, gap: 12 },
  title: { fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 600, color: 'var(--color-on-dark)', margin: 0 },
  subtitle: { fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-on-dark-soft)', margin: '4px 0 0' },
  searchRow: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' as const },
  searchInput: { padding: '8px 14px 8px 36px', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-on-dark)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', outline: 'none', width: 240, boxSizing: 'border-box' as const },
  filterBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', color: 'var(--color-on-dark-soft)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)' },
  filterBar: { display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginBottom: 20 },
  filterChip: { padding: '6px 16px', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'var(--color-on-dark-soft)', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 500, transition: 'all 0.15s' },
  filterChipActive: { background: 'var(--color-primary)', color: 'var(--color-on-primary)', borderColor: 'var(--color-primary)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 },
  card: { background: 'var(--color-surface-dark-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', transition: 'border-color 0.15s' },
  cardImg: { width: '100%', height: 180, objectFit: 'cover' as const, display: 'block' },
  cardImgPlaceholder: { width: '100%', height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', color: 'var(--color-on-dark-soft)' },
  cardBody: { padding: 16 },
  cardName: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, color: 'var(--color-on-dark)', margin: '0 0 6px' },
  cardCat: { fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-primary)', fontWeight: 500, margin: '0 0 8px', textTransform: 'uppercase' as const, letterSpacing: '0.04em' },
  kwWrap: { display: 'flex', flexWrap: 'wrap' as const, gap: 4, marginBottom: 12 },
  kw: { padding: '2px 10px', borderRadius: 'var(--radius-pill)', background: 'rgba(255,255,255,0.06)', fontSize: 11, fontFamily: 'var(--font-body)', color: 'var(--color-on-dark-soft)' },
  audioRow: { display: 'flex', gap: 6, marginBottom: 12 },
  audioBtn: { display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 'var(--radius-md)', border: 'none', background: 'rgba(255,255,255,0.06)', color: 'var(--color-on-dark-soft)', cursor: 'pointer', fontSize: 11, fontFamily: 'var(--font-body)' },
  audioBtnActive: { background: 'var(--color-primary)', color: 'var(--color-on-primary)' },
  cardActions: { display: 'flex', justifyContent: 'flex-end', gap: 6 },
  actionBtn: { padding: '6px 12px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 4 },
  editBtn: { background: 'rgba(93,184,166,0.15)', color: '#5db8a6' },
  delBtn: { background: 'rgba(198,69,69,0.15)', color: 'var(--color-error)' },
  input: { width: '100%', padding: '8px 12px', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-on-dark)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', outline: 'none', boxSizing: 'border-box' as const },
  select: { width: '100%', padding: '8px 12px', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-on-dark)', background: 'var(--color-surface-dark-elevated)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', outline: 'none', boxSizing: 'border-box' as const },
  label: { fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, color: 'var(--color-on-dark-soft)', marginBottom: 4, display: 'block' },
  textarea: { width: '100%', padding: '8px 12px', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-on-dark)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', outline: 'none', resize: 'vertical' as const, boxSizing: 'border-box' as const },
  toast: { position: 'fixed' as const, top: 24, right: 24, zIndex: 100, padding: '14px 24px', borderRadius: 'var(--radius-md)', color: '#fff', fontSize: 14, fontFamily: 'var(--font-body)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' },
  modal: { position: 'fixed' as const, inset: 0, zIndex: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' },
  modalBox: { background: 'var(--color-surface-dark-elevated)', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid rgba(255,255,255,0.1)', maxWidth: 420, width: '90%' },
  player: { position: 'fixed' as const, bottom: 16, right: 16, zIndex: 80, width: 320, background: 'var(--color-surface-dark-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.1)', padding: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' },
  progressTrack: { width: '100%', height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden', margin: '8px 0' },
  progressBar: { height: '100%', background: 'var(--color-primary)', borderRadius: 2, transition: 'width 0.2s' },
  controls: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 8 },
  ctrlBtn: { padding: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: 'none', color: 'var(--color-on-dark-soft)', cursor: 'pointer' },
  playBtn: { padding: 8, borderRadius: '50%', background: 'var(--color-primary)', border: 'none', color: 'var(--color-on-primary)', cursor: 'pointer' },
  saveBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--color-primary)', color: 'var(--color-on-primary)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 600 },
  cancelBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'rgba(255,255,255,0.06)', color: 'var(--color-on-dark-soft)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)' },
};

export default function ArtifactManager() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [filtered, setFiltered] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Artifact>>({});
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

  const handleEditClick = (a: Artifact) => { setEditingId(a.id); setEditForm({ ...a, keywords: [...(a.keywords || [])] }); };
  const cancelEdit = () => { setEditingId(null); setEditForm({}); };

  const handleEditSubmit = async () => {
    if (!editingId) return;
    try {
      const { id, created_at, updated_at, ...data } = editForm as Artifact;
      await updateArtifact(editingId, data);
      setArtifacts(p => p.map(a => a.id === editingId ? { ...a, ...data } : a));
      setEditingId(null); triggerToast('Artifact updated', 'success');
    } catch { triggerToast('Update failed', 'error'); }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.id) return;
    try { await deleteArtifact(deleteConfirm.id); setArtifacts(p => p.filter(a => a.id !== deleteConfirm.id)); setDeleteConfirm({ show: false, id: null }); triggerToast('Artifact deleted', 'success'); }
    catch { triggerToast('Delete failed', 'error'); }
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 12, color: 'var(--color-on-dark-soft)', fontFamily: 'var(--font-body)', fontSize: 14 }}><Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} /> Loading artifacts...</div>;

  const currentArt = artifacts.find(a => a.id === audio.currentArtifactId);

  return (
    <div style={cs.page}>
      {showToast && toast && <div style={{ ...cs.toast, background: toast.type === 'success' ? 'var(--color-success)' : 'var(--color-error)' }}>{toast.message}</div>}

      <div style={cs.header}>
        <div><h2 style={cs.title}>Artifact Manager</h2><p style={cs.subtitle}>{filtered.length} artifact{filtered.length !== 1 ? 's' : ''} found</p></div>
        <div style={cs.searchRow}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-on-dark-soft)', opacity: 0.5 }} />
            <input style={cs.searchInput} placeholder="Search artifacts..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <button style={cs.filterBtn} onClick={() => setShowFilters(!showFilters)}><Filter size={14} /> Filter</button>
        </div>
      </div>

      {showFilters && <div style={cs.filterBar}>{CATEGORIES.map(c => <button key={c} onClick={() => setFilterCat(c)} style={{ ...cs.filterChip, ...(filterCat === c ? cs.filterChipActive : {}) }}>{c}</button>)}</div>}

      <div style={cs.grid}>
        {filtered.map(artifact => {
          const isEditing = editingId === artifact.id;
          const langs = [{ key: 'english', label: 'EN', url: artifact.english_audio_url }, { key: 'hindi', label: 'HI', url: artifact.hindi_audio_url }, { key: 'assamese', label: 'AS', url: artifact.assamese_audio_url }].filter(l => l.url);

          return (
            <div key={artifact.id} style={cs.card}>
              {artifact.imageUrl ? <img src={artifact.imageUrl} alt={artifact.name} style={cs.cardImg} /> : <div style={cs.cardImgPlaceholder}><ImageIcon size={32} /></div>}
              <div style={cs.cardBody}>
                {isEditing ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div><label style={cs.label}>Name</label><input style={cs.input} value={editForm.name || ''} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} /></div>
                    <div><label style={cs.label}>Category</label>
                      <select style={cs.select} value={editForm.category || ''} onChange={e => setEditForm(p => ({ ...p, category: e.target.value }))}>
                        {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div><label style={cs.label}>Image URL</label><input style={cs.input} value={editForm.imageUrl || ''} onChange={e => setEditForm(p => ({ ...p, imageUrl: e.target.value }))} /></div>
                    <div><label style={cs.label}>Keywords</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
                        {(editForm.keywords || []).map(kw => <span key={kw} style={{ ...cs.kw, background: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>{kw} <button style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }} onClick={() => setEditForm(p => ({ ...p, keywords: p.keywords?.filter(k => k !== kw) }))}><X size={12} /></button></span>)}
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <input style={{ ...cs.input, flex: 1 }} value={currentKeyword} onChange={e => setCurrentKeyword(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (currentKeyword.trim() && !editForm.keywords?.includes(currentKeyword.trim())) { setEditForm(p => ({ ...p, keywords: [...(p.keywords || []), currentKeyword.trim()] })); setCurrentKeyword(''); } } }} placeholder="Add keyword" />
                      </div>
                    </div>
                    {['English', 'Hindi', 'Assamese'].map(lang => (
                      <div key={lang}>
                        <label style={cs.label}>{lang} Description</label>
                        <textarea style={cs.textarea} rows={2} value={(editForm as any)[`${lang.toLowerCase()}_description`] || ''} onChange={e => setEditForm(p => ({ ...p, [`${lang.toLowerCase()}_description`]: e.target.value }))} />
                      </div>
                    ))}
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
                      <button style={cs.cancelBtn} onClick={cancelEdit}><X size={14} /> Cancel</button>
                      <button style={cs.saveBtn} onClick={handleEditSubmit}><Save size={14} /> Save</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p style={cs.cardCat}>{artifact.category}</p>
                    <h3 style={cs.cardName}>{artifact.name}</h3>
                    {artifact.keywords?.length > 0 && <div style={cs.kwWrap}>{artifact.keywords.map(k => <span key={k} style={cs.kw}>{k}</span>)}</div>}
                    {langs.length > 0 && <div style={cs.audioRow}>{langs.map(l => {
                      const isActive = audio.currentArtifactId === artifact.id && audio.currentLanguage === l.key;
                      return <button key={l.key} style={{ ...cs.audioBtn, ...(isActive && audio.isPlaying ? cs.audioBtnActive : {}) }} onClick={() => handlePreviewAudio(l.url, artifact.id, l.key)}>{isActive && audio.isPlaying ? <Pause size={12} /> : <Play size={12} />} {l.label}</button>;
                    })}</div>}
                    <div style={cs.cardActions}>
                      <button style={{ ...cs.actionBtn, ...cs.editBtn }} onClick={() => handleEditClick(artifact)}><Edit2 size={13} /> Edit</button>
                      <button style={{ ...cs.actionBtn, ...cs.delBtn }} onClick={() => setDeleteConfirm({ show: true, id: artifact.id })}><Trash2 size={13} /> Delete</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && !loading && <div style={{ textAlign: 'center', padding: 48, color: 'var(--color-on-dark-soft)', fontFamily: 'var(--font-body)', fontSize: 14, opacity: 0.6 }}>No Collections found</div>}

      {/* Delete Confirm Modal */}
      {deleteConfirm.show && (
        <div style={cs.modal} onClick={() => setDeleteConfirm({ show: false, id: null })}>
          <div style={cs.modalBox} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--color-on-dark)', margin: '0 0 12px' }}>Delete Artifact?</h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-on-dark-soft)', margin: '0 0 20px' }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button style={cs.cancelBtn} onClick={() => setDeleteConfirm({ show: false, id: null })}>Cancel</button>
              <button style={{ ...cs.saveBtn, background: 'var(--color-error)' }} onClick={confirmDelete}><Trash2 size={14} /> Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Mini Audio Player */}
      {audio.currentAudioUrl && (
        <div style={cs.player}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--color-on-dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentArt?.name} — {audio.currentLanguage}</span>
            <button style={{ background: 'none', border: 'none', color: 'var(--color-on-dark-soft)', cursor: 'pointer' }} onClick={() => setAudio(p => ({ ...p, currentAudioUrl: null, currentArtifactId: null, currentLanguage: null, isPlaying: false }))}><X size={16} /></button>
          </div>
          <div style={cs.progressTrack}><div style={{ ...cs.progressBar, width: `${(audio.currentTime / (audio.duration || 1)) * 100}%` }} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--color-on-dark-soft)', fontFamily: 'var(--font-body)' }}><span>{formatTime(audio.currentTime)}</span><span>{formatTime(audio.duration)}</span></div>
          <div style={cs.controls}>
            <button style={cs.ctrlBtn} onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.max(0, audio.currentTime - 10); }}><SkipBack size={14} /></button>
            <button style={cs.playBtn} onClick={() => setAudio(p => ({ ...p, isPlaying: !p.isPlaying }))}>{audio.isPlaying ? <Pause size={16} /> : <Play size={16} />}</button>
            <button style={cs.ctrlBtn} onClick={() => { if (audioRef.current) audioRef.current.currentTime = Math.min(audio.duration, audio.currentTime + 10); }}><SkipForward size={14} /></button>
            <button style={cs.ctrlBtn} onClick={() => { if (audioRef.current) { audioRef.current.muted = !audio.isMuted; setAudio(p => ({ ...p, isMuted: !p.isMuted })); } }}>{audio.isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}</button>
          </div>
        </div>
      )}

      <audio ref={audioRef} onTimeUpdate={() => { if (audioRef.current) setAudio(p => ({ ...p, currentTime: audioRef.current!.currentTime })); }} onLoadedMetadata={() => { if (audioRef.current) setAudio(p => ({ ...p, duration: audioRef.current!.duration })); }} onEnded={() => setAudio(p => ({ ...p, isPlaying: false, currentTime: 0 }))} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
