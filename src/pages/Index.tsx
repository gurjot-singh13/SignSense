
import React from 'react';
import SignDetector from '@/components/SignDetector';
import { Button } from '@/components/ui/button';
import { HandMetal, BookOpenText, CircleUser, Github } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="bg-accent/10 border-b">
        <div className="container mx-auto py-4 px-4 md:px-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <HandMetal className="h-8 w-8 text-accent" />
              <h1 className="text-2xl font-bold tracking-tight">SignSense</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="outline" size="sm" className="gap-1" asChild>
                <Link to="/learn-asl">
                  <BookOpenText className="h-4 w-4" />
                  <span className="hidden md:inline">Learn ASL</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="gap-1">
                <CircleUser className="h-4 w-4" />
                <span className="hidden md:inline">About</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-1" asChild>
                <a href="https://github.com/your-username/sign-sense" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                  <span className="hidden md:inline">GitHub</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 md:px-0">
        <div className="max-w-3xl mx-auto mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AI-Powered Sign Language Detection
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Show your signs to the camera and SignSense will recognize American Sign Language in real-time.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Button className="rounded-full">
              Get Started
            </Button>
            <Button variant="outline" className="rounded-full" asChild>
              <Link to="/tutorial">View Tutorial</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 text-center">
            {['Hello', 'Sorry', 'Thanks', 'ILoveYou', 'Yes', 'No', 'Help'].map((sign, i) => (
              <div key={sign} className="px-2 py-1 bg-secondary rounded-full text-sm font-medium">
                {sign}
              </div>
            ))}
          </div>
        </div>

        <SignDetector />
        
        <div className="mt-12 bg-accent/5 rounded-lg p-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">About This Project</h2>
          <p className="mb-4">
            SignSense uses TensorFlow.js, MediaPipe, and OpenCV to detect and recognize American Sign Language (ASL) gestures in real-time through your webcam.
          </p>
          <p className="mb-4">
            This demo can recognize 7 common ASL signs: hello, sorry, thanks, I love you, yes, no, and help. The detection model works best with good lighting and a clear background.
          </p>
          <p>
            For better detection accuracy, you can train a custom model with your own signs and gestures. The system is designed to be extendable for additional sign recognition capabilities.
          </p>
        </div>
      </main>

      <footer className="mt-auto bg-accent/10 py-6 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>SignSense &copy; 2025 • AI-Powered Sign Language Detection</p>
          <p className="mt-1">Built with TensorFlow.js, MediaPipe, and OpenCV</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
