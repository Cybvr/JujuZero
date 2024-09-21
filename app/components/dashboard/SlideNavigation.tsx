import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SlideNavigationProps {
  currentSlide: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function SlideNavigation({ currentSlide, totalSlides, onPrevious, onNext }: SlideNavigationProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <Button onClick={onPrevious} disabled={currentSlide === 0}>
        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
      </Button>
      <span className="text-sm">
        Slide {currentSlide + 1} of {totalSlides}
      </span>
      <Button onClick={onNext} disabled={currentSlide === totalSlides - 1}>
        Next <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}