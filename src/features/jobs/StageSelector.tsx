import { Candidate } from '../../types';
import styles from './StageSelector.module.css';

interface StageSelectorProps {
  candidate: Candidate;
  currentStage: Candidate['stage'];
  onStageSelect: (newStage: Candidate['stage']) => void;
  onClose: () => void;
}

const stageInfo: Record<Candidate['stage'], { label: string; icon: string; color: string }> = {
  applied: { label: 'Applied', icon: '📝', color: '#64748b' },
  shortlisted: { label: 'Shortlisted', icon: '⭐', color: '#f59e0b' },
  interview: { label: 'Interview', icon: '🎯', color: '#3b82f6' },
  rejected: { label: 'Rejected', icon: '❌', color: '#ef4444' }
};

export function StageSelector({ candidate, currentStage, onStageSelect, onClose }: StageSelectorProps) {
  const stages: Candidate['stage'][] = ['applied', 'shortlisted', 'interview', 'rejected'];

  const handleStageClick = (stage: Candidate['stage']) => {
    if (stage !== currentStage) {
      onStageSelect(stage);
    }
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Move Candidate</h3>
            <p className={styles.subtitle}>{candidate.name}</p>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className={styles.stages}>
          {stages.map((stage) => {
            const info = stageInfo[stage];
            const isCurrent = stage === currentStage;
            
            return (
              <button
                key={stage}
                className={`${styles.stageButton} ${isCurrent ? styles.current : ''}`}
                onClick={() => handleStageClick(stage)}
                disabled={isCurrent}
              >
                <span className={styles.icon}>{info.icon}</span>
                <div className={styles.stageInfo}>
                  <span className={styles.stageName}>{info.label}</span>
                  {isCurrent && <span className={styles.currentBadge}>Current</span>}
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={styles.arrow}>
                  <path
                    d="M9 18l6-6-6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
