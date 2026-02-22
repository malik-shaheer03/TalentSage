import React from 'react';
import { motion } from 'framer-motion';
import styles from './HeroSection.module.css';

export const HeroSection: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] // Custom easing for smooth motion
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className={styles.hero}>
      <motion.div
        className={styles.heroContent}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className={styles.badge} variants={itemVariants}>
          <span className={styles.badgeDot}></span>
          AI-Native Recruitment Operating System
        </motion.div>

        <motion.h1 className={styles.headline} variants={itemVariants}>
          Hire Smarter,
          <br />
          <span className={styles.gradient}>Move Faster</span>
        </motion.h1>

        <motion.p className={styles.subheadline} variants={itemVariants}>
          TalentSage transforms recruitment with AI-driven intelligence,
          <br />
          automating workflows and delivering data-backed hiring decisions.
        </motion.p>

        <motion.div className={styles.ctaGroup} variants={itemVariants}>
          <button className={styles.primaryCta}>
            Start Free Trial
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 10h12m0 0l-4-4m4 4l-4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button className={styles.secondaryCta}>
            Watch Demo
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M6.5 5.5l7 4.5-7 4.5v-9z"
                fill="currentColor"
              />
            </svg>
          </button>
        </motion.div>

        <motion.div className={styles.socialProof} variants={itemVariants}>
          <div className={styles.avatarGroup}>
            <div className={styles.avatar} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}></div>
            <div className={styles.avatar} style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}></div>
            <div className={styles.avatar} style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}></div>
            <div className={styles.avatar} style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}></div>
          </div>
          <div className={styles.socialProofText}>
            <strong>2,400+ recruiters</strong> trust TalentSage
          </div>
        </motion.div>
      </motion.div>

      {/* Floating visual elements */}
      <motion.div
        className={styles.floatingCard}
        style={{ top: '15%', right: '10%' }}
        variants={floatingVariants}
        animate="animate"
      >
        <div className={styles.cardIcon}>✓</div>
        <div className={styles.cardText}>
          <div className={styles.cardLabel}>Automated</div>
          <div className={styles.cardValue}>Resume Parsing</div>
        </div>
      </motion.div>

      <motion.div
        className={styles.floatingCard}
        style={{ top: '45%', right: '5%' }}
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 0.5 }}
      >
        <div className={styles.cardIcon}>🎯</div>
        <div className={styles.cardText}>
          <div className={styles.cardLabel}>AI-Driven</div>
          <div className={styles.cardValue}>Smart Matching</div>
        </div>
      </motion.div>

      <motion.div
        className={styles.floatingCard}
        style={{ bottom: '20%', left: '8%' }}
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 1 }}
      >
        <div className={styles.cardIcon}>⚡</div>
        <div className={styles.cardText}>
          <div className={styles.cardLabel}>60% Faster</div>
          <div className={styles.cardValue}>Time-to-Hire</div>
        </div>
      </motion.div>

      {/* Background gradient orbs */}
      <div className={styles.orb} style={{ top: '10%', left: '5%' }}></div>
      <div className={styles.orb} style={{ bottom: '10%', right: '10%' }}></div>
    </section>
  );
};
