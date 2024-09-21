import React, { useEffect, useRef, useState } from 'react';
import { Canvas, IText } from 'fabric';
import { Button } from "@/components/ui/button";

interface SlideEditorProps {
  slideContent: string;
  onSave: (content: string) => void;
}

export function SlideEditor({ slideContent, onSave }: SlideEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const newCanvas = new Canvas(canvasRef.current, {
        width: 1600,
        height: 900
      });
      setCanvas(newCanvas);

      if (slideContent) {
        newCanvas.loadFromJSON(slideContent, () => {
          newCanvas.renderAll();
        });
      }

      return () => {
        newCanvas.dispose();
      };
    }
  }, [slideContent]);

  const handleAddText = () => {
    if (canvas) {
      const text = new IText('Edit this text', {
        left: 100,
        top: 100,
        fontSize: 20
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();
    }
  };

  const handleSave = () => {
    if (canvas) {
      const json = JSON.stringify(canvas.toJSON());
      onSave(json);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <canvas ref={canvasRef} />
      <div className="flex space-x-2">
        <Button onClick={handleAddText}>Add Text</Button>
        <Button onClick={handleSave}>Save Slide</Button>
      </div>
    </div>
  );
}