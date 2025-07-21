'use client';

import { useEffect, useState, useRef } from 'react';
import { FiX, FiZoomIn, FiZoomOut, FiRotateCw, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt: string;
  allImages?: string[]; // Array of all image URLs
  currentIndex?: number; // Current image index
  onImageChange?: (index: number) => void; // Callback when image changes
}

export default function ImageModal({ 
  isOpen, 
  onClose, 
  imageUrl, 
  alt, 
  allImages = [], 
  currentIndex = 0,
  onImageChange 
}: ImageModalProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const hasMultipleImages = allImages.length > 1;
  const currentImageIndex = currentIndex;

  // Reset state when modal opens/closes or image changes
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, imageUrl]);

  // Get image dimensions when it loads
  const handleImageLoad = () => {
    if (imageRef.current) {
      const img = imageRef.current;
      setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
    }
  };

  // Calculate max scale to fit image in viewport
  const calculateMaxScale = () => {
    if (!containerRef.current || !imageRef.current) return 3;
    
    const container = containerRef.current.getBoundingClientRect();
    const img = imageRef.current.getBoundingClientRect();
    
    const maxScaleX = container.width / img.width;
    const maxScaleY = container.height / img.height;
    
    // Use the smaller scale to ensure image fits in both dimensions
    return Math.min(maxScaleX, maxScaleY, 3); // Cap at 3x zoom
  };

  // Constrain position to keep image within bounds
  const constrainPosition = (newPosition: { x: number; y: number }, currentScale: number) => {
    if (!containerRef.current || !imageRef.current) return newPosition;
    
    const container = containerRef.current.getBoundingClientRect();
    const img = imageRef.current.getBoundingClientRect();
    
    const scaledWidth = img.width * currentScale;
    const scaledHeight = img.height * currentScale;
    
    const maxX = Math.max(0, (scaledWidth - container.width) / 2);
    const maxY = Math.max(0, (scaledHeight - container.height) / 2);
    
    return {
      x: Math.max(-maxX, Math.min(maxX, newPosition.x)),
      y: Math.max(-maxY, Math.min(maxY, newPosition.y))
    };
  };

  // Navigate to next image
  const goToNext = () => {
    if (hasMultipleImages && onImageChange) {
      const nextIndex = (currentImageIndex + 1) % allImages.length;
      onImageChange(nextIndex);
    }
  };

  // Navigate to previous image
  const goToPrevious = () => {
    if (hasMultipleImages && onImageChange) {
      const prevIndex = currentImageIndex === 0 ? allImages.length - 1 : currentImageIndex - 1;
      onImageChange(prevIndex);
    }
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case '+':
        case '=':
          e.preventDefault();
          const maxScale = calculateMaxScale();
          setScale(prev => Math.min(prev * 1.2, maxScale));
          break;
        case '-':
          e.preventDefault();
          setScale(prev => Math.max(prev / 1.2, 0.5));
          break;
        case '0':
          e.preventDefault();
          setScale(1);
          setPosition({ x: 0, y: 0 });
          setRotation(0);
          break;
        case 'r':
          e.preventDefault();
          setRotation(prev => prev + 90);
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (hasMultipleImages) goToNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (hasMultipleImages) goToPrevious();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, hasMultipleImages, currentImageIndex, allImages.length, onImageChange]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      const newPosition = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      };
      setPosition(constrainPosition(newPosition, scale));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.5, Math.min(calculateMaxScale(), scale * delta));
    setScale(newScale);
    
    // Adjust position to keep image centered on mouse position
    if (newScale !== scale) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const newPosition = {
          x: mouseX - (mouseX - position.x) * (newScale / scale),
          y: mouseY - (mouseY - position.y) * (newScale / scale)
        };
        setPosition(constrainPosition(newPosition, newScale));
      }
    }
  };

  const resetImage = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    const maxScale = calculateMaxScale();
    setScale(prev => Math.min(prev * 1.2, maxScale));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.5));
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors p-2"
        aria-label="Close image"
      >
        <FiX className="w-6 h-6" />
      </button>

      {/* Navigation arrows */}
      {hasMultipleImages && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors p-2 bg-black bg-opacity-30 rounded-full"
            aria-label="Previous image"
          >
            <FiChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors p-2 bg-black bg-opacity-30 rounded-full"
            aria-label="Next image"
          >
            <FiChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Controls */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoomIn();
          }}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded transition-colors"
          aria-label="Zoom in"
        >
          <FiZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoomOut();
          }}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded transition-colors"
          aria-label="Zoom out"
        >
          <FiZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setRotation(prev => prev + 90);
          }}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded transition-colors"
          aria-label="Rotate"
        >
          <FiRotateCw className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            resetImage();
          }}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-2 rounded text-sm transition-colors"
          aria-label="Reset"
        >
          Reset
        </button>
      </div>

      {/* Image container */}
      <div 
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: isDragging ? 'grabbing' : scale > 1 ? 'grab' : 'default' }}
      >
        <img
          ref={imageRef}
          src={imageUrl}
          alt={alt}
          onLoad={handleImageLoad}
          className="max-w-full max-h-full object-contain transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
            transformOrigin: 'center',
          }}
          draggable={false}
        />
      </div>

      {/* Image counter */}
      {hasMultipleImages && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded">
          {currentImageIndex + 1} / {allImages.length}
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded">
        <div className="text-center">
          <div>
            Use mouse wheel to zoom • Drag to pan • R to rotate • 0 to reset • ESC to close
            {hasMultipleImages && ' • Arrow keys to navigate'}
          </div>
          <div className="text-xs text-gray-300 mt-1">
            Scale: {Math.round(scale * 100)}% • Rotation: {rotation}° • Max: {Math.round(calculateMaxScale() * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
} 