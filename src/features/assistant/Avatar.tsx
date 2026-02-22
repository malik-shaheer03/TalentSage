import React from 'react';
import { motion } from 'framer-motion';
import styles from './Avatar.module.css';

export type AvatarState = 'idle' | 'listening' | 'thinking' | 'speaking';
export type AvatarSize = 'tiny' | 'small' | 'medium' | 'large';

interface AvatarProps {
  state: AvatarState;
  size?: AvatarSize;
}

export const Avatar: React.FC<AvatarProps> = ({ state, size = 'medium' }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'tiny':
        return styles.tiny;
      case 'small':
        return styles.small;
      case 'large':
        return styles.large;
      default:
        return styles.medium;
    }
  };

  return (
    <div className={`${styles.avatar} ${getSizeClass()} ${styles[state]}`}>
      <svg viewBox="0 0 100 100" className={styles.svg}>
        {/* Background circle */}
        <circle cx="50" cy="50" r="48" className={styles.background} />

        {/* Face outline */}
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          className={styles.face}
          animate={{
            scale: state === 'listening' ? [1, 1.05, 1] : 1,
            opacity: state === 'thinking' ? [1, 0.7, 1] : 1
          }}
          transition={{
            duration: state === 'listening' ? 1.5 : 2,
            repeat: state === 'listening' || state === 'thinking' ? Infinity : 0,
            ease: 'easeInOut'
          }}
        />

        {/* Eyes */}
        <motion.g
          animate={{
            y: state === 'thinking' ? [0, -2, 0] : 0
          }}
          transition={{
            duration: 1.5,
            repeat: state === 'thinking' ? Infinity : 0,
            ease: 'easeInOut'
          }}
        >
          <circle cx="38" cy="42" r="4" className={styles.eye} />
          <circle cx="62" cy="42" r="4" className={styles.eye} />
        </motion.g>

        {/* Mouth */}
        {state === 'idle' && (
          <motion.path
            d="M 35 60 Q 50 65 65 60"
            className={styles.mouth}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}

        {state === 'listening' && (
          <motion.circle
            cx="50"
            cy="60"
            r="3"
            className={styles.mouth}
            animate={{
              r: [3, 5, 3]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}

        {state === 'thinking' && (
          <motion.path
            d="M 40 60 L 60 60"
            className={styles.mouth}
            animate={{
              d: ['M 40 60 L 60 60', 'M 35 60 L 65 60', 'M 40 60 L 60 60']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}

        {state === 'speaking' && (
          <motion.g>
            <motion.ellipse
              cx="50"
              cy="62"
              rx="8"
              ry="6"
              className={styles.mouth}
              animate={{
                ry: [6, 8, 6]
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          </motion.g>
        )}

        {/* Listening indicator */}
        {state === 'listening' && (
          <motion.g>
            <motion.path
              d="M 25 50 L 20 45 L 20 55 Z"
              className={styles.soundWave}
              animate={{
                opacity: [0.3, 1, 0.3],
                x: [0, -2, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
            <motion.path
              d="M 75 50 L 80 45 L 80 55 Z"
              className={styles.soundWave}
              animate={{
                opacity: [0.3, 1, 0.3],
                x: [0, 2, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          </motion.g>
        )}

        {/* Thinking dots */}
        {state === 'thinking' && (
          <motion.g>
            {[0, 1, 2].map((i) => (
              <motion.circle
                key={i}
                cx={42 + i * 8}
                cy={72}
                r="2"
                className={styles.thinkingDot}
                animate={{
                  y: [0, -4, 0],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </motion.g>
        )}

        {/* Speaking waves */}
        {state === 'speaking' && (
          <motion.g>
            {[0, 1, 2].map((i) => (
              <motion.path
                key={i}
                d={`M ${70 + i * 6} 50 Q ${75 + i * 6} ${45 - i * 3} ${70 + i * 6} 40`}
                className={styles.speakingWave}
                animate={{
                  opacity: [0, 1, 0],
                  pathLength: [0, 1, 0]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </motion.g>
        )}
      </svg>
    </div>
  );
};
