import React, { useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useTransform } from 'framer-motion';
import styles from './RecruitmentFlowTimeline.module.css';

const timelineSteps = [
  {
    step: 1,
    title: 'Job Posted',
    description: 'Create job posting with AI-assisted description',
    icon: '📝',
    duration: '5 min',
    automated: false
  },
  {
    step: 2,
    title: 'Applications Received',
    description: 'Automated resume parsing and data extraction',
    icon: '📩',
    duration: 'Instant',
    automated: true
  },
  {
    step: 3,
    title: 'AI Screening',
    description: 'Intelligent matching and automated scoring',
    icon: '🎯',
    duration: '30 sec',
    automated: true
  },
  {
    step: 4,
    title: 'Shortlist Generated',
    description: 'Top candidates ranked by custom rubric',
    icon: '⭐',
    duration: 'Instant',
    automated: true
  },
  {
    step: 5,
    title: 'Interview Scheduled',
    description: 'Smart scheduling with automated coordination',
    icon: '📅',
    duration: '2 min',
    automated: true
  },
  {
    step: 6,
    title: 'Decision Made',
    description: 'Data-backed hiring recommendation',
    icon: '✓',
    duration: '1 day',
    automated: false
  }
];

export const RecruitmentFlowTimeline: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-150px' });
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const progressValue = useMotionValue(0);
  const progressWidth = useTransform(progressValue, [0, 1], ['0%', '100%']);

  React.useEffect(() => {
    if (isInView) {
      const interval = setInterval(() => {
        const current = progressValue.get();
        const next = current + 0.02;
        progressValue.set(next > 1 ? 0 : next);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isInView, progressValue]);

  return (
    <section className={styles.timeline} ref={ref}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.sectionBadge}>Signature Interaction</div>
          <h2 className={styles.title}>
            Watch Your Hiring Process
            <br />
            <span className={styles.gradient}>Transform in Real-Time</span>
          </h2>
          <p className={styles.subtitle}>
            From application to hire, see how TalentSage automates every step
          </p>
        </motion.div>

        <div className={styles.timelineWrapper}>
          {/* Progress line */}
          <div className={styles.progressLine}>
            <motion.div
              className={styles.progressFill}
              style={{ width: progressWidth }}
            />
          </div>

          {/* Timeline steps */}
          <div className={styles.steps}>
            {timelineSteps.map((item, index) => {
              const delay = index * 0.15;
              const isActive = activeStep === index;

              return (
                <motion.div
                  key={item.step}
                  className={`${styles.stepCard} ${isActive ? styles.active : ''}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay }}
                  onMouseEnter={() => setActiveStep(index)}
                  onMouseLeave={() => setActiveStep(null)}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                >
                  {/* Step number indicator */}
                  <motion.div
                    className={styles.stepIndicator}
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: delay + 0.2 }}
                  >
                    <span className={styles.stepNumber}>{item.step}</span>
                    {item.automated && (
                      <motion.div
                        className={styles.automatedBadge}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.3, delay: delay + 0.4 }}
                      >
                        AI
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Icon */}
                  <motion.div
                    className={styles.stepIcon}
                    animate={{
                      rotate: isActive ? 360 : 0,
                      scale: isActive ? 1.2 : 1
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {item.icon}
                  </motion.div>

                  {/* Content */}
                  <h3 className={styles.stepTitle}>{item.title}</h3>
                  <p className={styles.stepDescription}>{item.description}</p>

                  {/* Duration badge */}
                  <div className={styles.durationBadge}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M7 3.5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    {item.duration}
                  </div>

                  {/* Connector line (hidden on last item) */}
                  {index < timelineSteps.length - 1 && (
                    <div className={styles.connector}>
                      <motion.div
                        className={styles.connectorLine}
                        initial={{ scaleX: 0 }}
                        animate={isInView ? { scaleX: 1 } : {}}
                        transition={{ duration: 0.8, delay: delay + 0.3 }}
                      />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          className={styles.cta}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <p className={styles.ctaText}>
            <strong>60% faster time-to-hire</strong> — See the difference in your first week
          </p>
          <button className={styles.ctaButton}>
            Try TalentSage Free
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
        </motion.div>
      </div>
    </section>
  );
};
