import React, { useEffect, useRef } from 'react';
import { X, Loader2 } from 'lucide-react';

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  size?: 'md' | 'lg' | 'xl';
  onSave?: () => void | Promise<void>;
  saving?: boolean;
  saveLabel?: string;
  cancelLabel?: string;
  hideFooter?: boolean;
  children: React.ReactNode;
}

const SIZE_MAP = { md: 560, lg: 760, xl: 960 } as const;

export default function EditDialog({
  open,
  onClose,
  title,
  subtitle,
  size = 'md',
  onSave,
  saving = false,
  saveLabel = 'Save changes',
  cancelLabel = 'Cancel',
  hideFooter = false,
  children,
}: EditDialogProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !saving) onClose();
    };
    window.addEventListener('keydown', handleKey);

    // Focus the dialog after mount so screen readers announce it
    requestAnimationFrame(() => {
      if (boxRef.current) {
        const focusable = boxRef.current.querySelector<HTMLElement>(
          'input, select, textarea, button:not([data-edit-dialog-close])'
        );
        focusable?.focus();
      }
    });

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKey);
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose, saving]);

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !saving) onClose();
  };

  return (
    <div
      className="edit-dialog-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-dialog-title"
      onClick={handleBackdropClick}
    >
      <div
        ref={boxRef}
        className="edit-dialog-box"
        style={{ maxWidth: `${SIZE_MAP[size]}px` }}
      >
        {/* Header */}
        <header className="edit-dialog-header">
          <div className="edit-dialog-heading">
            <h2 id="edit-dialog-title" className="edit-dialog-title">
              {title}
            </h2>
            {subtitle && <p className="edit-dialog-subtitle">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="ax-icon-btn"
            data-edit-dialog-close
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </header>

        {/* Body */}
        <div className="edit-dialog-body">{children}</div>

        {/* Footer */}
        {!hideFooter && (
          <footer className="edit-dialog-footer">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="ax-btn ax-btn--secondary"
            >
              {cancelLabel}
            </button>
            {onSave && (
              <button
                type="button"
                onClick={() => onSave()}
                disabled={saving}
                className="ax-btn ax-btn--primary"
              >
                {saving ? (
                  <>
                    <Loader2 size={14} className="edit-dialog-spinner" />
                    Saving...
                  </>
                ) : (
                  saveLabel
                )}
              </button>
            )}
          </footer>
        )}
      </div>

      <style>{`
        .edit-dialog-backdrop {
          position: fixed;
          inset: 0;
          z-index: 90;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(20,20,19,0.55);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          padding: 24px;
          animation: adminFadeIn 0.18s ease-out;
        }
        .edit-dialog-box {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: var(--radius-xl);
          box-shadow: var(--admin-shadow-lg);
          width: 100%;
          max-height: 86vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: adminScaleIn 0.22s cubic-bezier(0.22, 1, 0.36, 1);
          transform-origin: center;
        }
        .edit-dialog-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          padding: 22px 24px 18px;
          border-bottom: 1px solid var(--admin-divider);
          flex-shrink: 0;
        }
        .edit-dialog-heading {
          flex: 1;
          min-width: 0;
        }
        .edit-dialog-title {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 600;
          color: var(--admin-text);
          margin: 0;
          line-height: 1.2;
          letter-spacing: -0.01em;
        }
        .edit-dialog-subtitle {
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--admin-text-soft);
          margin: 4px 0 0;
        }
        .edit-dialog-body {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }
        .edit-dialog-body::-webkit-scrollbar { width: 8px; }
        .edit-dialog-body::-webkit-scrollbar-track { background: transparent; }
        .edit-dialog-body::-webkit-scrollbar-thumb {
          background: var(--admin-border);
          border-radius: 4px;
        }
        .edit-dialog-body::-webkit-scrollbar-thumb:hover {
          background: var(--admin-border-strong);
        }
        .edit-dialog-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          padding: 16px 24px;
          border-top: 1px solid var(--admin-divider);
          background: var(--admin-surface);
          flex-shrink: 0;
        }
        .edit-dialog-spinner {
          animation: adminSpin 0.8s linear infinite;
        }

        @media (max-width: 640px) {
          .edit-dialog-backdrop { padding: 12px; }
          .edit-dialog-box { max-height: 92vh; border-radius: var(--radius-lg); }
          .edit-dialog-header { padding: 18px 18px 14px; }
          .edit-dialog-title { font-size: 20px; }
          .edit-dialog-body { padding: 18px; }
          .edit-dialog-footer { padding: 14px 18px; }
        }
      `}</style>
    </div>
  );
}

/* ── Helpful sub-components ──────────────────────────────── */
export function DialogGrid({
  children,
  cols = 1,
}: {
  children: React.ReactNode;
  cols?: 1 | 2;
}) {
  return (
    <>
      <div className={`dialog-grid dialog-grid--${cols}`}>{children}</div>
      <style>{`
        .dialog-grid {
          display: grid;
          gap: 16px;
        }
        .dialog-grid--1 { grid-template-columns: 1fr; }
        .dialog-grid--2 { grid-template-columns: repeat(2, 1fr); }
        .dialog-grid > .dialog-span-2 { grid-column: 1 / -1; }
        @media (max-width: 640px) {
          .dialog-grid--2 { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
