
import * as tf from '@tensorflow/tfjs';
// Importing mediapipe hand pose detection module
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';

let detector: handPoseDetection.HandDetector | null = null;
const modelType = handPoseDetection.SupportedModels.MediaPipeHands;

// Initialize the hand pose detector
export const initHandDetector = async () => {
  try {
    // Check if detector already exists
    if (detector) {
      console.log('Reusing existing detector instance');
      return detector;
    }

    console.log('Starting hand detector initialization...');
    
    // Make sure TensorFlow.js is ready
    await tf.ready();
    console.log('TensorFlow.js is ready');
    
    // Clear any existing backend cached tensors to prevent memory issues
    tf.engine().startScope();
    tf.disposeVariables();
    
    // Use WebGL backend which is better supported across browsers than WASM
    try {
      // Try to use WebGL first as it's more widely supported
      await tf.setBackend('webgl');
      console.log('Using WebGL backend:', tf.getBackend());
    } catch (backendError) {
      console.warn('Failed to set WebGL backend, trying default:', backendError);
      // If WebGL fails, let TensorFlow choose the best available backend
      // This is typically 'cpu' which will work everywhere but is slower
    }
    
    console.log('Active backend is:', tf.getBackend());
    
    // Add a small delay to ensure everything is properly loaded
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const detectorConfig = {
      runtime: 'mediapipe', 
      modelType: 'full',
      solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
      maxHands: 2,
    } as handPoseDetection.MediaPipeHandsMediaPipeModelConfig;

    // Create the detector with the specified configuration
    detector = await handPoseDetection.createDetector(
      modelType,
      detectorConfig
    );
    
    if (!detector) {
      throw new Error('Failed to create hand pose detector');
    }
    
    tf.engine().endScope();
    console.log('Hand pose detector initialized successfully');
    return detector;
  } catch (error) {
    console.error('Error initializing hand pose detector:', error);
    // Reset the detector variable on error to allow future retry attempts
    detector = null;
    throw error;
  }
};

// Function to detect hands in an image
export const detectHands = async (imageData: ImageData | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement): Promise<handPoseDetection.Hand[]> => {
  if (!detector) {
    try {
      detector = await initHandDetector();
    } catch (error) {
      console.error('Error re-initializing detector during detection:', error);
      return [];
    }
  }

  try {
    // Check if input is valid
    if (!imageData) {
      console.error('Invalid image data provided to detectHands');
      return [];
    }
    
    // For video elements, ensure they are properly loaded
    if (imageData instanceof HTMLVideoElement && 
        (imageData.readyState < 2 || !imageData.videoWidth || !imageData.videoHeight)) {
      console.log('Video not ready yet, skipping detection');
      return [];
    }
    
    // Handle different input types
    const hands = await detector.estimateHands(imageData);
    return hands;
  } catch (error) {
    console.error('Error detecting hands:', error);
    return [];
  }
};

// Function to get formatted landmarks
export const getFormattedLandmarks = (hands: handPoseDetection.Hand[]): { x: number, y: number, z: number }[][] => {
  return hands.map(hand => 
    hand.keypoints3D ? 
    hand.keypoints3D.map(point => ({
      x: point.x,
      y: point.y,
      z: point.z || 0
    })) : 
    hand.keypoints.map(point => ({
      x: point.x / imageData.width,
      y: point.y / imageData.height,
      z: 0
    }))
  );
};

// Variable to store image dimensions
let imageData = { width: 640, height: 480 };

// Function to update image dimensions
export const updateImageDimensions = (width: number, height: number) => {
  imageData = { width, height };
};

// Function to clean up and reset the detector
export const cleanupDetector = () => {
  detector = null;
  console.log('Detector cleaned up and reset');
};
