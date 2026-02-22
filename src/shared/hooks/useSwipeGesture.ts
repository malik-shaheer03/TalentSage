import { useEffect, useRef, useState } from 'react';

interface SwipeGestureOptions {
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  threshold?: number; // Minimum distance for swipe (in pixels)
  velocityThreshold?: number; // Minimum velocity for swipe
}

export function useSwipeGesture({
  onSwipeRight,
  onSwipeLeft,
  threshold = 50,
  velocityThreshold = 0.3,
}: SwipeGestureOptions) {
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchStartTime = useRef<number>(0);
  const [swipeProgress, setSwipeProgress] = useState<number>(0);

  useEffect(() => {
    // Only enable on mobile devices
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      touchStartTime.current = Date.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchCurrentX = e.touches[0].clientX;
      const deltaX = touchCurrentX - touchStartX.current;
      const touchCurrentY = e.touches[0].clientY;
      const deltaY = touchCurrentY - touchStartY.current;

      // Check if it's a horizontal swipe
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY) * 1.5;
      
      if (isHorizontalSwipe && deltaX > 0) {
        // Calculate progress (0 to 1)
        const progress = Math.min(deltaX / 150, 1);
        setSwipeProgress(progress);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndTime = Date.now();

      const deltaX = touchEndX - touchStartX.current;
      const deltaY = touchEndY - touchStartY.current;
      const deltaTime = touchEndTime - touchStartTime.current;

      // Calculate velocity (pixels per millisecond)
      const velocity = Math.abs(deltaX) / deltaTime;

      // Check if it's a horizontal swipe (not vertical scroll)
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY) * 1.5;

      if (isHorizontalSwipe && Math.abs(deltaX) > threshold && velocity > velocityThreshold) {
        if (deltaX > 0 && onSwipeRight) {
          // Swipe right
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          // Swipe left
          onSwipeLeft();
        }
      }

      // Reset progress
      setSwipeProgress(0);
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeRight, onSwipeLeft, threshold, velocityThreshold]);

  return { swipeProgress };
}
