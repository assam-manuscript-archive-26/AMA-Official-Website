import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";

interface WebcamCaptureProps {
  onScan: (imageSrc: string | null) => void;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onScan }) => {
  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      capture();
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const videoConstraints = {
    width: 500,
    height: 500,
    facingMode: "environment",
  };

  const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      onScan(imageSrc);
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Webcam Display */}
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        className="webcam-container w-full h-[300px] sm:h-[350px] rounded-xl border-2
        shadow-lg"
      />
    </div>
  );
};

export default WebcamCapture;