import React, { useState, useEffect } from 'react';
import { useStore } from '../../store';
import { Candidate } from '../../types';
import { Badge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/Button';
import { EmptyState } from '../../shared/components/EmptyState';
import { AuditTimeline } from '../audit/AuditTimeline';
import styles from './CandidateProfile.module.css';

interface CandidateProfileProps {
  candidateId: string;
  onBack: () => void;
  onOpenScreening?: (mode: 'candidate' | 'recruiter') => void;
}

export const CandidateProfile: React.FC<CandidateProfileProps> = ({
  candidateId,
  onBack,
  onOpenScreening
}) => {
  const candidate = useStore((s) => s.candidates[candidateId]);
  const changeCandidateStage = useStore((s) => s.changeCandidateStage);
  const job = useStore((s) => candidate ? s.getJob(candidate.jobId) : null);
  const screening = useStore((s) => s.getScreeningByCandidate(candidateId));

  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loadingStage, setLoadingStage] = useState<Candidate['stage'] | null>(null);

  // Simulate error state for demonstration
  useEffect(() => {
    if (candidateId === 'error-demo') {
      setShowError(true);
    }
  }, [candidateId]);

  if (!candidate) {
    return (
      <div className={styles.container}>
        <EmptyState
          title="Candidate not found"
          description="The candidate profile you're looking for doesn't exist."
          icon="❌"
          action={{ label: 'Go Back', onClick: onBack }}
        />
      </div>
    );
  }

  const getStageVariant = (stage: Candidate['stage']) => {
    switch (stage) {
      case 'applied':
        return 'default';
      case 'shortlisted':
        return 'info';
      case 'interview':
        return 'warning';
      case 'rejected':
        return 'danger';
    }
  };

  const handleStageChange = async (newStage: Candidate['stage']) => {
    setLoadingStage(newStage); // Set which button is loading
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 400));
    changeCandidateStage(candidateId, newStage);
    setLoading(false);
    setLoadingStage(null); // Clear loading state
  };

  return (
    <div className={styles.container}>
      {/* Error Banner (Simulated) */}
      {showError && (
        <div className={styles.errorBanner}>
          <div className={styles.errorContent}>
            <span className={styles.errorIcon}>⚠️</span>
            <div>
              <h4 className={styles.errorTitle}>Connection Error</h4>
              <p className={styles.errorMessage}>
                Failed to load candidate data. Please try again.
              </p>
            </div>
          </div>
          <button
            className={styles.errorClose}
            onClick={() => setShowError(false)}
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          ← Back
        </button>
      </div>

      {/* Profile Card */}
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {candidate.name.charAt(0).toUpperCase()}
          </div>
          <div className={styles.profileInfo}>
            <h1 className={styles.name}>{candidate.name}</h1>
            <p className={styles.email}>{candidate.email}</p>
            <p className={styles.meta}>
              {candidate.location} · {candidate.experience} years experience
            </p>
          </div>
          <div className={styles.profileActions}>
            <Badge variant={getStageVariant(candidate.stage)}>
              {candidate.stage}
            </Badge>
            {screening && (
              <Badge variant={
                screening.reviewStatus === 'pass' ? 'success' :
                screening.reviewStatus === 'hold' ? 'warning' :
                screening.reviewStatus === 'reject' ? 'danger' : 'info'
              }>
                Screening: {screening.reviewStatus || 'pending'}
              </Badge>
            )}
            {candidate.score && (
              <div className={styles.score}>
                <span className={styles.scoreValue}>{candidate.score}</span>
                <span className={styles.scoreLabel}>Score</span>
              </div>
            )}
          </div>
        </div>

        {/* Stage Actions */}
        <div className={styles.stageActions}>
          {onOpenScreening && (
            <Button
              variant="secondary"
              size="sm"
              disabled={loading}
              onClick={() => onOpenScreening('recruiter')}
            >
              📹 Video Screening
            </Button>
          )}
          {candidate.stage !== 'rejected' && (
            <Button
              variant="danger"
              size="sm"
              loading={loadingStage === 'rejected'}
              disabled={loading}
              onClick={() => handleStageChange('rejected')}
            >
              Reject
            </Button>
          )}
          {candidate.stage === 'applied' && (
            <Button
              variant="primary"
              size="sm"
              loading={loadingStage === 'shortlisted'}
              disabled={loading}
              onClick={() => handleStageChange('shortlisted')}
            >
              Shortlist
            </Button>
          )}
          {candidate.stage === 'shortlisted' && (
            <Button
              variant="primary"
              size="sm"
              loading={loadingStage === 'interview'}
              disabled={loading}
              onClick={() => handleStageChange('interview')}
            >
              Move to Interview
            </Button>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className={styles.grid}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          {/* Skills */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Skills</h2>
            <div className={styles.skills}>
              {candidate.skills.map((skill: string) => (
                <span key={skill} className={styles.skill}>
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Resume */}
          {candidate.resumeText && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Resume Summary</h2>
              <p className={styles.resumeText}>{candidate.resumeText}</p>
            </section>
          )}

          {/* Evaluation Summary */}
          {candidate.evaluationSummary && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>AI Evaluation</h2>
              <div className={styles.evaluation}>
                <div className={styles.evalSection}>
                  <h3 className={styles.evalHeading}>Strengths</h3>
                  <ul className={styles.evalList}>
                    {candidate.evaluationSummary.strengths.map((strength: string, index: number) => (
                      <li key={index} className={styles.evalItem}>
                        <span className={styles.evalBullet}>✓</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                {candidate.evaluationSummary.concerns.length > 0 && (
                  <div className={styles.evalSection}>
                    <h3 className={styles.evalHeading}>Concerns</h3>
                    <ul className={styles.evalList}>
                      {candidate.evaluationSummary.concerns.map((concern: string, index: number) => (
                        <li key={index} className={styles.evalItem}>
                          <span className={styles.evalBullet}>!</span>
                          {concern}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className={styles.recommendation}>
                  <strong>Recommendation:</strong> {candidate.evaluationSummary.recommendation}
                </div>
              </div>
            </section>
          )}

          {/* Job Details */}
          {job && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Applied Position</h2>
              <div className={styles.jobInfo}>
                <h3 className={styles.jobTitle}>{job.title}</h3>
                <p className={styles.jobMeta}>
                  {job.department} · {job.location}
                </p>
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Audit Timeline */}
        <div className={styles.rightColumn}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Activity Timeline</h2>
            <AuditTimeline entityType="candidate" entityId={candidateId} />
          </section>
        </div>
      </div>
    </div>
  );
};
