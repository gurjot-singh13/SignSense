
import React from 'react';
import WebcamWithLandmarks from './WebcamWithLandmarks';
import SignPredictionCard from './SignPredictionCard';
import { useSignDetection } from '@/hooks/useSignDetection';

const SignDetector: React.FC = () => {
  const {
    isLoading,
    isDetecting,
    error,
    landmarks,
    videoDimensions,
    predictions,
    currentSign,
    initAttempts,
    processFrame,
    resetDetector
  } = useSignDetection();

  return (
    <div className="container max-w-5xl mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <WebcamWithLandmarks
          isLoading={isLoading}
          isDetecting={isDetecting}
          error={error}
          landmarks={landmarks}
          videoDimensions={videoDimensions}
          currentSign={currentSign}
          predictions={predictions}
          initAttempts={initAttempts}
          onFrame={processFrame}
          onReset={resetDetector}
        />
        <SignPredictionCard
          currentSign={currentSign}
          predictions={predictions}
        />
      </div>
    </div>
  );
};

export default SignDetector;
