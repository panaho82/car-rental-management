import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper } from '@mui/material';

interface CarDamageMarkerProps {
  selectedArea?: string;
  selectedCoordinates?: { x: number; y: number };
  onChange: (area: string, coordinates: { x: number; y: number }) => void;
}

interface CarArea {
  id: string;
  name: string;
  coords: number[];
  shape: 'poly' | 'rect' | 'circle';
}

const carAreas: CarArea[] = [
  {
    id: 'front-bumper',
    name: 'Front Bumper',
    coords: [100, 50, 200, 70],
    shape: 'rect',
  },
  {
    id: 'hood',
    name: 'Hood',
    coords: [100, 71, 200, 120],
    shape: 'rect',
  },
  {
    id: 'windshield',
    name: 'Windshield',
    coords: [110, 121, 190, 150],
    shape: 'rect',
  },
  {
    id: 'roof',
    name: 'Roof',
    coords: [110, 151, 190, 200],
    shape: 'rect',
  },
  {
    id: 'trunk',
    name: 'Trunk',
    coords: [110, 201, 190, 250],
    shape: 'rect',
  },
  {
    id: 'rear-bumper',
    name: 'Rear Bumper',
    coords: [100, 251, 200, 270],
    shape: 'rect',
  },
  {
    id: 'left-front-door',
    name: 'Left Front Door',
    coords: [50, 120, 99, 180],
    shape: 'rect',
  },
  {
    id: 'left-rear-door',
    name: 'Left Rear Door',
    coords: [50, 181, 99, 240],
    shape: 'rect',
  },
  {
    id: 'right-front-door',
    name: 'Right Front Door',
    coords: [201, 120, 250, 180],
    shape: 'rect',
  },
  {
    id: 'right-rear-door',
    name: 'Right Rear Door',
    coords: [201, 181, 250, 240],
    shape: 'rect',
  },
  {
    id: 'left-front-wheel',
    name: 'Left Front Wheel',
    coords: [60, 90, 20],
    shape: 'circle',
  },
  {
    id: 'right-front-wheel',
    name: 'Right Front Wheel',
    coords: [240, 90, 20],
    shape: 'circle',
  },
  {
    id: 'left-rear-wheel',
    name: 'Left Rear Wheel',
    coords: [60, 230, 20],
    shape: 'circle',
  },
  {
    id: 'right-rear-wheel',
    name: 'Right Rear Wheel',
    coords: [240, 230, 20],
    shape: 'circle',
  },
];

export const CarDamageMarker: React.FC<CarDamageMarkerProps> = ({
  selectedArea,
  selectedCoordinates,
  onChange,
}) => {
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (containerRef.current && canvasRef.current) {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Set canvas size based on container
      const containerWidth = container.clientWidth;
      const newScale = containerWidth / 300; // 300 is our base width
      setScale(newScale);

      canvas.width = containerWidth;
      canvas.height = containerWidth * (320 / 300); // Maintain aspect ratio

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw car outline
      ctx.save();
      ctx.scale(newScale, newScale);
      drawCar(ctx);
      
      // Draw selected area if any
      if (selectedArea && selectedCoordinates) {
        drawMarker(ctx, selectedCoordinates.x / newScale, selectedCoordinates.y / newScale);
      }
      
      ctx.restore();
    }
  }, [selectedArea, selectedCoordinates]);

  const drawCar = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;

    // Draw each area
    carAreas.forEach(area => {
      ctx.beginPath();
      
      if (area.shape === 'rect') {
        const [x, y, width, height] = area.coords;
        ctx.rect(x, y, width - x, height - y);
      } else if (area.shape === 'circle') {
        const [x, y, radius] = area.coords;
        ctx.arc(x, y, radius, 0, Math.PI * 2);
      } else if (area.shape === 'poly') {
        ctx.moveTo(area.coords[0], area.coords[1]);
        for (let i = 2; i < area.coords.length; i += 2) {
          ctx.lineTo(area.coords[i], area.coords[i + 1]);
        }
        ctx.closePath();
      }

      if (area.id === hoveredArea || area.id === selectedArea) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
        ctx.fill();
      }

      ctx.stroke();
    });
  };

  const drawMarker = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.stroke();
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / scale;
    const y = (event.clientY - rect.top) / scale;

    // Find clicked area
    const clickedArea = carAreas.find(area => {
      if (area.shape === 'rect') {
        const [x1, y1, x2, y2] = area.coords;
        return x >= x1 && x <= x2 && y >= y1 && y <= y2;
      } else if (area.shape === 'circle') {
        const [cx, cy, radius] = area.coords;
        const distance = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
        return distance <= radius;
      }
      return false;
    });

    if (clickedArea) {
      onChange(clickedArea.name, { x: x * scale, y: y * scale });
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / scale;
    const y = (event.clientY - rect.top) / scale;

    // Find hovered area
    const area = carAreas.find(area => {
      if (area.shape === 'rect') {
        const [x1, y1, x2, y2] = area.coords;
        return x >= x1 && x <= x2 && y >= y1 && y <= y2;
      } else if (area.shape === 'circle') {
        const [cx, cy, radius] = area.coords;
        const distance = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
        return distance <= radius;
      }
      return false;
    });

    setHoveredArea(area?.id || null);
  };

  return (
    <Paper
      ref={containerRef}
      sx={{
        width: '100%',
        maxWidth: 600,
        aspectRatio: '300/320',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        component="canvas"
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        sx={{
          width: '100%',
          height: '100%',
          cursor: 'crosshair',
        }}
      />
    </Paper>
  );
};
