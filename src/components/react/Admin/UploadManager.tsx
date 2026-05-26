import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Trash2, Upload, Volume2, VolumeX, PlusCircle, CloudUpload, Loader2, SkipBack, SkipForward, AlertCircle } from 'lucide-react';
import UploadCollectionsImage from './UploadCollectionsImage';
import { createArtifact, updateArtifact } from '../../../backend/actions/artifact';
import { uploadAudio } from '../../../backend/apis/audio';

interface AudioFile { id: string; language: string; previewUrl: string; fileName: string; fileObject?: File; backendUrl?: string; }
interface ArtifactData { id: string; name: string; category: string; keywords: string[]; imageUrl: string; audioFiles: AudioFile[]; descriptions: { English: string; Hindi: string; Assamese: string; }; }

const LANGUAGES = ['Assamese', 'Hindi', 'English'];
const CATEGORIES = ['Satras', 'Mukhas', 'Ahom Dynasty', 'Folk Traditions', 'Royal Seals', 'Neo-Vaishnavite Manuscripts Preserved at Samaguri Satra'];

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
  const [, setVolume] = useState(0.7);
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
      const imageUrl = import.meta.env.PUBLIC_IMAGE_URL || "https://uploads.backendservices.in/storage/";
      const fullUrl = imageUrl + result;
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
    <div className="upload-page">
      {showToast && toast && (
        <div className={`ax-toast ${toast.type === 'success' ? 'ax-toast--success' : 'ax-toast--error'}`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="ax-page-header">
        <div>
          <h2 className="ax-page-title">Upload Collection Items</h2>
          <p className="ax-page-subtitle">
            Add new artifacts and their multilingual audio guides
          </p>
        </div>
        <button type="button" onClick={addArtifact} className="ax-btn ax-btn--primary">
          <PlusCircle size={16} /> Add Artifact
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {artifacts.map((artifact, index) => (
          <div key={artifact.id} className="upload-card">
            <div className="upload-card-head">
              <h3 className="upload-card-title">Artifact {index + 1}</h3>
              <button
                type="button"
                onClick={() => removeArtifact(artifact.id)}
                className="ax-action-btn ax-action-btn--delete"
                aria-label="Remove artifact"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Image */}
            <div className="upload-section">
              <label className="ax-label">Artifact Image *</label>
              <UploadCollectionsImage onUploadSuccess={(url) => setArtifacts(p => p.map(a => a.id === artifact.id ? { ...a, imageUrl: url } : a))} />
              <div style={{ marginTop: 12 }}>
                <label className="ax-label">Image URL</label>
                <input
                  className="ax-input"
                  type="text"
                  value={artifact.imageUrl}
                  onChange={e => setArtifacts(p => p.map(a => a.id === artifact.id ? { ...a, imageUrl: e.target.value } : a))}
                  placeholder="Image URL will appear after upload"
                  required
                />
              </div>
            </div>

            {/* Metadata */}
            <div className="upload-grid-2">
              <div>
                <label className="ax-label">Artifact Name *</label>
                <input
                  className="ax-input"
                  value={artifact.name}
                  onChange={e => setArtifacts(p => p.map(a => a.id === artifact.id ? { ...a, name: e.target.value } : a))}
                  placeholder="e.g. Royal Manuscript"
                  required
                />
              </div>
              <div>
                <label className="ax-label">Category *</label>
                <select
                  className="ax-select"
                  value={artifact.category}
                  onChange={e => setArtifacts(p => p.map(a => a.id === artifact.id ? { ...a, category: e.target.value } : a))}
                  required
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Keywords */}
            <div className="upload-section">
              <label className="ax-label">
                Keywords *
                <span className="upload-hint"> (press enter to add)</span>
              </label>
              {artifact.keywords.length > 0 && (
                <div className="upload-kw-wrap">
                  {artifact.keywords.map(kw => (
                    <span key={kw} className="upload-kw-tag">
                      {kw}
                      <button type="button" className="upload-kw-remove" onClick={() => handleRemoveKeyword(artifact.id, kw)} aria-label={`Remove ${kw}`}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="upload-kw-row">
                <input
                  className="ax-input"
                  style={{ flex: 1 }}
                  value={currentKeyword}
                  onChange={e => setCurrentKeyword(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddKeyword(artifact.id); } }}
                  placeholder="Type keyword and press Enter"
                />
                <button type="button" onClick={() => handleAddKeyword(artifact.id)} className="ax-btn ax-btn--secondary">
                  Add
                </button>
              </div>
            </div>

            {/* Audio */}
            <div>
              <label className="ax-label" style={{ marginBottom: 12 }}>Audio &amp; Descriptions (3 Languages)</label>
              <div className="upload-audio-grid">
                {LANGUAGES.map(lang => {
                  const file = artifact.audioFiles.find(f => f.language === lang);
                  const isCurrent = currentArtifactId === artifact.id && currentLanguage === lang;
                  const uk = `${artifact.id}_${lang}`;
                  const us = uploadingStates[uk];
                  return (
                    <div key={lang} className={`upload-audio-card ${isCurrent ? 'upload-audio-card--active' : ''}`}>
                      <div className="upload-audio-head">
                        <span className="upload-audio-lang">{lang}</span>
                        {file && (
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(lang, artifact.id)}
                            className="ax-icon-btn upload-audio-remove"
                            aria-label={`Remove ${lang} audio`}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                      {file ? (
                        <div className="upload-audio-body">
                          <div className="upload-audio-name" title={file.fileName}>{file.fileName}</div>
                          <textarea
                            className="ax-textarea"
                            rows={2}
                            value={artifact.descriptions[lang as keyof typeof artifact.descriptions]}
                            onChange={e => setArtifacts(p => p.map(a => a.id === artifact.id ? { ...a, descriptions: { ...a.descriptions, [lang]: e.target.value } } : a))}
                            placeholder={`Description in ${lang}`}
                          />
                          {!file.backendUrl && (
                            <div>
                              <button
                                type="button"
                                onClick={() => handleUploadToCloud(artifact.id, lang)}
                                disabled={us?.isUploading}
                                className="ax-btn ax-btn--primary"
                                style={{ width: '100%' }}
                              >
                                {us?.isUploading ? (
                                  <><Loader2 size={14} className="upload-spin" /> {us.progress}%</>
                                ) : (
                                  <><CloudUpload size={14} /> Upload to Cloud</>
                                )}
                              </button>
                              {us?.isUploading && (
                                <div className="upload-progress-track">
                                  <div className="upload-progress-bar" style={{ width: `${us.progress}%` }} />
                                </div>
                              )}
                            </div>
                          )}
                          {(file.backendUrl || us?.backendUrl) && (
                            <input
                              className="ax-input"
                              style={{ fontSize: 11 }}
                              value={file.backendUrl || us?.backendUrl || ''}
                              readOnly
                              onClick={e => (e.target as HTMLInputElement).select()}
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => handleLanguageClick(lang, artifact.id)}
                            className={`ax-btn ${isCurrent && isPlaying ? 'ax-btn--primary' : 'ax-btn--secondary'}`}
                            style={{ width: '100%' }}
                          >
                            {isCurrent && isPlaying ? <><Pause size={13} /> Pause</> : <><Play size={13} /> Play</>}
                          </button>
                        </div>
                      ) : (
                        <label className="upload-audio-drop">
                          <Upload size={22} />
                          <span>Upload Audio</span>
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
              <div className="upload-submit-wrap">
                {artifacts.some(a => a.audioFiles.some(f => !f.backendUrl)) && (
                  <div className="upload-warn">
                    <AlertCircle size={15} /> Upload all audio to cloud before saving
                  </div>
                )}
                <div className="upload-submit-row">
                  <button type="submit" className="ax-btn ax-btn--primary" style={{ padding: '12px 28px', fontSize: 14 }}>
                    <Upload size={15} /> Upload Artifacts
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Player */}
        {currentAudioFile && (
          <div className="upload-player">
            <div className="upload-player-meta">
              {currentArtifact?.name} — {currentAudioFile.fileName}
            </div>
            <div className="upload-progress-track">
              <div className="upload-progress-bar" style={{ width: `${(currentTime / (duration || 100)) * 100}%` }} />
            </div>
            <div className="upload-player-times">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div className="upload-player-controls">
              <button type="button" className="upload-ctrl" onClick={() => { if (audioRef.current) { audioRef.current.currentTime = Math.max(0, currentTime - 10); setCurrentTime(audioRef.current.currentTime); } }}>
                <SkipBack size={15} />
              </button>
              <button type="button" className="upload-ctrl-main" onClick={() => handleLanguageClick(currentLanguage || '', currentArtifactId || '')}>
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button type="button" className="upload-ctrl" onClick={() => { if (audioRef.current) { audioRef.current.currentTime = Math.min(duration, currentTime + 10); setCurrentTime(audioRef.current.currentTime); } }}>
                <SkipForward size={15} />
              </button>
              <button type="button" className="upload-ctrl" onClick={() => { if (audioRef.current) { audioRef.current.muted = !isMuted; setIsMuted(!isMuted); } }}>
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
            </div>
          </div>
        )}
      </form>

      <audio
        ref={audioRef}
        onTimeUpdate={() => { if (audioRef.current) setCurrentTime(audioRef.current.currentTime); }}
        onLoadedMetadata={() => { if (audioRef.current) setDuration(audioRef.current.duration); }}
        onEnded={() => setIsPlaying(false)}
      />

      <style>{`
        .upload-page { width: 100%; min-height: 100%; }

        .upload-card {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--radius-lg);
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: var(--admin-shadow-sm);
        }

        .upload-card-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 16px;
          margin-bottom: 20px;
          border-bottom: 1px solid var(--admin-divider);
          gap: 12px;
        }

        .upload-card-title {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 500;
          color: var(--admin-text);
          margin: 0;
        }

        .upload-section { margin-bottom: 20px; }

        .upload-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        @media (max-width: 640px) {
          .upload-grid-2 { grid-template-columns: 1fr; gap: 14px; }
        }

        .upload-hint {
          font-size: 11px;
          font-weight: 400;
          color: var(--admin-text-muted);
        }

        .upload-kw-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 10px;
        }

        .upload-kw-tag {
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

        .upload-kw-remove {
          background: rgba(255,255,255,0.18);
          border: none;
          color: inherit;
          cursor: pointer;
          padding: 2px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.15s ease;
        }
        .upload-kw-remove:hover { background: rgba(255,255,255,0.32); }
        .upload-kw-remove:focus-visible { outline: 2px solid #fff; outline-offset: 1px; }

        .upload-kw-row {
          display: flex;
          gap: 8px;
          align-items: stretch;
        }

        .upload-audio-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 12px;
        }

        .upload-audio-card {
          border: 2px dashed var(--admin-input-border);
          background: var(--admin-input-bg);
          border-radius: var(--radius-lg);
          padding: 16px;
          transition: border-color 0.15s ease, background-color 0.15s ease;
        }
        .upload-audio-card:hover {
          border-color: var(--admin-input-border-hover);
        }
        .upload-audio-card--active {
          border-style: solid;
          border-color: var(--color-primary);
          background: color-mix(in srgb, var(--color-primary) 6%, var(--admin-input-bg));
        }

        .upload-audio-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .upload-audio-lang {
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 600;
          color: var(--admin-text);
          letter-spacing: 0.01em;
        }
        .upload-audio-remove { width: 28px; height: 28px; }

        .upload-audio-body {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .upload-audio-name {
          font-size: 12px;
          color: var(--admin-text-soft);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 6px 8px;
          background: var(--admin-chip-bg);
          border-radius: var(--radius-sm);
        }

        .upload-audio-drop {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 120px;
          cursor: pointer;
          gap: 8px;
          color: var(--color-primary);
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 500;
          border-radius: var(--radius-md);
          transition: background-color 0.15s ease;
        }
        .upload-audio-drop:hover {
          background: color-mix(in srgb, var(--color-primary) 6%, transparent);
        }
        .upload-audio-drop span { color: var(--admin-text-soft); }

        .upload-progress-track {
          width: 100%;
          height: 4px;
          background: var(--admin-divider);
          border-radius: 2px;
          overflow: hidden;
          margin: 8px 0;
        }
        .upload-progress-bar {
          height: 100%;
          background: var(--color-primary);
          border-radius: 2px;
          transition: width 0.2s ease;
        }
        .upload-spin { animation: adminSpin 0.8s linear infinite; }

        .upload-warn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: color-mix(in srgb, var(--color-error) 10%, transparent);
          border: 1px solid color-mix(in srgb, var(--color-error) 28%, transparent);
          border-radius: var(--radius-md);
          color: var(--color-error);
          font-size: 13px;
          font-family: var(--font-body);
          margin-bottom: 16px;
        }

        .upload-submit-wrap { margin-top: 8px; }
        .upload-submit-row {
          display: flex;
          justify-content: flex-end;
          padding-top: 20px;
          border-top: 1px solid var(--admin-divider);
        }

        .upload-player {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--radius-lg);
          padding: 20px;
          margin-top: 16px;
          box-shadow: var(--admin-shadow-sm);
        }
        .upload-player-meta {
          font-size: 13px;
          font-family: var(--font-body);
          color: var(--admin-text);
          margin-bottom: 8px;
          font-weight: 500;
        }
        .upload-player-times {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: var(--admin-text-soft);
          font-family: var(--font-body);
        }
        .upload-player-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 12px;
        }
        .upload-ctrl {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--admin-input-bg);
          border: 1px solid var(--admin-input-border);
          color: var(--admin-text-soft);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
        }
        .upload-ctrl:hover {
          background: var(--admin-surface-hover);
          border-color: var(--admin-border-strong);
          color: var(--admin-text);
        }
        .upload-ctrl-main {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--color-primary);
          border: none;
          color: var(--color-on-primary);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.15s ease;
        }
        .upload-ctrl-main:hover { background: var(--color-primary-active); }
      `}</style>
    </div>
  );
}
