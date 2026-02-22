import React, { useState } from 'react';
import { useStore } from '../../store';
import { Candidate } from '../../types';
import { Badge } from '../../shared/components/Badge';
import { Card } from '../../shared/components/Card';
import { EmptyState } from '../../shared/components/EmptyState';
import { toast } from '../../shared/components/Toast';
import { StageSelector } from './StageSelector';
import styles from './JobDetailPage.module.css';

interface JobDetailPageProps {
  jobId: string;
  onCandidateClick: (candidateId: string) => void;
}

export const JobDetailPage: React.FC<JobDetailPageProps> = ({
  jobId,
  onCandidateClick
}) => {
  const job = useStore((s) => s.getJob(jobId));
  const getCandidatesByStage = useStore((s) => s.getCandidatesByStage);
  const changeCandidateStage = useStore((s) => s.changeCandidateStage);
  const rubric = useStore((s) => s.getRubricByJob(jobId));

  const [error] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<Candidate['stage'] | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showStageSelector, setShowStageSelector] = useState(false);

  if (!job) {
    return (
      <div className={styles.container}>
        <EmptyState
          title="Job not found"
          description="The job you're looking for doesn't exist or has been removed."
          icon="❌"
        />
      </div>
    );
  }

  const stages: Array<{ key: Candidate['stage']; label: string }> = [
    { key: 'applied', label: 'Applied' },
    { key: 'shortlisted', label: 'Shortlisted' },
    { key: 'interview', label: 'Interview' },
    { key: 'rejected', label: 'Rejected' }
  ];

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, candidateId: string, currentStage: Candidate['stage']) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('candidateId', candidateId);
    e.dataTransfer.setData('currentStage', currentStage);
    
    // Add drag class to card
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDragOverStage(null);
    
    // Reset opacity
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
  };

  const handleDragOver = (e: React.DragEvent, stage: Candidate['stage']) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = async (e: React.DragEvent, newStage: Candidate['stage']) => {
    e.preventDefault();
    setDragOverStage(null);
    
    const candidateId = e.dataTransfer.getData('candidateId');
    const currentStage = e.dataTransfer.getData('currentStage') as Candidate['stage'];
    
    if (candidateId && currentStage !== newStage) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      changeCandidateStage(candidateId, newStage);
      
      // Show toast notification
      const stageNames: Record<Candidate['stage'], string> = {
        applied: 'Applied',
        shortlisted: 'Shortlisted',
        interview: 'Interview',
        rejected: 'Rejected'
      };
      toast.success(`Candidate moved to ${stageNames[newStage]}`);
    }
  };

  // Mobile click handler to open stage selector
  const handleCandidateLongPress = (e: React.MouseEvent, candidate: Candidate) => {
    // Only on mobile (small screens)
    if (window.innerWidth <= 768) {
      e.stopPropagation(); // Prevent card click
      setSelectedCandidate(candidate);
      setShowStageSelector(true);
    }
  };

  const handleStageSelect = (newStage: Candidate['stage']) => {
    if (selectedCandidate && selectedCandidate.stage !== newStage) {
      changeCandidateStage(selectedCandidate.id, newStage);
      
      const stageNames: Record<Candidate['stage'], string> = {
        applied: 'Applied',
        shortlisted: 'Shortlisted',
        interview: 'Interview',
        rejected: 'Rejected'
      };
      toast.success(`Candidate moved to ${stageNames[newStage]}`);
    }
    setShowStageSelector(false);
    setSelectedCandidate(null);
  };

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

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{job.title}</h1>
          <p className={styles.meta}>
            {job.department} · {job.location} · {job.type}
          </p>
        </div>
        <Badge variant={job.status === 'open' ? 'success' : 'default'}>
          {job.status}
        </Badge>
      </div>

      {/* Error State */}
      {error && (
        <div className={styles.errorBanner}>
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {/* Job Details */}
      <div className={styles.details}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Description</h2>
          <p className={styles.description}>{job.description}</p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Requirements</h2>
          <ul className={styles.requirementsList}>
            {job.requirements.map((req: string, index: number) => (
              <li key={index} className={styles.requirement}>
                <span className={styles.bullet}>•</span>
                {req}
              </li>
            ))}
          </ul>
        </section>

        {rubric && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Evaluation Rubric</h2>
            <div className={styles.rubricGrid}>
              {rubric.criteria.map((criterion: { id: string; name: string; weight: number; description: string }) => (
                <div key={criterion.id} className={styles.criterion}>
                  <div className={styles.criterionHeader}>
                    <span className={styles.criterionName}>{criterion.name}</span>
                    <span className={styles.criterionWeight}>{criterion.weight}%</span>
                  </div>
                  <p className={styles.criterionDesc}>{criterion.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Candidate Pipeline */}
      <section className={styles.pipelineSection}>
        <h2 className={styles.sectionTitle}>Candidate Pipeline</h2>
        <p className={styles.dragHint}>💡 Drag and drop candidates between stages</p>
        <div className={styles.pipeline}>
          {stages.map((stage) => {
            const candidates = getCandidatesByStage(jobId, stage.key);
            const isDropTarget = dragOverStage === stage.key;

            return (
              <div 
                key={stage.key} 
                className={`${styles.stageColumn} ${isDropTarget ? styles.dropTarget : ''}`}
                onDragOver={(e) => handleDragOver(e, stage.key)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, stage.key)}
              >
                <div className={styles.stageHeader}>
                  <h3 className={styles.stageTitle}>{stage.label}</h3>
                  <Badge variant={getStageVariant(stage.key)}>
                    {candidates.length}
                  </Badge>
                </div>

                <div className={styles.candidateList}>
                  {candidates.length === 0 ? (
                    <div className={styles.emptyStage}>
                      <span className={styles.emptyIcon}>📭</span>
                      <p className={styles.emptyText}>No candidates</p>
                    </div>
                  ) : (
                    candidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, candidate.id, stage.key)}
                        onDragEnd={handleDragEnd}
                        className={styles.draggableWrapper}
                      >
                        <Card
                          hoverable
                          className={styles.candidateCard}
                        >
                          <div 
                            className={styles.candidateClickable}
                            onClick={() => onCandidateClick(candidate.id)}
                          >
                            <div className={styles.candidateHeader}>
                              <h4 className={styles.candidateName}>{candidate.name}</h4>
                              {candidate.score && (
                                <span className={styles.score}>{candidate.score}</span>
                              )}
                            </div>
                            <p className={styles.candidateLocation}>{candidate.location}</p>
                            <div className={styles.skills}>
                              {candidate.skills.slice(0, 3).map((skill: string) => (
                                <span key={skill} className={styles.skill}>
                                  {skill}
                                </span>
                              ))}
                              {candidate.skills.length > 3 && (
                                <span className={styles.skillMore}>
                                  +{candidate.skills.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Mobile stage change button */}
                          <button
                            className={styles.mobileStageButton}
                            onClick={(e) => handleCandidateLongPress(e, candidate)}
                            aria-label="Change stage"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M12 5v14M5 12h14"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </Card>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mobile Stage Selector Modal */}
      {showStageSelector && selectedCandidate && (
        <StageSelector
          candidate={selectedCandidate}
          currentStage={selectedCandidate.stage}
          onStageSelect={handleStageSelect}
          onClose={() => {
            setShowStageSelector(false);
            setSelectedCandidate(null);
          }}
        />
      )}
    </div>
  );
};
