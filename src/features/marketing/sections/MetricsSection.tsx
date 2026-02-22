import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import styles from './MetricsSection.module.css';

interface Metric {
  value: number;
  suffix: string;
  label: string;
  icon: string;
  color: string;
}

const metrics: Metric[] = [
  {
    value: 60,
    suffix: '%',
    label: 'Reduction in time-to-hire',
    icon: '⚡',
    color: '#2563eb'
  },
  {
    value: 75,
    suffix: '%',
    label: 'Faster screening and shortlisting',
    icon: '🎯',
    color: '#7c3aed'
  },
  {
    value: 40,
    suffix: '%',
    label: 'Improvement in candidate engagement',
    icon: '💬',
    color: '#0891b2'
  },
  {
    value: 30,
    suffix: '%',
    label: 'Higher recruiter productivity',
    icon: '📈',
    color: '#059669'
  },
  {
    value: 50,
    suffix: '%',
    label: 'Cost savings on HR tasks',
    icon: '💰',
    color: '#dc2626'
  },
  {
    value: 24,
    suffix: '/7',
    label: 'Intelligent chatbot support',
    icon: '🤖',
    color: '#ea580c'
  }
];

const AnimatedCounter: React.FC<{ value: number; suffix: string; isInView: boolean }> = ({
  value,
  suffix,
  isInView
}) => {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2000 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return unsubscribe;
  }, [springValue]);

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  );
};

export const MetricsSection: React.FC = () => {
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
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <section className={styles.metrics} ref={ref}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.sectionBadge}>Proven Results</div>
          <h2 className={styles.title}>
            Real Impact on Your
            <br />
            <span className={styles.gradient}>Hiring Performance</span>
          </h2>
          <p className={styles.subtitle}>
            Join thousands of recruiters who've transformed their hiring process with TalentSage
          </p>
        </motion.div>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              className={styles.card}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              <motion.div
                className={styles.iconWrapper}
                style={{ backgroundColor: `${metric.color}15` }}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <span className={styles.icon}>{metric.icon}</span>
              </motion.div>

              <motion.div className={styles.value} style={{ color: metric.color }}>
                <AnimatedCounter
                  value={metric.value}
                  suffix={metric.suffix}
                  isInView={isInView}
                />
              </motion.div>

              <p className={styles.label}>{metric.label}</p>

              {/* Animated background gradient */}
              <motion.div
                className={styles.backgroundGradient}
                style={{
                  background: `radial-gradient(circle at center, ${metric.color}15 0%, transparent 70%)`
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Social proof */}
        <motion.div
          className={styles.socialProof}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className={styles.proofCard}>
            <div className={styles.proofIcon}>⭐</div>
            <div className={styles.proofContent}>
              <div className={styles.proofValue}>4.9/5.0</div>
              <div className={styles.proofLabel}>Average rating from 2,400+ recruiters</div>
            </div>
          </div>
          <div className={styles.proofCard}>
            <div className={styles.proofIcon}>🏢</div>
            <div className={styles.proofContent}>
              <div className={styles.proofValue}>500+</div>
              <div className={styles.proofLabel}>Companies using TalentSage globally</div>
            </div>
          </div>
          <div className={styles.proofCard}>
            <div className={styles.proofIcon}>📊</div>
            <div className={styles.proofContent}>
              <div className={styles.proofValue}>1M+</div>
              <div className={styles.proofLabel}>Candidates processed monthly</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
