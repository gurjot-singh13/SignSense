
import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { AlertCircle, Camera } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface WebcamViewProps {
  onFrame?: (imageData: HTMLVideoElement | ImageData) => void;
  mirrored?: boolean;
  width?: number;
  height?: number;
  className?: string;
  children?: React.ReactNode;
}

const WebcamView: React.FC<WebcamViewProps> = ({
  onFrame,
  mirrored = true,
  width = 640,
  height = 480,
  className,
  children
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const startCamera = async () => {
    try {
      if (!videoRef.current) return;
      
      // Clean up any existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      console.log('Starting camera...');
      setCameraError(null);
      
      // First check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser does not support camera access');
      }
      
      // Try with specific constraints first
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: width },
            height: { ideal: height },
            facingMode: 'user'
          },
          audio: false
        });
        
        streamRef.current = stream;
      } catch (specificError) {
        console.warn('Failed with specific constraints, trying generic:', specificError);
        
        // Fallback to more generic constraints
        const genericStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
        
        streamRef.current = genericStream;
      }
      
      if (!streamRef.current) {
        throw new Error('Failed to get camera stream');
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
        
        // Wait for video metadata to load
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().then(() => {
              setIsCameraReady(true);
              console.log('Camera started successfully');
            }).catch(err => {
              console.error('Error playing video:', err);
              setCameraError('Could not play video stream. Please refresh the page.');
              toast.error('Error playing video stream');
            });
          }
        };
      }
    } catch (error: any) {
      console.error('Error accessing webcam:', error);
      const errorMessage = error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError'
        ? 'Camera access denied. Please check permissions in your browser settings.'
        : 'Could not access webcam. Please check permissions and refresh.';
      
      setCameraError(errorMessage);
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    // Small delay before starting camera to ensure component is fully mounted
    const timeoutId = setTimeout(() => {
      if (mounted) {
        startCamera();
      }
    }, 1000);

    return () => {
      // Cleanup function
      mounted = false;
      clearTimeout(timeoutId);
      setIsCameraReady(false);
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
        });
        streamRef.current = null;
      }
      
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = undefined;
      }
    };
  }, [width, height, retryCount]);

  const processFrame = () => {
    if (videoRef.current && videoRef.current.readyState === 4) {
      // Option 1: Pass the video element directly to the detector
      if (onFrame) {
        onFrame(videoRef.current);
      }

      // Option 2: If needed, we can still draw to canvas and get image data
      if (canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (ctx) {
          // Set canvas dimensions to match video
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          // Mirror the image if needed
          if (mirrored) {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
          }

          // Draw the current frame
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Reset transform if we mirrored
          if (mirrored) {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
          }
        }
      }
    }

    // Schedule the next frame
    requestRef.current = requestAnimationFrame(processFrame);
  };

  // Start processing frames when the video is ready
  useEffect(() => {
    if (isCameraReady && videoRef.current) {
      console.log('Video is playing, starting frame processing');
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      requestRef.current = requestAnimationFrame(processFrame);
      
      // Set an event listener for play events
      const videoElement = videoRef.current;
      videoElement.addEventListener('play', processFrame);
      
      return () => {
        videoElement.removeEventListener('play', processFrame);
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    }
  }, [isCameraReady]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    toast.info('Retrying camera access...');
  };

  return (
    <div className={cn("relative rounded-lg overflow-hidden", className)}>
      <video 
        ref={videoRef} 
        className="w-full h-full object-cover"
        autoPlay 
        playsInline 
        muted 
        style={{ transform: mirrored ? 'scaleX(-1)' : 'none' }}
      />
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none" 
      />
      {!isCameraReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
          <div className="text-center p-4 max-w-md">
            {cameraError ? (
              <>
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{cameraError}</AlertDescription>
                </Alert>
                <p className="text-sm text-muted-foreground mb-4">
                  To use this feature, you need to allow camera access in your browser settings.
                </p>
                <Button 
                  onClick={handleRetry} 
                  className="mb-2"
                >
                  Retry Camera Access
                </Button>
                <br />
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()} 
                >
                  Refresh Page
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <Camera className="h-10 w-10 mb-4 text-muted-foreground animate-pulse" />
                <p className="text-lg font-medium">Initializing camera...</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Please allow camera access when prompted
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default WebcamView;
