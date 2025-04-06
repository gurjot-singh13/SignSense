
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlayCircle, List, HandMetal, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';

const Tutorial = () => {
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
                  <List className="h-4 w-4" />
                  <span className="hidden md:inline">Learn ASL</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="gap-1" asChild>
                <Link to="/">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden md:inline">Back to Home</span>
                </Link>
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
        <div className="max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            How to Use SignSense
          </h1>
          
          <div className="space-y-8 mt-8">
            <div className="bg-accent/5 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
                <span className="inline-flex items-center justify-center rounded-full bg-accent/20 w-8 h-8 text-accent">1</span>
                Getting Started
              </h2>
              <p className="mb-4">
                Position yourself in front of your camera with good lighting. Make sure your hands are clearly visible in the frame.
              </p>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                <PlayCircle className="h-16 w-16 text-accent/50" />
              </div>
              <p className="text-sm text-muted-foreground">
                The detection model works best with a plain background and good lighting conditions.
              </p>
            </div>

            <div className="bg-accent/5 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
                <span className="inline-flex items-center justify-center rounded-full bg-accent/20 w-8 h-8 text-accent">2</span>
                Making Signs
              </h2>
              <p className="mb-4">
                Form any of the following ASL signs with your hand: Hello, Sorry, Thanks, I Love You, Yes, No, or Help.
                Hold the sign steady for a moment to allow the system to recognize it.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {['Hello', 'Sorry', 'Thanks', 'ILoveYou', 'Yes', 'No', 'Help'].map((sign) => (
                  <div key={sign} className="aspect-square bg-muted rounded-lg flex flex-col items-center justify-center p-4">
                    <div className="text-4xl mb-2">👋</div>
                    <p className="font-medium">{sign}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-accent/5 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
                <span className="inline-flex items-center justify-center rounded-full bg-accent/20 w-8 h-8 text-accent">3</span>
                Viewing Results
              </h2>
              <p className="mb-4">
                The system will display the detected sign and confidence level in real-time. 
                The sidebar shows all possible signs with their detection probabilities.
              </p>
              <div className="bg-muted rounded-lg p-4 mb-4">
                <p className="text-center text-lg font-bold">Detection will appear here</p>
                <div className="grid grid-cols-1 gap-2 mt-4">
                  {['Hello', 'Sorry', 'Thanks'].map((sign) => (
                    <div key={sign} className="flex justify-between items-center bg-background/50 p-2 rounded">
                      <span>{sign}</span>
                      <span className="text-sm">{Math.floor(Math.random() * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button asChild size="lg">
              <Link to="/">Try It Now</Link>
            </Button>
          </div>
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

export default Tutorial;
