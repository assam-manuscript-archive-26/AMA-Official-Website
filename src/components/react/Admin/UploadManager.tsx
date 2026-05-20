import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Trash2, Upload, Volume2, VolumeX, PlusCircle, CloudUpload, Loader2, SkipBack, SkipForward, AlertCircle } from 'lucide-react';
import UploadCollectionsImage from './UploadCollectionsImage';
import { createArtifact, updateArtifact } from '../../../backend/actions/artifact';
import { uploadAudio } from '../../../backend/apis/audio';

interface AudioFile { id: string; language: string; previewUrl: string; fileName: string; fileObject?: File; backendUrl?: string; }
interface ArtifactData { id: string; name: string; category: string; keywords: string[]; imageUrl: string; audioFiles: AudioFile[]; descriptions: { English: string; Hindi: string; Assamese: string; }; }

const LANGUAGES = ['Assamese', 'Hindi', 'English'];
const CATEGORIES = ['Satras', 'Mukhas', 'Ahom Dynasty', 'Folk Traditions', 'Royal Seals', 'Language & Scripts'];

const s: Record<string, React.CSSProperties> = {
  page: { width: '100%', minHeight: '100%' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 600, color: 'var(--color-on-dark)', margin: 0 },
  addBtn: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'var(--color-primary)', color: 'var(--color-on-primary)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600 },
  card: { background: 'var(--color-surface-dark-elevated)', borderRadius: 'var(--radius-lg)', padding: 24, marginBottom: 24, border: '1px solid rgba(255,255,255,0.06)' },
  cardHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)' },
  cardTitle: { fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, color: 'var(--color-on-dark)', margin: 0 },
  delBtn: { background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', padding: 4 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 },
  label: { display: 'block', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: 'var(--color-on-dark-soft)', marginBottom: 6 },
  input: { width: '100%', padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-on-dark)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', outline: 'none', boxSizing: 'border-box' as const },
  select: { width: '100%', padding: '10px 14px', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-on-dark)', background: 'var(--color-surface-dark-elevated)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', outline: 'none', boxSizing: 'border-box' as const },
  kwWrap: { display: 'flex', flexWrap: 'wrap' as const, gap: 6, marginBottom: 8 },
  kwTag: { display: 'flex', alignItems: 'center', gap: 4, padding: '4px 12px', background: 'var(--color-primary)', color: 'var(--color-on-primary)', borderRadius: 'var(--radius-pill)', fontSize: 12, fontFamily: 'var(--font-body)' },
  kwBtn: { background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, display: 'flex' },
  kwRow: { display: 'flex', gap: 8 },
  audioGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 },
  audioCard: { border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 'var(--radius-lg)', padding: 16 },
  audioCardActive: { border: '2px solid var(--color-primary)', background: 'rgba(204,120,92,0.06)' },
  audioLabel: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', height: 120, cursor: 'pointer', gap: 8, color: 'var(--color-primary)' },
  audioName: { fontSize: 12, color: 'var(--color-on-dark-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const },
  cloudBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%', padding: '8px 12px', background: 'var(--color-primary)', color: 'var(--color-on-primary)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 500 },
  playBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 12, color: 'var(--color-on-dark-soft)', fontFamily: 'var(--font-body)' },
  textarea: { width: '100%', padding: '8px 12px', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-on-dark)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', outline: 'none', resize: 'vertical' as const, boxSizing: 'border-box' as const },
  submitRow: { display: 'flex', justifyContent: 'flex-end', marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' },
  submitBtn: { display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: 'var(--color-primary)', color: 'var(--color-on-primary)', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600 },
  toast: { position: 'fixed' as const, top: 24, right: 24, zIndex: 50, padding: '14px 24px', borderRadius: 'var(--radius-md)', color: '#fff', fontSize: 14, fontFamily: 'var(--font-body)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', animation: 'slideIn 0.3s ease-out' },
  warn: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgba(198,69,69,0.1)', border: '1px solid rgba(198,69,69,0.2)', borderRadius: 'var(--radius-md)', color: 'var(--color-error)', fontSize: 13, fontFamily: 'var(--font-body)', marginBottom: 16 },
  player: { background: 'var(--color-surface-dark-elevated)', borderRadius: 'var(--radius-lg)', padding: 20, border: '1px solid rgba(255,255,255,0.06)', marginTop: 16 },
  progressTrack: { width: '100%', height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden', margin: '8px 0' },
  progressBar: { height: '100%', background: 'var(--color-primary)', borderRadius: 2, transition: 'width 0.2s' },
  controls: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 8 },
  ctrlBtn: { padding: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: 'none', color: 'var(--color-on-dark-soft)', cursor: 'pointer' },
  playMainBtn: { padding: 10, borderRadius: '50%', background: 'var(--color-primary)', border: 'none', color: 'var(--color-on-primary)', cursor: 'pointer' },
};

