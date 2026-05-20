import React, { useState, useRef, useEffect, type ChangeEvent, type FC } from 'react';
import { compressImage, uploadImage as apiUploadImage } from '../../../backend/apis/image';
import { CloudUpload, X, Loader2, CheckCircle } from 'lucide-react';

interface UploadCollectionsImageProps {
  onUploadSuccess: (url: string) => void;
  resetTrigger?: boolean;
}

const UploadCollectionsImage: FC<UploadCollectionsImageProps> = ({ onUploadSuccess, resetTrigger }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (resetTrigger) handleRemove();
  }, [resetTrigger]);

  const openFileDialog = () => fileInputRef.current?.click();

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith('image/') || selectedFile.size > 10 * 1024 * 1024) return;

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
      const folder = 'assam_manuscript_archive/collections';
      const result = await apiUploadImage(compressed, folder, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      });

      if (result) {
        const fullUrl = import.meta.env.PUBLIC_IMAGE_URL + result;
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
      <div className={`upload-img-zone ${file ? 'upload-img-zone--has-file' : ''}`} onClick={openFileDialog}>
        {previewUrl ? (
          <div className="upload-img-preview-container">
            <img src={previewUrl} alt="Preview" className="upload-img-preview" />
            <button
              onClick={(e) => { e.stopPropagation(); handleRemove(); }}
              className="upload-img-remove-btn"
              title="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="upload-img-placeholder">
            <CloudUpload size={36} />
            <p>Click to select an image</p>
            <span>Max 10MB • JPG, PNG, WebP</span>
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
                Upload Image
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
            <span>Image uploaded successfully!</span>
          </div>
          <p className="upload-img-url">{uploadedUrl}</p>
          <button onClick={handleRemove} className="upload-img-remove-action">
            Remove Image
          </button>
        </div>
      )}

      <style>{`
        .upload-img-wrapper {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .upload-img-zone {
          border: 2px dashed rgba(255,255,255,0.12);
          border-radius: var(--radius-lg);
          padding: 16px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background: rgba(255,255,255,0.02);
        }

        .upload-img-zone:hover {
          border-color: var(--color-primary);
          background: rgba(204, 120, 92, 0.04);
        }

        .upload-img-zone--has-file {
          border-style: solid;
          border-color: rgba(255,255,255,0.1);
        }

        .upload-img-preview-container {
          position: relative;
          width: 200px;
          height: 200px;
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
          top: 8px;
          right: 8px;
          padding: 4px;
          background: rgba(0,0,0,0.6);
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
          height: 200px;
          gap: 8px;
          color: var(--color-primary);
        }

        .upload-img-placeholder p {
          font-family: var(--font-body);
          font-size: 14px;
          color: var(--color-on-dark-soft);
          margin: 0;
        }

        .upload-img-placeholder span {
          font-family: var(--font-body);
          font-size: 11px;
          color: var(--color-on-dark-soft);
          opacity: 0.5;
        }

        .upload-img-action {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .upload-img-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 10px 16px;
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
        }

        .upload-img-success-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          color: var(--color-success);
        }

        .upload-img-url {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--color-on-dark-soft);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin: 0;
        }

        .upload-img-remove-action {
          align-self: flex-start;
          padding: 6px 16px;
          font-family: var(--font-body);
          font-size: 12px;
          font-weight: 500;
          color: var(--color-on-primary);
          background: var(--color-error);
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: opacity 0.15s;
        }

        .upload-img-remove-action:hover {
          opacity: 0.85;
        }
      `}</style>
    </div>
  );
};

export default UploadCollectionsImage;
