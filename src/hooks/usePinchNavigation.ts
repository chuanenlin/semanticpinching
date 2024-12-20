import { useCallback, useEffect, useState } from 'react';

interface UsePinchNavigationProps {
  onLevelChange: (direction: number) => void;
  isTransitioning?: boolean;
}

export const usePinchNavigation = ({ onLevelChange, isTransitioning }: UsePinchNavigationProps) => {
  const [startDistance, setStartDistance] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (isTransitioning || isMobile) return;
    
    switch (event.key) {
      case 'ArrowUp':
      case 'Up':
        event.preventDefault();
        onLevelChange(-1);
        break;
      case 'ArrowDown':
      case 'Down':
        event.preventDefault();
        onLevelChange(1);
        break;
    }
  }, [onLevelChange, isTransitioning, isMobile]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!isMobile || isTransitioning || e.touches.length !== 2) return;
    
    const distance = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    setStartDistance(distance);
  }, [isMobile, isTransitioning]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isMobile || isTransitioning || e.touches.length !== 2 || !startDistance) return;
    
    const currentDistance = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );

    const pinchThreshold = 50;
    const distanceDelta = currentDistance - startDistance;

    if (Math.abs(distanceDelta) > pinchThreshold) {
      onLevelChange(distanceDelta > 0 ? 1 : -1);
      setStartDistance(null);
    }
  }, [isMobile, isTransitioning, startDistance, onLevelChange]);

  const handleTouchEnd = useCallback(() => {
    setStartDistance(null);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    } else {
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      return () => {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isMobile, handleKeyDown, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { isMobile };
}; 