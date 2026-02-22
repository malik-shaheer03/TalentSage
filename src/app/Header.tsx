import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Header.module.css';

type View = 'marketing' | 'jobs' | 'jobDetail' | 'candidateProfile' | 'screening';

interface HeaderProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isMarketing = currentView === 'marketing';
  const isWorkspace = ['jobs', 'jobDetail', 'candidateProfile', 'screening'].includes(currentView);

  return (
    <motion.header
      className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={styles.container}>
        {/* Logo */}
        <button
          className={styles.logo}
          onClick={() => onNavigate('marketing')}
          aria-label="Go to home"
        >
          <div className={styles.logoIcon}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 2L4 8v8c0 7.732 5.373 14.98 12 16.773C22.627 30.98 28 23.732 28 16V8L16 2z"
                fill="url(#gradient)"
              />
              <path
                d="M12 16l3 3 6-6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="gradient" x1="4" y1="2" x2="28" y2="32">
                  <stop stopColor="#2563eb" />
                  <stop offset="1" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className={styles.logoText}>TalentSage</span>
        </button>

        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          <button
            className={`${styles.navLink} ${isMarketing ? styles.active : ''}`}
            onClick={() => onNavigate('marketing')}
          >
            Home
          </button>
          <button
            className={`${styles.navLink} ${isWorkspace ? styles.active : ''}`}
            onClick={() => onNavigate('jobs')}
          >
            Workspace
          </button>
        </nav>

        {/* CTA Buttons */}
        <div className={styles.actions}>
          {isMarketing ? (
            <>
              <button className={styles.secondaryBtn}>Sign In</button>
              <button
                className={styles.primaryBtn}
                onClick={() => onNavigate('jobs')}
              >
                Try Free
              </button>
            </>
          ) : null}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={styles.mobileMenuBtn}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            {mobileMenuOpen ? (
              <>
                <path
                  d="M6 18L18 6M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </>
            ) : (
              <>
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          className={styles.mobileMenu}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            className={`${styles.mobileNavLink} ${isMarketing ? styles.active : ''}`}
            onClick={() => {
              onNavigate('marketing');
              setMobileMenuOpen(false);
            }}
          >
            Home
          </button>
          <button
            className={`${styles.mobileNavLink} ${isWorkspace ? styles.active : ''}`}
            onClick={() => {
              onNavigate('jobs');
              setMobileMenuOpen(false);
            }}
          >
            Workspace
          </button>
          <div className={styles.mobileDivider} />
          {isMarketing && (
            <>
              <button className={styles.mobileNavLink}>Sign In</button>
              <button
                className={styles.mobilePrimaryBtn}
                onClick={() => {
                  onNavigate('jobs');
                  setMobileMenuOpen(false);
                }}
              >
                Try Free
              </button>
            </>
          )}
        </motion.div>
      )}
    </motion.header>
  );
};
