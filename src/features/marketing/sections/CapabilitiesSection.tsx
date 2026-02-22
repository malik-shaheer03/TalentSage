import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './CapabilitiesSection.module.css';

const capabilities = [
  {
    icon: '🎯',
    title: 'Intelligent Candidate Matching',
    description: 'AI algorithms analyze job requirements and candidate profiles to surface the perfect matches, reducing manual screening time by 75%.',
    color: '#2563eb'
  },
  {
    icon: '📄',
    title: 'Automated Resume Parsing',
    description: 'Extract structured data from resumes in seconds. Our AI understands context, skills, and experience across multiple formats.',
    color: '#7c3aed'
  },
  {
    icon: '⚡',
    title: 'AI-Driven Shortlisting & Scoring',
    description: 'Define custom rubrics and let AI evaluate candidates objectively. Get ranked shortlists based on your criteria.',
    color: '#0891b2'
  },
  {
    icon: '📅',
    title: 'Smart Interview Scheduling',
    description: 'Automated scheduling that respects time zones, availability, and interview panel coordination. No more back-and-forth emails.',
    color: '#059669'
  },
  {
    icon: '📊',
    title: 'Predictive Hiring Analytics',
    description: 'Data-driven insights into your hiring pipeline. Forecast time-to-hire, identify bottlenecks, and optimize your process.',
    color: '#dc2626'
  },
  {
    icon: '💬',
    title: 'Chat-based Candidate Engagement',
    description: '24/7 intelligent chatbot answers candidate questions, collects information, and keeps applicants engaged throughout the journey.',
    color: '#ea580c'
  }
];

export const CapabilitiesSection: React.FC = () => {
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
    hidden: { opacity: 0, y: 30 },
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
    <section className={styles.capabilities} ref={ref}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.sectionBadge}>Core Capabilities</div>
          <h2 className={styles.title}>
            Everything You Need to
            <br />
            <span className={styles.gradient}>Transform Recruitment</span>
          </h2>
          <p className={styles.subtitle}>
            Six powerful capabilities working together to accelerate your hiring process
          </p>
        </motion.div>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {capabilities.map((capability, index) => (
            <motion.div
              key={index}
              className={styles.card}
              variants={itemVariants}
              whileHover={{
                y: -8,
                transition: { duration: 0.2 }
              }}
            >
              <div
                className={styles.iconWrapper}
                style={{ backgroundColor: `${capability.color}15` }}
              >
                <span className={styles.icon}>{capability.icon}</span>
              </div>
              <h3 className={styles.cardTitle}>{capability.title}</h3>
              <p className={styles.cardDescription}>{capability.description}</p>
              <button className={styles.learnMore}>
                Learn more
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8h10m0 0l-3-3m3 3l-3 3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
