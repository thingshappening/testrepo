import React, { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Eraser, RotateCcw } from 'lucide-react';
import type { Whiteboard } from '../services/api';

interface WhiteboardCanvasProps {
  username: string;
  onExit: () => void;
  whiteboard: Whiteboard;
}

interface DrawingSettings {
  color: string;
  lineWidth: number;
  tool: 'pencil' | 'eraser';
}

const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({
  username,
  onExit,
  whiteboard
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [settings, setSettings] = useState<DrawingSettings>({
    color: '#000000',
    lineWidth: 2,
    tool: 'pencil'
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size to fill container while maintaining aspect ratio
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientWidth * 0.6; // 3:5 aspect ratio
    }

    // Set initial canvas background to white
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);

    // Get canvas position relative to viewport
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);

    // Set drawing settings
    ctx.strokeStyle = settings.tool === 'eraser' ? '#ffffff' : settings.color;
    ctx.lineWidth = settings.lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get canvas position relative to viewport
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="p-4 bg-white shadow">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Whiteboard - {username}</h1>
            <span className="text-sm text-gray-500">
              ID: {whiteboard.id}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Connected Users: {whiteboard.connected_users.join(', ')}
            </div>
            <Button variant="outline" onClick={onExit}>
              Exit
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Drawing Canvas</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={settings.tool === 'pencil' ? 'default' : 'outline'}
                    onClick={() => setSettings({ ...settings, tool: 'pencil' })}
                    size="sm"
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Pencil
                  </Button>
                  <Button
                    variant={settings.tool === 'eraser' ? 'default' : 'outline'}
                    onClick={() => setSettings({ ...settings, tool: 'eraser' })}
                    size="sm"
                  >
                    <Eraser className="h-4 w-4 mr-1" />
                    Eraser
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearCanvas}
                    size="sm"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                  <input
                    type="color"
                    value={settings.color}
                    onChange={(e) => setSettings({ ...settings, color: e.target.value })}
                    className="h-8 w-8 rounded cursor-pointer"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative border rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseOut={stopDrawing}
                  className="w-full touch-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WhiteboardCanvas;
