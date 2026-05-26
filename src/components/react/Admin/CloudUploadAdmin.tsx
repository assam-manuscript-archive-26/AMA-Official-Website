import React, { useState, useRef, type ChangeEvent, type DragEvent } from 'react';
import {
    CloudUpload, Copy, CheckCircle, X, Loader2, File as FileIcon,
    FileText, Video, Music, Image as ImageIcon,
} from 'lucide-react';
import { compressImage, uploadImage as apiUploadImage } from '../../../backend/apis/image';

const MAX_SIZE_BYTES = 100 * 1024 * 1024;
const NAMESPACE = 'assam_manuscript_archive';

const getUploadFolder = (file: File): string => {
    if (file.type.startsWith('image/')) return `${NAMESPACE}/images`;
    if (file.type === 'application/pdf') return `${NAMESPACE}/pdfs`;
    if (file.type.startsWith('video/')) return `${NAMESPACE}/videos`;
    if (file.type.startsWith('audio/')) return `${NAMESPACE}/audio`;
    return `${NAMESPACE}/misc`;
};

const fileTypeIcon = (file: File, size = 32) => {
    if (file.type.startsWith('image/')) return <ImageIcon size={size} />;
    if (file.type === 'application/pdf') return <FileText size={size} />;
    if (file.type.startsWith('video/')) return <Video size={size} />;
    if (file.type.startsWith('audio/')) return <Music size={size} />;
    return <FileIcon size={size} />;
};

