import { StateCreator } from 'zustand';
import { Screening } from '../../types/models';
import { AuditSlice } from './auditSlice';

export interface ScreeningsSlice {
  screenings: Record<string, Screening>;
  addScreening: (screening: Screening) => void;
  updateScreening: (id: string, updates: Partial<Screening>) => void;
  reviewScreening: (
    id: string,
    reviewStatus: 'pass' | 'hold' | 'reject',
    reviewNotes?: string
  ) => void;
  getScreening: (id: string) => Screening | undefined;
  getScreeningByCandidate: (candidateId: string) => Screening | undefined;
}

export const createScreeningsSlice: StateCreator<
  ScreeningsSlice & AuditSlice,
  [],
  [],
  ScreeningsSlice
> = (set, get) => ({
  screenings: {},

  addScreening: (screening) =>
    set((state) => ({
      screenings: { ...state.screenings, [screening.id]: screening }
    })),

  updateScreening: (id, updates) =>
    set((state) => {
      const screening = state.screenings[id];
      if (!screening) return state;

      return {
        screenings: {
          ...state.screenings,
          [id]: { ...screening, ...updates }
        }
      };
    }),

  reviewScreening: (id, reviewStatus, reviewNotes = '') => {
    const screening = get().screenings[id];
    if (!screening) return;

    // Update screening with review
    set((state) => ({
      screenings: {
        ...state.screenings,
        [id]: {
          ...screening,
          reviewStatus,
          reviewNotes,
          reviewedAt: Date.now()
        }
      }
    }));

    // Inject audit log
    get().addAuditLog({
      entityType: 'screening',
      entityId: id,
      action: 'screening_reviewed',
      actor: 'recruiter',
      details: {
        candidateId: screening.candidateId,
        jobId: screening.jobId,
        reviewStatus,
        reviewNotes,
        scores: screening.evaluation
      }
    });
  },

  getScreening: (id) => get().screenings[id],

  getScreeningByCandidate: (candidateId) =>
    Object.values(get().screenings).find((s) => s.candidateId === candidateId)
});
