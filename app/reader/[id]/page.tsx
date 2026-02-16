"use client";

import { useState } from "react";
import { ReaderTextPane } from "@/components/reader/ReaderTextPane";
import { ReaderVisualPane } from "@/components/reader/ReaderVisualPane";

// Mock Data for Demo
const DEMO_TEXT = [
  "The sky above the port was the color of television, tuned to a dead channel. 'It's not like I'm using,' Case heard someone say, as he shouldered his way through the crowd around the door of the Chat. 'It's like my body's developed this massive drug deficiency.' It was a Sprawl voice and a Sprawl joke. The Chatsubo was a bar for professional expatriates; you could drink there for a week and never hear two words in Japanese.",
  "Ratz was tending bar, his prosthetic arm jerking monotonously as he filled a tray of glasses with draft Kirin. He saw Case and smiled, his teeth a webwork of East European steel and brown decay. Case found a place at the bar, between the unlikely tan on one of the uglier whores the founding father had managed to sponsor while the project was still an embryo, and a crisp, bureaucratic young type in a gray suit.",
  "Case sat, staring into his drink. The alcohol was a cold, hard knot in his stomach. He'd been in Chiba for a month, and he still hadn't found the nerve to do what he'd come to do. He looked at his hands. They were shaking. The nerve damage was bad, but the tremors were worse when he wasn't using. He needed a fix, or he needed a job. In this city, they were often the same thing."
];

const DEMO_IMAGES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?q=80&w=2550&auto=format&fit=crop"
];

export default function ReaderPage() {
  const [pages] = useState<string[]>(DEMO_TEXT);
  const [currentPage, setCurrentPage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSimulateGeneration = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setProgress(0);
    setCurrentImage(null);

    await wait(800);
    setProgress(20);

    await wait(1200);
    setProgress(50);

    await wait(1500);
    setProgress(80);
    
    await wait(1000);
    setProgress(100);
    setCurrentImage(DEMO_IMAGES[currentPage % DEMO_IMAGES.length]);
    setIsProcessing(false);
  };

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
        setCurrentPage(c => c + 1);
        setCurrentImage(null);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
        setCurrentPage(c => c - 1);
        setCurrentImage(null);
    }
  };

  return (
    <div className="h-screen w-full bg-background text-foreground flex overflow-hidden font-sans selection:bg-primary/20">
      
      {/* Background Decor */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none z-0" />
      
      <ReaderTextPane 
        pages={pages}
        currentPage={currentPage}
        isProcessing={isProcessing}
        currentImage={currentImage}
        onPrev={handlePrev}
        onNext={handleNext}
        onSimulate={handleSimulateGeneration}
      />

      <ReaderVisualPane 
        currentImage={currentImage}
        isProcessing={isProcessing}
        progress={progress}
        currentPageText={pages[currentPage]}
      />
      
    </div>
  );
}