export default function UploadManager() {
  const [artifacts, setArtifacts] = useState<ArtifactData[]>([{
    id: Date.now().toString(), name: '', category: '', keywords: [], imageUrl: '', audioFiles: [],
    descriptions: { English: '', Hindi: '', Assamese: '' }
  }]);
  const [currentArtifactId, setCurrentArtifactId] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showToast, setShowToast] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [uploadingStates, setUploadingStates] = useState<Record<string, { progress: number; isUploading: boolean; backendUrl: string | null }>>({});

  const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type }); setShowToast(true); setTimeout(() => setShowToast(false), 4000);
  };
  const formatTime = (t: number) => { const m = Math.floor(t / 60), sc = Math.floor(t % 60); return `${m}:${sc < 10 ? '0' : ''}${sc}`; };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>, language: string, artifactId: string) => {
    const file = e.target.files?.[0]; if (!file) return;
    const url = URL.createObjectURL(file);
    const uploadKey = `${artifactId}_${language}`;
    setUploadingStates(p => ({ ...p, [uploadKey]: { progress: 0, isUploading: false, backendUrl: null } }));
    setArtifacts(p => p.map(a => a.id === artifactId ? { ...a, audioFiles: [...a.audioFiles.filter(f => f.language !== language), { id: Math.random().toString(36).substring(2, 9), language, previewUrl: url, fileName: file.name, fileObject: file }] } : a));
  };

  const handleUploadToCloud = async (artifactId: string, language: string) => {
    const artifact = artifacts.find(a => a.id === artifactId); if (!artifact) return;
    const file = artifact.audioFiles.find(f => f.language === language); if (!file?.fileObject) return;
    const uploadKey = `${artifactId}_${language}`;
    try {
      setUploadingStates(p => ({ ...p, [uploadKey]: { ...p[uploadKey], isUploading: true, progress: 0 } }));
      const result = await uploadAudio(file.fileObject, 'assam_manuscript_archive/audio', (pe) => {
        if (pe.total) { const prog = Math.round((pe.loaded * 100) / pe.total); setUploadingStates(p => ({ ...p, [uploadKey]: { ...p[uploadKey], progress: prog } })); }
      });
      const fullUrl = import.meta.env.PUBLIC_IMAGE_URL + result;
      setUploadingStates(p => ({ ...p, [uploadKey]: { ...p[uploadKey], backendUrl: fullUrl, isUploading: false } }));
      setArtifacts(p => p.map(a => a.id === artifactId ? { ...a, audioFiles: a.audioFiles.map(f => f.language === language ? { ...f, backendUrl: fullUrl } : f) } : a));
    } catch { setUploadingStates(p => ({ ...p, [uploadKey]: { ...p[uploadKey], isUploading: false } })); triggerToast(`Failed to upload ${file.fileName}`, 'error'); }
  };

  const handleRemoveFile = (language: string, artifactId: string) => {
    setArtifacts(p => p.map(a => a.id === artifactId ? { ...a, audioFiles: a.audioFiles.filter(f => f.language !== language) } : a));
    setUploadingStates(p => { const n = { ...p }; delete n[`${artifactId}_${language}`]; return n; });
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    if (currentLanguage === language && currentArtifactId === artifactId) { setCurrentLanguage(null); setCurrentArtifactId(null); setIsPlaying(false); }
  };

  const handleLanguageClick = (language: string, artifactId: string) => {
    if (artifactId === currentArtifactId && language === currentLanguage) setIsPlaying(p => !p);
    else { setCurrentArtifactId(artifactId); setCurrentLanguage(language); setIsPlaying(false); }
  };

  const addArtifact = () => setArtifacts(p => [...p, { id: Date.now().toString(), name: '', category: '', keywords: [], imageUrl: '', audioFiles: [], descriptions: { English: '', Hindi: '', Assamese: '' } }]);
  const removeArtifact = (id: string) => { if (artifacts.length === 1) { triggerToast('At least one artifact required', 'error'); return; } setArtifacts(p => p.filter(a => a.id !== id)); };

  const handleAddKeyword = (aid: string) => {
    if (!currentKeyword.trim()) return;
    setArtifacts(p => p.map(a => a.id === aid && !a.keywords.includes(currentKeyword.trim()) ? { ...a, keywords: [...a.keywords, currentKeyword.trim()] } : a));
    setCurrentKeyword('');
  };
  const handleRemoveKeyword = (aid: string, kw: string) => setArtifacts(p => p.map(a => a.id === aid ? { ...a, keywords: a.keywords.filter(k => k !== kw) } : a));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    setIsPlaying(false); setCurrentArtifactId(null); setCurrentLanguage(null);
    for (const a of artifacts) {
      if (!a.name || !a.category || a.keywords.length === 0 || !a.imageUrl) { triggerToast('Please fill all required fields', 'error'); return; }
      if (a.audioFiles.length === 0) { triggerToast('Please upload at least one audio file', 'error'); return; }
      if (a.audioFiles.some(f => !f.backendUrl)) { triggerToast('Please upload all audio to cloud first', 'error'); return; }
    }
    try {
      for (const a of artifacts) {
        const data: any = { name: a.name, category: a.category, keywords: a.keywords, imageUrl: a.imageUrl, english_description: a.descriptions.English, hindi_description: a.descriptions.Hindi, assamese_description: a.descriptions.Assamese, has_audio: a.audioFiles.length > 0 };
        a.audioFiles.forEach(f => { if (f.backendUrl) { if (f.language === 'English') data.english_audio_url = f.backendUrl; else if (f.language === 'Hindi') data.hindi_audio_url = f.backendUrl; else if (f.language === 'Assamese') data.assamese_audio_url = f.backendUrl; } });
        const res = await createArtifact(data);
        if (res?.artifact?.id) await updateArtifact(res.artifact.id, { audio_guide_id: res.artifact.id });
      }
      triggerToast('Artifacts saved successfully!', 'success');
      setArtifacts([{ id: Date.now().toString(), name: '', category: '', keywords: [], imageUrl: '', audioFiles: [], descriptions: { English: '', Hindi: '', Assamese: '' } }]);
    } catch { triggerToast('Failed to save artifacts', 'error'); }
  };

  useEffect(() => {
    if (!audioRef.current || !currentArtifactId || !currentLanguage) return;
    const a = artifacts.find(x => x.id === currentArtifactId); if (!a) return;
    const f = a.audioFiles.find(x => x.language === currentLanguage); if (!f) return;
    if (audioRef.current.src !== f.previewUrl) { audioRef.current.src = f.previewUrl; audioRef.current.load(); }
    if (isPlaying) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  }, [currentArtifactId, currentLanguage, isPlaying, artifacts]);

  const currentArtifact = artifacts.find(a => a.id === currentArtifactId);
  const currentAudioFile = currentArtifact?.audioFiles.find(f => f.language === currentLanguage);

  return (
    <div style={s.page}>
      {showToast && toast && <div style={{ ...s.toast, background: toast.type === 'success' ? 'var(--color-success)' : 'var(--color-error)' }}>{toast.message}</div>}
      <div style={s.header}>
        <h2 style={s.title}>Artifact & Audio Manager</h2>
        <button type="button" onClick={addArtifact} style={s.addBtn}><PlusCircle size={18} /> Add Artifact</button>
      </div>
      <form onSubmit={handleSubmit}>
        {artifacts.map((artifact, index) => (
          <div key={artifact.id} style={s.card}>
            <div style={s.cardHead}>
              <h3 style={s.cardTitle}>Artifact {index + 1}</h3>
              <button type="button" onClick={() => removeArtifact(artifact.id)} style={s.delBtn}><Trash2 size={18} /></button>
            </div>
            {/* Image */}
            <div style={{ marginBottom: 20 }}>
              <label style={s.label}>Artifact Image *</label>
              <UploadCollectionsImage onUploadSuccess={(url) => setArtifacts(p => p.map(a => a.id === artifact.id ? { ...a, imageUrl: url } : a))} />
              <div style={{ marginTop: 8 }}>
                <label style={s.label}>Image URL</label>
                <input style={s.input} type="text" value={artifact.imageUrl} onChange={e => setArtifacts(p => p.map(a => a.id === artifact.id ? { ...a, imageUrl: e.target.value } : a))} placeholder="Image URL will appear after upload" required />
              </div>
            </div>
            {/* Metadata */}
            <div style={s.grid2}>
              <div><label style={s.label}>Artifact Name *</label><input style={s.input} value={artifact.name} onChange={e => setArtifacts(p => p.map(a => a.id === artifact.id ? { ...a, name: e.target.value } : a))} placeholder="e.g. Royal Manuscript" required /></div>
              <div><label style={s.label}>Category *</label>
                <select style={s.select} value={artifact.category} onChange={e => setArtifacts(p => p.map(a => a.id === artifact.id ? { ...a, category: e.target.value } : a))} required>
                  <option value="">Select Category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            {/* Keywords */}
            <div style={{ marginBottom: 20 }}>
              <label style={s.label}>Keywords * <span style={{ fontSize: 11, opacity: 0.5 }}>(press enter)</span></label>
              <div style={s.kwWrap}>
                {artifact.keywords.map(kw => <span key={kw} style={s.kwTag}>{kw}<button type="button" style={s.kwBtn} onClick={() => handleRemoveKeyword(artifact.id, kw)}><X size={14} /></button></span>)}
              </div>
              <div style={s.kwRow}>
                <input style={{ ...s.input, flex: 1 }} value={currentKeyword} onChange={e => setCurrentKeyword(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddKeyword(artifact.id); } }} placeholder="Type keyword and press Enter" />
                <button type="button" onClick={() => handleAddKeyword(artifact.id)} style={{ ...s.addBtn, padding: '10px 16px' }}>Add</button>
              </div>
            </div>
            {/* Audio */}
            <div>
              <label style={{ ...s.label, marginBottom: 12 }}>Audio & Descriptions (3 Languages)</label>
              <div style={s.audioGrid}>
                {LANGUAGES.map(lang => {
                  const file = artifact.audioFiles.find(f => f.language === lang);
                  const isCurrent = currentArtifactId === artifact.id && currentLanguage === lang;
                  const uk = `${artifact.id}_${lang}`;
                  const us = uploadingStates[uk];
                  return (
                    <div key={lang} style={{ ...s.audioCard, ...(isCurrent ? s.audioCardActive : {}) }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--color-on-dark)' }}>{lang}</span>
                        {file && <button type="button" onClick={() => handleRemoveFile(lang, artifact.id)} style={s.delBtn}><Trash2 size={14} /></button>}
                      </div>
                      {file ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <div style={s.audioName} title={file.fileName}>{file.fileName}</div>
                          {/* Description */}
                          <textarea style={s.textarea} rows={2} value={artifact.descriptions[lang as keyof typeof artifact.descriptions]} onChange={e => setArtifacts(p => p.map(a => a.id === artifact.id ? { ...a, descriptions: { ...a.descriptions, [lang]: e.target.value } } : a))} placeholder={`Description in ${lang}`} />
                          {/* Cloud upload */}
                          {!file.backendUrl && (
                            <div>
                              <button type="button" onClick={() => handleUploadToCloud(artifact.id, lang)} disabled={us?.isUploading} style={{ ...s.cloudBtn, opacity: us?.isUploading ? 0.6 : 1 }}>
                                {us?.isUploading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> {us.progress}%</> : <><CloudUpload size={14} /> Upload to Cloud</>}
                              </button>
                              {us?.isUploading && <div style={s.progressTrack}><div style={{ ...s.progressBar, width: `${us.progress}%` }} /></div>}
                            </div>
                          )}
                          {(file.backendUrl || us?.backendUrl) && <input style={{ ...s.input, fontSize: 11 }} value={file.backendUrl || us?.backendUrl || ''} readOnly onClick={e => (e.target as HTMLInputElement).select()} />}
                          <button type="button" onClick={() => handleLanguageClick(lang, artifact.id)} style={{ ...s.playBtn, ...(isCurrent && isPlaying ? { background: 'var(--color-primary)', color: 'var(--color-on-primary)' } : {}) }}>
                            {isCurrent && isPlaying ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Play</>}
                          </button>
                        </div>
                      ) : (
                        <label style={s.audioLabel}>
                          <Upload size={22} /><span style={{ fontSize: 12, color: 'var(--color-on-dark-soft)' }}>Upload Audio</span>
                          <input type="file" accept="audio/*" onChange={e => handleAudioUpload(e, lang, artifact.id)} style={{ display: 'none' }} />
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Submit on last */}
            {index === artifacts.length - 1 && (
              <div>
                {artifacts.some(a => a.audioFiles.some(f => !f.backendUrl)) && <div style={s.warn}><AlertCircle size={16} /> Upload all audio to cloud before saving</div>}
                <div style={s.submitRow}><button type="submit" style={s.submitBtn}><Upload size={16} /> Upload Artifacts</button></div>
              </div>
            )}
          </div>
        ))}
        {/* Player */}
        {currentAudioFile && (
          <div style={s.player}>
            <div style={{ fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--color-on-dark)', marginBottom: 8 }}>{currentArtifact?.name} — {currentAudioFile.fileName}</div>
            <div style={s.progressTrack}><div style={{ ...s.progressBar, width: `${(currentTime / (duration || 100)) * 100}%` }} /></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--color-on-dark-soft)', fontFamily: 'var(--font-body)' }}><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
            <div style={s.controls}>
              <button type="button" style={s.ctrlBtn} onClick={() => { if (audioRef.current) { audioRef.current.currentTime = Math.max(0, currentTime - 10); setCurrentTime(audioRef.current.currentTime); } }}><SkipBack size={16} /></button>
              <button type="button" style={s.playMainBtn} onClick={() => handleLanguageClick(currentLanguage || '', currentArtifactId || '')}>{isPlaying ? <Pause size={20} /> : <Play size={20} />}</button>
              <button type="button" style={s.ctrlBtn} onClick={() => { if (audioRef.current) { audioRef.current.currentTime = Math.min(duration, currentTime + 10); setCurrentTime(audioRef.current.currentTime); } }}><SkipForward size={16} /></button>
              <button type="button" style={s.ctrlBtn} onClick={() => { if (audioRef.current) { audioRef.current.muted = !isMuted; setIsMuted(!isMuted); } }}>{isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}</button>
            </div>
          </div>
        )}
      </form>
      <audio ref={audioRef} onTimeUpdate={() => { if (audioRef.current) setCurrentTime(audioRef.current.currentTime); }} onLoadedMetadata={() => { if (audioRef.current) setDuration(audioRef.current.duration); }} onEnded={() => setIsPlaying(false)} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } @media(max-width:768px) { .upload-audio-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
