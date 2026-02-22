import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store';
import styles from './SchedulingModal.module.css';

interface SchedulingModalProps {
  onClose: () => void;
  onConfirm: (date: Date, time: string, notes: string) => void;
  candidateId?: string;
  jobId?: string;
}

export const SchedulingModal: React.FC<SchedulingModalProps> = ({
  onClose,
  onConfirm,
  candidateId,
  jobId
}) => {
  const candidate = useStore((s) => candidateId ? s.candidates[candidateId] : null);
  const job = useStore((s) => jobId ? s.jobs[jobId] : null);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time) {
      alert('Please select both date and time');
      return;
    }

    const selectedDate = new Date(date);
    onConfirm(selectedDate, time, notes);
  };

  // Get tomorrow's date as minimum
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={styles.modal}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.header}>
            <h2 className={styles.title}>Schedule Interview</h2>
            <button className={styles.closeButton} onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M5 5l10 10M15 5l-10 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {candidate && (
            <div className={styles.candidateInfo}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Candidate:</span>
                <span className={styles.value}>{candidate.name}</span>
              </div>
              {job && (
                <div className={styles.infoRow}>
                  <span className={styles.label}>Position:</span>
                  <span className={styles.value}>{job.title}</span>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="date" className={styles.formLabel}>
                Interview Date
              </label>
              <input
                type="date"
                id="date"
                className={styles.input}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={minDate}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="time" className={styles.formLabel}>
                Interview Time
              </label>
              <input
                type="time"
                id="time"
                className={styles.input}
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="notes" className={styles.formLabel}>
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                className={styles.textarea}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add interview panel, meeting link, or other details..."
                rows={3}
              />
            </div>

            <div className={styles.actions}>
              <button type="button" className={styles.cancelButton} onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className={styles.confirmButton}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M13 4L6 11l-3-3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Confirm Interview
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
