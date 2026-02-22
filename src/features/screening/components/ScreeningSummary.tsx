import { Screening } from '../../../types/models';
import styles from './ScreeningSummary.module.css';

interface ScreeningSummaryProps {
  screening: Screening;
}

export function ScreeningSummary({ screening }: ScreeningSummaryProps) {
  const { transcript, evaluation } = screening;

  if (!transcript || !evaluation) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Screening data not available</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number): string => {
    if (score >= 85) return styles.scoreExcellent;
    if (score >= 70) return styles.scoreGood;
    return styles.scoreFair;
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    return 'Fair';
  };

  const getRecommendationBadge = (): { text: string; className: string } => {
    const { overall } = evaluation;
    if (overall >= 85)
      return { text: 'Highly Recommended', className: styles.badgeExcellent };
    if (overall >= 75) return { text: 'Recommended', className: styles.badgeGood };
    if (overall >= 65)
      return { text: 'Consider with Reservations', className: styles.badgeFair };
    return { text: 'Not Recommended', className: styles.badgePoor };
  };

  const recommendation = getRecommendationBadge();

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2>AI Screening Summary</h2>
        <p>Automated analysis of video screening submission</p>
      </div>

      {/* Recommendation Card */}
      <div className={styles.recommendationCard}>
        <div className={styles.recommendationHeader}>
          <span className={styles.recommendationLabel}>Overall Recommendation</span>
          <span className={`${styles.recommendationBadge} ${recommendation.className}`}>
            {recommendation.text}
          </span>
        </div>
        <div className={styles.overallScore}>
          <span className={styles.scoreValue}>{evaluation.overall}</span>
          <span className={styles.scoreMax}>/100</span>
        </div>
        <p className={styles.summaryText}>{evaluation.summary}</p>
      </div>

      {/* Scoring Breakdown */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Scoring Breakdown</h3>
        <div className={styles.scoresGrid}>
          {/* Communication Score */}
          <div className={styles.scoreCard}>
            <div className={styles.scoreHeader}>
              <div className={styles.scoreIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className={styles.scoreName}>Communication</span>
            </div>
            <div className={styles.scoreBody}>
              <div className={`${styles.scoreNumber} ${getScoreColor(evaluation.communication)}`}>
                {evaluation.communication}
              </div>
              <div className={styles.scoreBar}>
                <div
                  className={`${styles.scoreBarFill} ${getScoreColor(evaluation.communication)}`}
                  style={{ width: `${evaluation.communication}%` }}
                />
              </div>
              <div className={styles.scoreLabel}>{getScoreLabel(evaluation.communication)}</div>
            </div>
          </div>

          {/* Clarity Score */}
          <div className={styles.scoreCard}>
            <div className={styles.scoreHeader}>
              <div className={styles.scoreIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className={styles.scoreName}>Clarity</span>
            </div>
            <div className={styles.scoreBody}>
              <div className={`${styles.scoreNumber} ${getScoreColor(evaluation.clarity)}`}>
                {evaluation.clarity}
              </div>
              <div className={styles.scoreBar}>
                <div
                  className={`${styles.scoreBarFill} ${getScoreColor(evaluation.clarity)}`}
                  style={{ width: `${evaluation.clarity}%` }}
                />
              </div>
              <div className={styles.scoreLabel}>{getScoreLabel(evaluation.clarity)}</div>
            </div>
          </div>

          {/* Confidence Score */}
          <div className={styles.scoreCard}>
            <div className={styles.scoreHeader}>
              <div className={styles.scoreIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className={styles.scoreName}>Confidence</span>
            </div>
            <div className={styles.scoreBody}>
              <div className={`${styles.scoreNumber} ${getScoreColor(evaluation.confidence)}`}>
                {evaluation.confidence}
              </div>
              <div className={styles.scoreBar}>
                <div
                  className={`${styles.scoreBarFill} ${getScoreColor(evaluation.confidence)}`}
                  style={{ width: `${evaluation.confidence}%` }}
                />
              </div>
              <div className={styles.scoreLabel}>{getScoreLabel(evaluation.confidence)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Transcript Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            style={{ marginRight: '0.5rem' }}
          >
            <path
              d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 2V8H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 13H8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 17H8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 9H9H8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Video Transcript
        </h3>
        <div className={styles.transcriptBox}>
          <p className={styles.transcriptText}>{transcript}</p>
        </div>
        <div className={styles.transcriptNote}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 16V12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 8H12.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Transcript generated using speech-to-text AI analysis</span>
        </div>
      </div>
    </div>
  );
}