const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function CloudUploadAdmin() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedPath, setUploadedPath] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [showToast, setShowToast] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    };

    const openFileDialog = () => fileInputRef.current?.click();

    const prepareFile = (selected: File | null) => {
        if (!selected) return;
        if (selected.size > MAX_SIZE_BYTES) {
            triggerToast('File size exceeds 100MB limit', 'error');
            return;
        }
        setFile(selected);
        setUploadedPath(null);
        setUploadProgress(0);

        if (selected.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => setPreviewUrl(event.target?.result as string);
            reader.readAsDataURL(selected);
        } else {
            setPreviewUrl(null);
        }
    };

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => prepareFile(e.target.files?.[0] || null);
    const handleDrop = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); prepareFile(e.dataTransfer.files?.[0] || null); };
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); };

    const handleReset = () => {
        setFile(null);
        setPreviewUrl(null);
        setUploadedPath(null);
        setIsUploading(false);
        setUploadProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleUpload = async () => {
        if (!file) {
            triggerToast('No file selected', 'error');
            return;
        }
        setIsUploading(true);
        setUploadProgress(0);
        try {
            let uploadable: File = file;
            if (file.type.startsWith('image/')) {
                uploadable = await compressImage(file);
            }
            const folder = getUploadFolder(file);
            const result = await apiUploadImage(uploadable, folder, (progressEvent) => {
                if (progressEvent.total) {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percent);
                }
            });
            if (result) {
                setUploadedPath(result);
                triggerToast('Upload successful!', 'success');
            } else {
                throw new Error('No URL returned');
            }
        } catch (err) {
            console.error(err);
            triggerToast('Upload failed. Try again.', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const fullUrl = uploadedPath
        ? (import.meta.env.PUBLIC_IMAGE_URL || 'https://uploads.backendservices.in/storage/') + uploadedPath
        : '';

    const copyToClipboard = () => {
        if (!fullUrl) return;
        navigator.clipboard.writeText(fullUrl).then(
            () => triggerToast('Copied to clipboard!', 'success'),
            () => triggerToast('Copy failed', 'error'),
        );
    };

    return (
        <div className="cu-page">
            {showToast && toast && (
                <div className={`ax-toast ${toast.type === 'success' ? 'ax-toast--success' : 'ax-toast--error'}`}>
                    {toast.message}
                </div>
            )}

            <div className="ax-page-header">
                <div>
                    <h2 className="ax-page-title">Cloud Upload</h2>
                    <p className="ax-page-subtitle">
                        Upload images, PDFs, videos, audio, or other files to the archive's storage bucket.
                    </p>
                </div>
            </div>

            <div className="cu-card">
                {/* Drop zone — empty state */}
                {!file && (
                    <div
                        className={`cu-drop ${isDragging ? 'cu-drop--active' : ''}`}
                        onClick={openFileDialog}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFileDialog(); } }}
                    >
                        <div className="cu-drop-icon">
                            <CloudUpload size={40} />
                        </div>
                        <h3 className="cu-drop-title">
                            {isDragging ? 'Drop your file here' : 'Drag & drop or click to browse'}
                        </h3>
                        <p className="cu-drop-hint">
                            Supports images, PDFs, video, audio, and more — max 100&nbsp;MB
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                    </div>
                )}

                {/* Pending upload — preview + actions */}
                {file && !uploadedPath && (
                    <div className="cu-stage">
                        <div className="cu-preview">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="cu-preview-img" />
                            ) : (
                                <div className="cu-preview-file">
                                    <div className="cu-preview-icon">{fileTypeIcon(file, 36)}</div>
                                    <h4 className="cu-preview-name" title={file.name}>{file.name}</h4>
                                    <p className="cu-preview-size">{formatFileSize(file.size)}</p>
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={handleReset}
                                className="cu-preview-remove"
                                aria-label="Remove file"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="cu-meta">
                            <div className="cu-meta-icon">{fileTypeIcon(file, 18)}</div>
                            <div className="cu-meta-text">
                                <span className="cu-meta-name" title={file.name}>{file.name}</span>
                                <span className="cu-meta-size">{formatFileSize(file.size)} • {getUploadFolder(file)}</span>
                            </div>
                        </div>

                        <div className="cu-actions">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="ax-btn ax-btn--secondary"
                                disabled={isUploading}
                            >
                                <X size={16} /> Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleUpload}
                                disabled={isUploading}
                                className="ax-btn ax-btn--primary"
                            >
                                {isUploading ? (
                                    <><Loader2 size={16} className="cu-spin" /> Uploading…</>
                                ) : (
                                    <><CloudUpload size={16} /> Upload Now</>
                                )}
                            </button>
                        </div>

                        {isUploading && (
                            <div className="cu-progress">
                                <div className="cu-progress-track">
                                    <div className="cu-progress-bar" style={{ width: `${uploadProgress}%` }} />
                                </div>
                                <span className="cu-progress-label">{uploadProgress}%</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Success state */}
                {uploadedPath && (
                    <div className="cu-stage">
                        <div className="cu-preview cu-preview--success">
                            {previewUrl ? (
                                <img src={fullUrl} alt="Uploaded" className="cu-preview-img" />
                            ) : (
                                <div className="cu-preview-file cu-preview-file--success">
                                    <div className="cu-success-badge">
                                        <CheckCircle size={48} />
                                    </div>
                                    <h4 className="cu-preview-name">File uploaded successfully</h4>
                                    <p className="cu-preview-size">{file?.name}</p>
                                </div>
                            )}
                        </div>

                        <div className="cu-url-block">
                            <div className="cu-url-head">
                                <label className="ax-label" style={{ margin: 0 }}>File URL</label>
                                <button type="button" onClick={copyToClipboard} className="cu-copy-link">
                                    <Copy size={14} /> Copy
                                </button>
                            </div>
                            <input
                                type="text"
                                readOnly
                                value={fullUrl}
                                onClick={(e) => (e.target as HTMLInputElement).select()}
                                className="ax-input cu-url-input"
                            />
                        </div>

                        <div className="cu-actions">
                            <button type="button" onClick={handleReset} className="ax-btn ax-btn--primary" style={{ width: '100%' }}>
                                <CloudUpload size={16} /> Upload Another File
                            </button>
                        </div>
                    </div>
                )}

                <div className="cu-footer-note">
                    Files are stored at <code>{NAMESPACE}/&lt;type&gt;/&lt;filename&gt;</code> and accessible via the generated URL.
                </div>
            </div>

            <style>{`
                .cu-page { width: 100%; max-width: 720px; }

                .cu-card {
                    background: var(--admin-surface);
                    border: 1px solid var(--admin-border);
                    border-radius: var(--radius-lg);
                    padding: 24px;
                    box-shadow: var(--admin-shadow-sm);
                }

                /* ── Drop zone ─────────────────────────────── */
                .cu-drop {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    padding: 56px 24px;
                    border: 2px dashed var(--admin-input-border);
                    border-radius: var(--radius-lg);
                    background: var(--admin-input-bg);
                    cursor: pointer;
                    text-align: center;
                    transition: border-color 0.18s ease, background-color 0.18s ease, transform 0.18s ease;
                    outline: none;
                }

                .cu-drop:hover,
                .cu-drop:focus-visible {
                    border-color: var(--color-primary);
                    background: color-mix(in srgb, var(--color-primary) 6%, var(--admin-input-bg));
                }

                .cu-drop--active {
                    border-style: solid;
                    border-color: var(--color-primary);
                    background: color-mix(in srgb, var(--color-primary) 10%, var(--admin-input-bg));
                    transform: scale(1.005);
                }

                .cu-drop-icon {
                    width: 72px;
                    height: 72px;
                    border-radius: 50%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background: color-mix(in srgb, var(--color-primary) 14%, transparent);
                    color: var(--color-primary);
                    margin-bottom: 4px;
                }

                .cu-drop-title {
                    font-family: var(--font-display);
                    font-size: 18px;
                    font-weight: 500;
                    color: var(--admin-text);
                    margin: 0;
                }

                .cu-drop-hint {
                    font-family: var(--font-body);
                    font-size: 13px;
                    color: var(--admin-text-soft);
                    margin: 0;
                }

                /* ── Stage (preview + actions + success) ──── */
                .cu-stage {
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                }

                .cu-preview {
                    position: relative;
                    border: 1px solid var(--admin-border);
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                    background: var(--admin-input-bg);
                }

                .cu-preview--success {
                    border-color: color-mix(in srgb, var(--color-success) 50%, var(--admin-border));
                }

                .cu-preview-img {
                    display: block;
                    width: 100%;
                    height: 280px;
                    object-fit: contain;
                    background: var(--admin-chip-bg);
                }

                .cu-preview-file {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    height: 280px;
                    padding: 24px;
                    text-align: center;
                }

                .cu-preview-icon {
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background: color-mix(in srgb, var(--color-primary) 14%, transparent);
                    color: var(--color-primary);
                    margin-bottom: 4px;
                }

                .cu-preview-name {
                    font-family: var(--font-body);
                    font-size: 15px;
                    font-weight: 600;
                    color: var(--admin-text);
                    margin: 0;
                    max-width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .cu-preview-size {
                    font-family: var(--font-body);
                    font-size: 12px;
                    color: var(--admin-text-soft);
                    margin: 0;
                }

                .cu-success-badge {
                    color: var(--color-success);
                    margin-bottom: 4px;
                }

                .cu-preview-file--success {
                    background: color-mix(in srgb, var(--color-success) 8%, transparent);
                }

                .cu-preview-remove {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(20,20,19,0.6);
                    color: #fff;
                    border: none;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(4px);
                    transition: background 0.15s ease;
                }
                .cu-preview-remove:hover { background: var(--color-error); }

                /* ── Meta row ──────────────────────────────── */
                .cu-meta {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px 14px;
                    background: var(--admin-chip-bg);
                    border: 1px solid var(--admin-border);
                    border-radius: var(--radius-md);
                }
                .cu-meta-icon {
                    flex-shrink: 0;
                    color: var(--color-primary);
                    display: inline-flex;
                }
                .cu-meta-text {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    min-width: 0;
                }
                .cu-meta-name {
                    font-family: var(--font-body);
                    font-size: 13px;
                    font-weight: 500;
                    color: var(--admin-text);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .cu-meta-size {
                    font-family: var(--font-body);
                    font-size: 11px;
                    color: var(--admin-text-soft);
                }

                /* ── Actions + progress ────────────────────── */
                .cu-actions {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                }
                @media (max-width: 480px) {
                    .cu-actions { grid-template-columns: 1fr; }
                }

                .cu-spin { animation: adminSpin 0.8s linear infinite; }

                .cu-progress {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .cu-progress-track {
                    flex: 1;
                    height: 6px;
                    border-radius: 3px;
                    background: var(--admin-divider);
                    overflow: hidden;
                }
                .cu-progress-bar {
                    height: 100%;
                    background: var(--color-primary);
                    border-radius: 3px;
                    transition: width 0.2s ease;
                }
                .cu-progress-label {
                    font-family: var(--font-body);
                    font-size: 12px;
                    font-weight: 500;
                    color: var(--admin-text-soft);
                    min-width: 36px;
                    text-align: right;
                }

                /* ── URL block ─────────────────────────────── */
                .cu-url-block {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .cu-url-head {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .cu-copy-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: none;
                    border: none;
                    color: var(--color-primary);
                    font-family: var(--font-body);
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    padding: 4px 8px;
                    border-radius: var(--radius-sm);
                    transition: background-color 0.15s ease;
                }
                .cu-copy-link:hover { background: color-mix(in srgb, var(--color-primary) 12%, transparent); }
                .cu-url-input {
                    font-family: var(--font-mono, monospace);
                    font-size: 12px;
                }

                /* ── Footer note ───────────────────────────── */
                .cu-footer-note {
                    margin-top: 18px;
                    padding-top: 14px;
                    border-top: 1px solid var(--admin-divider);
                    font-family: var(--font-body);
                    font-size: 11px;
                    color: var(--admin-text-muted);
                }
                .cu-footer-note code {
                    font-family: var(--font-mono, monospace);
                    background: var(--admin-chip-bg);
                    padding: 2px 6px;
                    border-radius: var(--radius-sm);
                    font-size: 11px;
                }
            `}</style>
        </div>
    );
}
