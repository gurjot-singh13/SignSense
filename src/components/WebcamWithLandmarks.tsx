
import React from 'react';
import { Camera, AlertCircle } from 'lucide-react';
import WebcamView from './WebcamView';
import HandLandmarks from './HandLandmarks';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Hand } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface WebcamWithLandmarksProps {
  isLoading: boolean;
  isDetecting: boolean;
  error: string | null;
  landmarks: { x: number, y: number, z: number }[][];
  videoDimensions: { width: number, height: number };
  currentSign: string;
  predictions: { sign: string, confidence: number }[];
  initAttempts: number;
  onFrame: (input: HTMLVideoElement | ImageData) => void;
  onReset: () => void;
}

const WebcamWithLandmarks: React.FC<WebcamWithLandmarksProps> = ({
  isLoading,
  isDetecting,
  error,
  landmarks,
  videoDimensions,
  currentSign,
  predictions,
  initAttempts,
  onFrame,
  onReset
}) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Sign Language Detector</span>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onReset}
            disabled={isLoading && initAttempts > 0 && initAttempts < 5}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading && initAttempts > 0 ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative min-h-72">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
            <div className="text-center p-4">
              <Hand className="h-12 w-12 mx-auto mb-4 text-accent animate-pulse" />
              <p className="text-lg font-medium">Initializing detector...</p>
              {initAttempts > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Attempt {initAttempts} of 5...
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-2 max-w-md mx-auto">
                This may take a moment. The detector needs to download the hand model.
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
            <div className="text-center max-w-md p-4">
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
              <p className="text-sm text-muted-foreground mb-4">
                This could be due to camera permissions, browser compatibility, or network issues.
                Try refreshing the page or checking your camera permissions.
              </p>
              <Button onClick={onReset}>Retry</Button>
            </div>
          </div>
        ) : (
          <div className="aspect-video relative overflow-hidden rounded-lg">
            <WebcamView 
              onFrame={onFrame}
              mirrored={true}
              className="bg-muted"
            >
              <HandLandmarks 
                landmarks={landmarks} 
                width={videoDimensions.width} 
                height={videoDimensions.height} 
              />
              {landmarks.length === 0 && isDetecting && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/50 px-4 py-2 rounded-lg text-white">
                    <p className="flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      <span>Show your hands to start detecting signs</span>
                    </p>
                  </div>
                </div>
              )}
            </WebcamView>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="text-center w-full">
          {currentSign !== 'none' && (
            <p className="text-muted-foreground text-sm">
              Sign detected - with {Math.round((predictions[0]?.confidence || 0) * 100)}% confidence
            </p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default WebcamWithLandmarks;
