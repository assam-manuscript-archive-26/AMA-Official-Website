import React, { useState, useRef, useEffect, type ChangeEvent, type FC } from 'react';
import { compressImage, uploadImage as apiUploadImage } from '../../../backend/apis/image';
import { CloudUpload, X, Loader2, CheckCircle } from 'lucide-react';

interface UploadGalleryImageProps {
  onUploadSuccess: (url: string) => void;
  resetTrigger?: boolean;
  initialUrl?: string;
}

const UploadGalleryImage: FC<UploadGalleryImageProps> = ({
  onUploadSuccess,
  resetTrigger,
  initialUrl,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(initialUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (resetTrigger) {
      handleRemove();
    }
  }, [resetTrigger]);

  useEffect(() => {
    if (initialUrl && !file) {
      setPreviewUrl(initialUrl);
      setUploadedUrl(initialUrl);
    }
  }, [initialUrl, file]);

  const openFileDialog = () => fileInputRef.current?.click();

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith('image/') || selectedFile.size > 15 * 1024 * 1024) return;

    setFile(selectedFile);
    setUploadedUrl(null);
    onUploadSuccess('');

    const reader = new FileReader();
    reader.onload = (event) => setPreviewUrl(event.target?.result as string);
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const compressed = await compressImage(file);
      const folder = 'assam_manuscript_archive/gallery';
      const result = await apiUploadImage(compressed, folder, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      });

      if (result) {
        const imageUrl = import.meta.env.PUBLIC_IMAGE_URL || "https://uploads.backendservices.in/storage/";
        const fullUrl = imageUrl + result;
        setUploadedUrl(fullUrl);
        onUploadSuccess(fullUrl);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreviewUrl(null);
    setUploadedUrl(null);
    setIsUploading(false);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onUploadSuccess('');
  };

  return (
    <div className="upload-img-wrapper">
      {/* Drop zone / Preview */}
      <div
        className={`upload-img-zone ${file || previewUrl ? 'upload-img-zone--has-file' : ''}`}
        onClick={openFileDialog}
      >
        {previewUrl ? (
          <div className="upload-img-preview-container">
            <img src={previewUrl} alt="Preview" className="upload-img-preview" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="upload-img-remove-btn"
              title="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="upload-img-placeholder">
            <CloudUpload size={32} />
            <p>Tap to select an image</p>
            <span>JPG, PNG, WebP (auto-compressed, max 15MB)</span>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      {/* Upload button + progress */}
      {file && !uploadedUrl && (
        <div className="upload-img-action">
          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="upload-img-btn"
          >
            {isUploading ? (
              <>
                <Loader2 size={16} className="upload-img-spinner" />
                Uploading... {uploadProgress}%
              </>
            ) : (
              <>
                <CloudUpload size={16} />
                Upload Image to Cloud
              </>
            )}
          </button>
          {isUploading && (
            <div className="upload-img-progress-track">
              <div className="upload-img-progress-bar" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}
        </div>
      )}

      {/* Success state */}
      {uploadedUrl && (
        <div className="upload-img-success">
          <div className="upload-img-success-header">
            <CheckCircle size={16} />
            <span>Image uploaded to cloud</span>
          </div>
          <p className="upload-img-url" title={uploadedUrl}>{uploadedUrl}</p>
          <button type="button" onClick={handleRemove} className="upload-img-remove-action">
            Change Image
          </button>
        </div>
      )}

      <style>{`
        .upload-img-wrapper {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          box-sizing: border-box;
        }

        .upload-img-zone {
          border: 2px dashed rgba(255,255,255,0.14);
          border-radius: var(--radius-lg);
          padding: 14px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background: rgba(255,255,255,0.02);
          box-sizing: border-box;
          width: 100%;
        }

        @media (max-width: 640px) {
          .upload-img-zone {
            padding: 12px 8px;
          }
        }

        .upload-img-zone:hover {
          border-color: var(--color-primary);
          background: rgba(204, 120, 92, 0.05);
        }

        .upload-img-zone--has-file {
          border-style: solid;
          border-color: rgba(255,255,255,0.12);
        }

        .upload-img-preview-container {
          position: relative;
          width: 100%;
          max-width: 220px;
          height: 180px;
          margin: 0 auto;
        }

        .upload-img-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: var(--radius-md);
        }

        .upload-img-remove-btn {
          position: absolute;
          top: 6px;
          right: 6px;
          padding: 5px;
          background: rgba(0,0,0,0.7);
          border: none;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
        }

        .upload-img-remove-btn:hover {
          background: rgba(198, 69, 69, 0.9);
        }

        .upload-img-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 150px;
          gap: 6px;
          color: var(--color-primary);
          padding: 10px;
        }

        .upload-img-placeholder p {
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--admin-text);
          margin: 0;
          font-weight: 500;
        }

        .upload-img-placeholder span {
          font-family: var(--font-body);
          font-size: 11px;
          color: var(--admin-text-muted);
          text-align: center;
        }

        .upload-img-action {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }

        .upload-img-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 11px 16px;
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 600;
          color: var(--color-on-primary);
          background: var(--color-primary);
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: background 0.2s;
        }

        .upload-img-btn:hover:not(:disabled) {
          background: var(--color-primary-active);
        }

        .upload-img-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .upload-img-spinner {
          animation: uploadImgSpin 1s linear infinite;
        }

        @keyframes uploadImgSpin {
          to { transform: rotate(360deg); }
        }

        .upload-img-progress-track {
          width: 100%;
          height: 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          overflow: hidden;
        }

        .upload-img-progress-bar {
          height: 100%;
          background: var(--color-primary);
          border-radius: 2px;
          transition: width 0.2s ease;
        }

        .upload-img-success {
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: var(--admin-chip-bg);
          border: 1px solid var(--admin-border);
          border-radius: var(--radius-md);
          padding: 12px;
          width: 100%;
          box-sizing: border-box;
        }

        .upload-img-success-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 600;
          color: var(--color-success);
        }

        .upload-img-url {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          color: var(--admin-text-soft);
          word-break: break-all;
          white-space: normal;
          margin: 0;
          background: var(--admin-input-bg);
          padding: 6px 8px;
          border-radius: var(--radius-sm);
          max-width: 100%;
          box-sizing: border-box;
        }

        .upload-img-remove-action {
          align-self: flex-start;
          padding: 6px 14px;
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 500;
          color: var(--admin-text-soft);
          background: var(--admin-input-bg);
          border: 1px solid var(--admin-input-border);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.15s;
        }

        .upload-img-remove-action:hover {
          color: var(--color-error);
          border-color: var(--color-error);
        }
      `}</style>
    </div>
  );
};

export default UploadGalleryImage;
