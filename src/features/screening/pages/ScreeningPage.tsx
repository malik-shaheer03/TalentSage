import { useState } from 'react';
import { useStore } from '../../../store';
import { Screening } from '../../../types/models';
import { VideoUpload } from '../components/VideoUpload';
import { ScreeningSummary } from '../components/ScreeningSummary';
import { VideoReview } from '../components/VideoReview';
import styles from './ScreeningPage.module.css';

interface ScreeningPageProps {
  candidateId: string;
  jobId: string;
  mode: 'candidate' | 'recruiter';
  onBack?: () => void;
}

export function ScreeningPage({ candidateId, jobId, mode, onBack }: ScreeningPageProps) {
  const { getCandidate, getScreeningByCandidate } = useStore();
  
  const candidate = getCandidate(candidateId);
  const existingScreening = getScreeningByCandidate(candidateId);
  
  const [screening, setScreening] = useState<Screening | null>(existingScreening || null);
  const [currentView, setCurrentView] = useState<'upload' | 'summary' | 'review'>(
    existingScreening ? 'summary' : 'upload'
  );

  if (!candidate) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorCard}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
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
              d="M12 8V12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 16H12.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h2>Candidate Not Found</h2>
          <p>Unable to load candidate information</p>
        </div>
      </div>
    );
  }

  const handleUploadSuccess = (newScreening: Screening) => {
    setScreening(newScreening);
    setCurrentView('summary');
  };

  const handleReviewComplete = () => {
    // Refresh screening data
    const updatedScreening = getScreeningByCandidate(candidateId);
    if (updatedScreening) {
      setScreening(updatedScreening);
    }
  };

  return (
    <div className={styles.container}>
      {/* Back Button */}
      <div className={styles.header}>
        {onBack && (
          <button className={styles.backButton} onClick={onBack}>
            ← Back
          </button>
        )}
      </div>

      {/* Candidate Info Card */}
      <div className={styles.candidateCard}>
        <div className={styles.candidateAvatar}>
          {candidate.name.charAt(0).toUpperCase()}
        </div>
        <div className={styles.candidateInfo}>
          <h2 className={styles.candidateName}>{candidate.name}</h2>
          <p className={styles.candidateEmail}>{candidate.email}</p>
          <p className={styles.candidateMeta}>
            {candidate.location} · {candidate.experience} years experience
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      {screening && (
        <div className={styles.contentWrapper}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${currentView === 'summary' ? styles.activeTab : ''}`}
              onClick={() => setCurrentView('summary')}
            >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 11L12 14L22 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            AI Summary
          </button>

          {mode === 'recruiter' && (
            <button
              className={`${styles.tab} ${currentView === 'review' ? styles.activeTab : ''}`}
              onClick={() => setCurrentView('review')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
              </svg>
              Review
            </button>
          )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className={screening ? styles.contentWrapper : ''}>
        <div className={styles.content}>
        {!screening && currentView === 'upload' && (
          <VideoUpload
            candidateId={candidateId}
            jobId={jobId}
            candidateName={candidate.name}
            onSubmitSuccess={handleUploadSuccess}
          />
        )}

        {screening && currentView === 'summary' && (
          <ScreeningSummary screening={screening} />
        )}

        {screening && currentView === 'review' && mode === 'recruiter' && (
          <VideoReview
            screening={screening}
            candidateName={candidate.name}
            onReviewComplete={handleReviewComplete}
          />
        )}
        </div>
      </div>
    </div>
  );
}
