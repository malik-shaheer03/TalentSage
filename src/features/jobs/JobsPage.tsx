import React from 'react';
import { useStore } from '../../store';
import { Job } from '../../types';
import { Badge } from '../../shared/components/Badge';
import { Card } from '../../shared/components/Card';
import { EmptyState } from '../../shared/components/EmptyState';
import styles from './JobsPage.module.css';

interface JobsPageProps {
  onJobSelect?: (jobId: string) => void;
}

export const JobsPage: React.FC<JobsPageProps> = ({ onJobSelect }) => {
  const jobs = useStore((s) => Object.values(s.jobs));
  const candidates = useStore((s) => s.candidates);

  const handleJobClick = (jobId: string) => {
    onJobSelect?.(jobId);
  };

  const getJobStats = (job: Job) => {
    const jobCandidates = job.candidateIds
      .map((id) => candidates[id])
      .filter(Boolean);

    return {
      total: jobCandidates.length,
      applied: jobCandidates.filter((c) => c.stage === 'applied').length,
      shortlisted: jobCandidates.filter((c) => c.stage === 'shortlisted').length,
      interview: jobCandidates.filter((c) => c.stage === 'interview').length
    };
  };

  const getStatusVariant = (status: Job['status']) => {
    switch (status) {
      case 'open':
        return 'success';
      case 'closed':
        return 'danger';
      case 'draft':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (jobs.length === 0) {
    return (
      <div className={styles.container}>
        <EmptyState
          title="No jobs found"
          description="Get started by creating your first job posting."
          icon="💼"
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Jobs</h1>
          <p className={styles.subtitle}>Manage your open positions</p>
        </div>
      </div>

      <div className={styles.grid}>
        {jobs.map((job) => {
          const stats = getJobStats(job);

          return (
            <Card
              key={job.id}
              hoverable
              onClick={() => handleJobClick(job.id)}
              className={styles.jobCard}
            >
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.jobTitle}>{job.title}</h3>
                  <p className={styles.jobMeta}>
                    {job.department} · {job.location}
                  </p>
                </div>
                <Badge variant={getStatusVariant(job.status)}>
                  {job.status}
                </Badge>
              </div>

              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{stats.total}</span>
                  <span className={styles.statLabel}>Total</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{stats.applied}</span>
                  <span className={styles.statLabel}>Applied</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{stats.shortlisted}</span>
                  <span className={styles.statLabel}>Shortlisted</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{stats.interview}</span>
                  <span className={styles.statLabel}>Interview</span>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.type}>{job.type}</span>
                <span className={styles.date}>
                  Posted {formatRelativeTime(job.createdAt)}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

function formatRelativeTime(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}
