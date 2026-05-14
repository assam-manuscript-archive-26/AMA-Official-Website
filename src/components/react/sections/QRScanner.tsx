import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface QRScannerProps {
  onScan?: (data: string) => void;
  onClose?: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        setHasPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setHasPermission(false);
        setError('Camera permission denied');
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScan?.(manualInput.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card-dark p-6 min-h-[400px] flex flex-col"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display text-xl text-on-dark">QR Scanner</h3>
        {onClose && (
          <button onClick={onClose} className="text-on-dark-soft hover:text-on-dark">
            <X size={20} />
          </button>
        )}
      </div>

      {hasPermission === null && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Camera size={48} className="mx-auto mb-4 text-on-dark-soft" />
            <p className="text-on-dark-soft">Requesting camera access...</p>
          </div>
        </div>
      )}

      {hasPermission === false && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <AlertCircle size={48} className="text-error mb-4" />
          <p className="text-on-dark-soft mb-6">{error}</p>
        </div>
      )}

      {hasPermission && (
        <>
          <div className="relative aspect-square max-w-xs mx-auto mb-6 rounded-lg overflow-hidden bg-surface-dark-soft">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 border-2 border-primary opacity-50" />
          </div>

          <div className="border-t border-surface-dark-soft pt-6">
            <p className="text-on-dark-soft text-sm mb-4 text-center">
              Or enter artifact ID manually:
            </p>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Enter artifact ID"
                className="flex-1 px-4 py-2 bg-surface-dark-soft text-on-dark rounded-md border border-surface-dark-soft focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                className="btn-primary"
              >
                Search
              </button>
            </form>
          </div>
        </>
      )}
    </motion.div>
  );
}