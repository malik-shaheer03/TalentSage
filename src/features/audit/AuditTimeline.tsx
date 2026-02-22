import React from 'react';
import { useStore } from '../../store';
import { AuditLog } from '../../types';
import styles from './AuditTimeline.module.css';

interface AuditTimelineProps {
  entityType: AuditLog['entityType'];
  entityId: string;
}

export const AuditTimeline: React.FC<AuditTimelineProps> = ({
  entityType,
  entityId
}) => {
  const getLogsByEntity = useStore((s) => s.getLogsByEntity);
  const logs = getLogsByEntity(entityType, entityId);

  const getActionIcon = (action: string) => {
    if (action.includes('stage_changed')) return '🔄';
    if (action.includes('application')) return '📩';
    if (action.includes('rubric')) return '📊';
    if (action.includes('screening')) return '📹';
    return '📝';
  };

  const getActionLabel = (log: AuditLog) => {
    switch (log.action) {
      case 'stage_changed':
        return `Stage changed from ${log.details.from} to ${log.details.to}`;
      case 'application_received':
        return 'Application received';
      case 'rubric_created':
        return 'Evaluation rubric created';
      case 'rubric_updated':
        return 'Evaluation rubric updated';
      case 'criteria_updated':
        return 'Rubric criteria updated';
      default:
        return log.action.replace(/_/g, ' ');
    }
  };

  const getActorDisplay = (log: AuditLog) => {
    if (log.actorName) return log.actorName;
    return log.actor.replace(/_/g, ' ');
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  if (logs.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>📋</span>
        <p className={styles.emptyText}>No activity yet</p>
      </div>
    );
  }

  return (
    <div className={styles.timeline}>
      {logs.map((log, index) => (
        <div key={log.id} className={styles.entry}>
          <div className={styles.iconWrapper}>
            <span className={styles.icon}>{getActionIcon(log.action)}</span>
            {index < logs.length - 1 && <div className={styles.line} />}
          </div>

          <div className={styles.content}>
            <div className={styles.header}>
              <span className={styles.action}>{getActionLabel(log)}</span>
              <span className={styles.time}>{formatTimestamp(log.timestamp)}</span>
            </div>
            <span className={styles.actor}>by {getActorDisplay(log)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
