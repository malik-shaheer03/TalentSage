import { useState } from 'react';
import { Screening } from '../../../types/models';
import { useStore } from '../../../store';
import { toast } from '../../../shared/components/Toast';
import styles from './VideoReview.module.css';

interface VideoReviewProps {
  screening: Screening;
  candidateName: string;
  onReviewComplete?: () => void;
}

export function VideoReview({ screening, candidateName, onReviewComplete }: VideoReviewProps) {
  const [reviewStatus, setReviewStatus] = useState<'pass' | 'hold' | 'reject' | null>(
    screening.reviewStatus && screening.reviewStatus !== 'pending' ? screening.reviewStatus : null
  );
  const [notes, setNotes] = useState(screening.reviewNotes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { reviewScreening } = useStore();

  const handleSubmit = async () => {
    if (!reviewStatus) {
      toast.warning('Please select a review decision');
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit review
      reviewScreening(screening.id, reviewStatus, notes);

      // Success callback
      if (onReviewComplete) {
        onReviewComplete();
      }

      // Show success toast
      const statusText = reviewStatus === 'pass' ? '✓ Passed' : 
                        reviewStatus === 'hold' ? '⏸ On Hold' : 
                        '✗ Rejected';
      toast.success(`Review submitted successfully! Status: ${statusText}`);
    } catch (error) {
      console.error('Review submission failed:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReviewed = screening.reviewStatus !== 'pending';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Video Screening Review</h2>
        <p>Review screening submission for {candidateName}</p>
      </div>

      {/* Video Player */}
      <div className={styles.videoSection}>
        <div className={styles.videoWrapper}>
          {screening.videoUrl ? (
            <video src={screening.videoUrl} controls className={styles.videoPlayer} />
          ) : (
            <div className={styles.videoPlaceholder}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path
                  d="M23 7L16 12L23 17V7Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect
                  x="1"
                  y="5"
                  width="15"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p>Video not available</p>
            </div>
          )}
        </div>
        {screening.duration && (
          <div className={styles.videoInfo}>
            <span className={styles.durationBadge}>
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
                  d="M12 6V12L16 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {Math.floor(screening.duration / 60)}:{String(screening.duration % 60).padStart(2, '0')} min
            </span>
          </div>
        )}
      </div>

      {/* Review Decision */}
      <div className={styles.reviewSection}>
        <h3 className={styles.sectionTitle}>Review Decision</h3>
        <div className={styles.decisionButtons}>
          <button
            className={`${styles.decisionButton} ${styles.passButton} ${reviewStatus === 'pass' ? styles.active : ''}`}
            onClick={() => !isReviewed && setReviewStatus('pass')}
            disabled={isReviewed}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 4L12 14.01L9 11.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Pass
          </button>

          <button
            className={`${styles.decisionButton} ${styles.holdButton} ${reviewStatus === 'hold' ? styles.active : ''}`}
            onClick={() => !isReviewed && setReviewStatus('hold')}
            disabled={isReviewed}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
                d="M12 6V12"
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
            Hold
          </button>

          <button
            className={`${styles.decisionButton} ${styles.rejectButton} ${reviewStatus === 'reject' ? styles.active : ''}`}
            onClick={() => !isReviewed && setReviewStatus('reject')}
            disabled={isReviewed}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
                d="M15 9L9 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 9L15 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Reject
          </button>
        </div>
      </div>

      {/* Review Notes */}
      <div className={styles.notesSection}>
        <label htmlFor="review-notes" className={styles.sectionTitle}>
          Review Notes
        </label>
        <textarea
          id="review-notes"
          className={styles.notesTextarea}
          placeholder="Add your observations, feedback, and reasoning for your decision..."
          value={notes}
          onChange={(e) => !isReviewed && setNotes(e.target.value)}
          rows={6}
          disabled={isReviewed}
        />
      </div>

      {/* Submit Button */}
      {!isReviewed && (
        <div className={styles.submitSection}>
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={!reviewStatus || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      )}

      {isReviewed && (
        <div className={styles.reviewedBanner}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 4L12 14.01L9 11.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Review submitted on {new Date(screening.reviewedAt!).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
}
