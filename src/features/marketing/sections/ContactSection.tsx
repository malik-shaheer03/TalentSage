import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './ContactSection.module.css';

export const ContactSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <section className={styles.contact} ref={ref}>
      <div className={styles.container}>
        <motion.div
          className={styles.content}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Header */}
          <motion.div className={styles.header} variants={itemVariants}>
            <h2 className={styles.title}>
              Ready to Transform
              <br />
              <span className={styles.gradient}>Your Hiring Process?</span>
            </h2>
            <p className={styles.subtitle}>
              Join thousands of recruiters who've accelerated their hiring with TalentSage
            </p>
            <div className={styles.ctaGroup}>
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
                Schedule Demo
              </button>
            </div>
          </motion.div>

          {/* Contact Info Grid */}
          <motion.div className={styles.grid} variants={containerVariants}>
            {/* Phone */}
            <motion.div className={styles.card} variants={itemVariants}>
              <div className={styles.iconWrapper}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className={styles.cardTitle}>Phone</h3>
              <a href="tel:+12817860706" className={styles.cardLink}>
                +(1) 281-786-0706
              </a>
            </motion.div>

            {/* Email */}
            <motion.div className={styles.card} variants={itemVariants}>
              <div className={styles.iconWrapper}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className={styles.cardTitle}>Email</h3>
              <a href="mailto:info@visiontact.com" className={styles.cardLink}>
                info@visiontact.com
              </a>
            </motion.div>

            {/* Houston Office */}
            <motion.div className={styles.card} variants={itemVariants}>
              <div className={styles.iconWrapper}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className={styles.cardTitle}>Houston Office</h3>
              <p className={styles.cardText}>
                8990 Kirby Dr, Ste 220<br />
                Houston, TX 77054<br />
                United States of America
              </p>
            </motion.div>

            {/* Dubai Office */}
            <motion.div className={styles.card} variants={itemVariants}>
              <div className={styles.iconWrapper}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className={styles.cardTitle}>Dubai Office</h3>
              <p className={styles.cardText}>
                Building A1, Dubai Digital Park<br />
                Dubai Silicon Oasis<br />
                Dubai, United Arab Emirates
              </p>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.div className={styles.footer} variants={itemVariants}>
            <div className={styles.footerLogo}>
              <div className={styles.logoIcon}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
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
            </div>
            <p className={styles.footerText}>
              AI-Native Recruitment Operating System
            </p>
            <div className={styles.footerLinks}>
              <a href="#" className={styles.footerLink}>Privacy Policy</a>
              <span className={styles.separator}>•</span>
              <a href="#" className={styles.footerLink}>Terms of Service</a>
              <span className={styles.separator}>•</span>
              <a href="#" className={styles.footerLink}>Security</a>
            </div>
            <p className={styles.copyright}>
              © 2026 Vision Tact LLC. All rights reserved.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
