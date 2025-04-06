
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface Point {
  x: number;
  y: number;
  z?: number;
}

interface HandLandmarksProps {
  landmarks: Point[][];
  connections?: [number, number][];
  width: number;
  height: number;
  className?: string;
}

const DEFAULT_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], // thumb
  [0, 5], [5, 6], [6, 7], [7, 8], // index finger
  [0, 9], [9, 10], [10, 11], [11, 12], // middle finger
  [0, 13], [13, 14], [14, 15], [15, 16], // ring finger
  [0, 17], [17, 18], [18, 19], [19, 20], // pinky
  [5, 9], [9, 13], [13, 17], [0, 5], [5, 17] // palm
];

const HandLandmarks: React.FC<HandLandmarksProps> = ({
  landmarks,
  connections = DEFAULT_CONNECTIONS,
  width,
  height,
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Draw each hand
    landmarks.forEach(hand => {
      if (hand.length === 0) return;

      // Draw connections
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.8)';
      ctx.lineWidth = 3;

      connections.forEach(([start, end]) => {
        if (hand[start] && hand[end]) {
          ctx.beginPath();
          ctx.moveTo(hand[start].x * width, hand[start].y * height);
          ctx.lineTo(hand[end].x * width, hand[end].y * height);
          ctx.stroke();
        }
      });

      // Draw landmarks
      hand.forEach((point, index) => {
        // Different colors for different finger parts
        const colors = [
          'rgba(255, 255, 255, 0.8)', // wrist - white
          'rgba(255, 128, 0, 0.8)',   // thumb - orange
          'rgba(0, 255, 0, 0.8)',     // index - green
          'rgba(255, 0, 0, 0.8)',     // middle - red
          'rgba(0, 0, 255, 0.8)',     // ring - blue
          'rgba(255, 0, 255, 0.8)'    // pinky - purple
        ];
        
        // Determine which finger the point belongs to
        let colorIndex;
        if (index === 0) colorIndex = 0;
        else if (index >= 1 && index <= 4) colorIndex = 1;
        else if (index >= 5 && index <= 8) colorIndex = 2;
        else if (index >= 9 && index <= 12) colorIndex = 3;
        else if (index >= 13 && index <= 16) colorIndex = 4;
        else colorIndex = 5;

        ctx.fillStyle = colors[colorIndex];
        ctx.beginPath();
        ctx.arc(point.x * width, point.y * height, 6, 0, 2 * Math.PI);
        ctx.fill();
      });
    });
  }, [landmarks, connections, width, height]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("hand-landmarks", className)}
      width={width}
      height={height}
    />
  );
};

export default HandLandmarks;
