import { useEffect, useState } from 'react';
import styles from './SwipeHint.module.css';

export function SwipeHint() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show on mobile
    if (window.innerWidth > 768) return;

    // Check if user has seen the hint before
    const hasSeenHint = localStorage.getItem('hasSeenSwipeHint');
    
    if (!hasSeenHint) {
      // Show hint after a short delay
      const timer = setTimeout(() => {
        setShow(true);
        
        // Hide after 4 seconds
        setTimeout(() => {
          setShow(false);
          localStorage.setItem('hasSeenSwipeHint', 'true');
        }, 4000);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!show) return null;

  return (
    <div className={styles.swipeHint}>
      <svg 
        className={styles.swipeIcon} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
      >
        <path d="M19 12H5M5 12L12 19M5 12L12 5" />
      </svg>
      <span>Swipe right to go back</span>
    </div>
  );
}
