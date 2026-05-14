import { useState } from "react";
import { ScanQrCode } from "lucide-react";
import QRScanner from "../qrScanner/QRScanner";

const FloatingQRButton = () => {
  const [showScanner, setShowScanner] = useState(false);

  return (
    <>
      {/* Floating QR Scanner Button */}
      <div className="fixed bottom-22 right-4 sm:bottom-6 sm:right-8 z-50 group">
        <button
          onClick={() => setShowScanner(true)}
          className="w-14 h-14 flex items-center justify-center rounded-full
          bg-[#cc785c] hover:bg-[#a9583e] hover:scale-[1.1] text-white
          backdrop-blur-lg transition-all shadow-xl cursor-pointer"
          aria-label="Open QR Scanner"
        >
          <ScanQrCode className="h-7 w-7 transition-all" />
        </button>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && <QRScanner onClose={() => setShowScanner(false)} />}
    </>
  );
};

export default FloatingQRButton;