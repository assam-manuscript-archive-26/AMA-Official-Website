import React, { useState } from "react";
import WebcamCapture from "./WebcamCapture";
import jsQR from "jsqr";
import "./qrScanner.css";

interface QRScannerProps {
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onClose }) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isValidUrl, setIsValidUrl] = useState<boolean>(false);

  const handleScan = (imageSrc: string | null) => {
    if (imageSrc) {
      decodeQRCode(imageSrc);
    }
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          decodeQRCode(reader.result);
        }
      };
    }
  };

  const decodeQRCode = (imageSrc: string) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          setQrCode(code.data);
          setIsValidUrl(isValidWebsite(code.data));
          console.log("QR Code:", code.data);
        }
      }
    };
  };

  const isValidWebsite = (text: string): boolean => {
    try {
      const url = new URL(text);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-[60] backdrop-blur-sm">
      {/* Modal Container */}
      <div
        className="qr-scanner-modal rounded-2xl p-6 w-full max-w-md relative m-4 shadow-xl border-2
        backdrop-blur-lg transition-all duration-300"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="close-btn absolute top-3 right-3 text-white rounded-full w-8 h-8 flex
            items-center justify-center hover:opacity-80 transition"
          aria-label="Close QR Scanner"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h1 className="modal-title text-2xl font-semibold mb-4 text-center font-serif">QR Scanner</h1>

        {/* Webcam Scanner */}
        <WebcamCapture onScan={handleScan} />

        {/* Upload QR Code Image */}
        <div className="mt-4">
          <label
            htmlFor="qr-upload"
            className="upload-btn block w-full text-center py-2 rounded-lg cursor-pointer
            transition font-medium border border-transparent"
          >
            Upload QR Code
          </label>
          <input
            id="qr-upload"
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </div>

        {/* Display Scanned QR Code */}
        {qrCode && (
          <div className="success-badge mt-4 p-3 rounded-lg text-center border border-transparent">
            <p className="font-medium">Scanned QR Code:</p>
            <span className="font-semibold break-words">{qrCode}</span>
          </div>
        )}

        {/* Redirect Button if it's a valid URL */}
        {isValidUrl && qrCode && (
          <a
            href={qrCode}
            target="_blank"
            rel="noopener noreferrer"
            className="visit-btn mt-4 px-4 py-2 rounded-lg
            transition block text-center font-semibold border border-transparent"
          >
            Visit the Artifact Page!
          </a>
        )}
      </div>
    </div>
  );
};

export default QRScanner;