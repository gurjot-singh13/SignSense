
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { initHandDetector, detectHands, getFormattedLandmarks, updateImageDimensions, cleanupDetector } from '@/services/handDetector';
import { recognizeSign, SignType } from '@/services/signRecognizer';

interface SignDetectionState {
  isLoading: boolean;
  isDetecting: boolean;
  error: string | null;
  landmarks: { x: number, y: number, z: number }[][];
  videoDimensions: { width: number, height: number };
  predictions: { sign: SignType, confidence: number }[];
  currentSign: SignType;
  initAttempts: number;
}

export function useSignDetection() {
  const [state, setState] = useState<SignDetectionState>({
    isLoading: true,
    isDetecting: false,
    error: null,
    landmarks: [],
    videoDimensions: { width: 640, height: 480 },
    predictions: [],
    currentSign: 'none',
    initAttempts: 0
  });
  
  const [retryCount, setRetryCount] = useState(0);
  const initializationTimer = useRef<NodeJS.Timeout | null>(null);
  const isComponentMounted = useRef(true);

  const clearTimers = () => {
    if (initializationTimer.current) {
      clearTimeout(initializationTimer.current);
      initializationTimer.current = null;
    }
  };

  // Initialize the detector
  useEffect(() => {
    isComponentMounted.current = true;
    
    const initialize = async () => {
      try {
        if (!isComponentMounted.current) return;
        
        clearTimers();
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        console.log("Starting detector initialization...");
        
        // Add a delay to ensure TensorFlow is properly loaded
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const detector = await initHandDetector();
        
        if (!detector) {
          throw new Error("Detector initialization returned null");
        }
        
        if (isComponentMounted.current) {
          console.log("Detector initialized successfully!");
          setState(prev => ({ 
            ...prev, 
            isLoading: false, 
            isDetecting: true,
            initAttempts: 0,
            error: null
          }));
          toast.success('Sign detector initialized successfully!');
        }
      } catch (error) {
        if (!isComponentMounted.current) return;
        
        console.error('Error initializing detector:', error);
        
        // Auto-retry with exponential backoff if fewer than 5 attempts
        if (state.initAttempts < 5 && isComponentMounted.current) {
          const nextAttempt = state.initAttempts + 1;
          
          setState(prev => ({ 
            ...prev, 
            isLoading: true,
            initAttempts: nextAttempt,
            error: `Initialization attempt ${nextAttempt} failed. Retrying...`
          }));
          
          const delay = Math.min(Math.pow(2, nextAttempt) * 1000, 10000); // Exponential backoff: 2s, 4s, 8s, max 10s
          console.log(`Auto-retrying initialization in ${delay/1000}s (attempt ${nextAttempt})`);
          
          initializationTimer.current = setTimeout(() => {
            if (isComponentMounted.current) {
              initialize();
            }
          }, delay);
        } else {
          // If we've tried enough times, show the final error
          setState(prev => ({ 
            ...prev, 
            isLoading: false,
            error: 'Failed to initialize the sign detector. Please check your camera permissions and try again.'
          }));
          toast.error('Failed to initialize the sign detector');
        }
      }
    };

    initialize();

    return () => {
      isComponentMounted.current = false;
      clearTimers();
      cleanupDetector();
    };
  }, [retryCount]);

  // Process each frame from the webcam
  const processFrame = useCallback(async (input: HTMLVideoElement | ImageData) => {
    if (!state.isDetecting) return;
    
    try {
      // If input is an HTMLVideoElement
      if (input instanceof HTMLVideoElement) {
        if (input.videoWidth !== state.videoDimensions.width || input.videoHeight !== state.videoDimensions.height) {
          setState(prev => ({ 
            ...prev, 
            videoDimensions: { 
              width: input.videoWidth, 
              height: input.videoHeight 
            } 
          }));
          updateImageDimensions(input.videoWidth, input.videoHeight);
        }
        
        // Skip processing if video is not ready
        if (input.readyState < 2) {
          return;
        }
      }

      // Detect hands
      const hands = await detectHands(input);
      
      // Get landmarks in normalized format
      const formattedLandmarks = getFormattedLandmarks(hands);
      setState(prev => ({ ...prev, landmarks: formattedLandmarks }));

      // Recognize the sign if hands are detected
      if (formattedLandmarks.length > 0) {
        const signPredictions = recognizeSign(formattedLandmarks);
        setState(prev => ({ ...prev, predictions: signPredictions }));
        
        // Update current sign if confidence is high enough
        const topPrediction = signPredictions[0];
        if (topPrediction && topPrediction.confidence > 0.65) {
          setState(prev => ({ ...prev, currentSign: topPrediction.sign }));
        }
      } else {
        // No hands detected
        setState(prev => ({ 
          ...prev, 
          predictions: [{ sign: 'none', confidence: 1.0 }],
          currentSign: 'none'
        }));
      }
    } catch (error) {
      console.error('Error processing frame:', error);
      // Don't update state here to avoid re-renders that could impact performance
    }
  }, [state.isDetecting, state.videoDimensions]);

  // Reset detector
  const resetDetector = useCallback(() => {
    clearTimers();
    setState({
      isLoading: true,
      isDetecting: false,
      error: null,
      landmarks: [],
      videoDimensions: { width: 640, height: 480 },
      predictions: [],
      currentSign: 'none',
      initAttempts: 0
    });
    
    try {
      console.log("Reinitializing detector...");
      cleanupDetector();
      setRetryCount(prev => prev + 1);
    } catch (error) {
      console.error('Error resetting detector:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to reset the sign detector. Please reload the page.'
      }));
      toast.error('Failed to reset the detector');
    }
  }, []);

  return {
    ...state,
    processFrame,
    resetDetector
  };
}
