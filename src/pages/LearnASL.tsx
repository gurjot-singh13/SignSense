
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, HandMetal, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

const LearnASL = () => {
  // List of ASL signs with descriptions
  const signs = [
    {
      id: 1,
      name: 'Hello',
      description: 'Open your dominant hand, extend and spread your fingers, then wave your palm facing outward.',
      difficulty: 'Easy',
      emoji: '👋'
    },
    {
      id: 2,
      name: 'Sorry',
      description: 'Make a fist with your dominant hand, then rub it in a circular motion over your heart.',
      difficulty: 'Easy',
      emoji: '🤝'
    },
    {
      id: 3,
      name: 'Thanks',
      description: 'Touch your chin or lips with the fingertips of your dominant hand, then extend your hand outward.',
      difficulty: 'Easy',
      emoji: '🙏'
    },
    {
      id: 4,
      name: 'I Love You',
      description: 'Extend your thumb, index finger, and pinky finger while keeping your ring and middle fingers folded down.',
      difficulty: 'Easy',
      emoji: '❤️'
    },
    {
      id: 5,
      name: 'Yes',
      description: 'Make a fist with your hand, then bob it up and down like nodding your head.',
      difficulty: 'Easy',
      emoji: '✅'
    },
    {
      id: 6,
      name: 'No',
      description: 'Extend your index and middle fingers together, then quickly tap them against your thumb once or twice.',
      difficulty: 'Easy',
      emoji: '❌'
    },
    {
      id: 7,
      name: 'Help',
      description: 'Make a thumbs-up with one hand, then place it on the palm of your other open hand and move both hands upward.',
      difficulty: 'Medium',
      emoji: '🆘'
    }
  ];

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
                <Link to="/tutorial">
                  <Search className="h-4 w-4" />
                  <span className="hidden md:inline">Tutorial</span>
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
        <div className="max-w-4xl mx-auto mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Learn American Sign Language
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Explore common ASL signs that SignSense can detect. Practice these signs to improve your sign language skills.
          </p>
          
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search for signs..." 
                className="pl-9 bg-background" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {signs.map((sign) => (
              <Card key={sign.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{sign.emoji}</span>
                    {sign.name}
                  </CardTitle>
                  <CardDescription>Difficulty: {sign.difficulty}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{sign.description}</p>
                </CardContent>
                <CardFooter className="bg-muted/30 border-t pt-4">
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/">Practice</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 bg-accent/5 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Resources for Learning ASL</h2>
            <p className="mb-4">
              American Sign Language (ASL) is a rich, complex visual language with its own grammar and syntax. 
              SignSense can recognize basic signs, but there are many more to learn!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Button variant="outline" className="h-auto py-4 justify-start">
                <div className="text-left">
                  <h3 className="font-semibold">ASL Dictionary</h3>
                  <p className="text-sm text-muted-foreground">Comprehensive visual dictionary of ASL signs</p>
                </div>
              </Button>
              <Button variant="outline" className="h-auto py-4 justify-start">
                <div className="text-left">
                  <h3 className="font-semibold">Video Tutorials</h3>
                  <p className="text-sm text-muted-foreground">Learn from expert ASL instructors</p>
                </div>
              </Button>
            </div>
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

export default LearnASL;
