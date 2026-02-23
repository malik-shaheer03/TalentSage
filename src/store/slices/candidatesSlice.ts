import { StateCreator } from 'zustand';
import { Candidate } from '../../types';
import { AuditSlice } from './auditSlice';

export interface CandidatesSlice {
  candidates: Record<string, Candidate>;
  addCandidate: (candidate: Candidate) => void;
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
  changeCandidateStage: (id: string, stage: Candidate['stage'], actor?: string) => void;
  getCandidate: (id: string) => Candidate | undefined;
  getCandidatesByJob: (jobId: string) => Candidate[];
  getCandidatesByStage: (jobId: string, stage: Candidate['stage']) => Candidate[];
}

export const createCandidatesSlice: StateCreator<
  CandidatesSlice & AuditSlice,
  [],
  [],
  CandidatesSlice
> = (set, get) => ({
  candidates: {},

  addCandidate: (candidate) =>
    set((state) => ({
      candidates: { ...state.candidates, [candidate.id]: candidate }
    })),

  updateCandidate: (id, updates) =>
    set((state) => {
      const candidate = state.candidates[id];
      if (!candidate) return state;

      return {
        candidates: {
          ...state.candidates,
          [id]: { ...candidate, ...updates, updatedAt: Date.now() }
        }
      };
    }),

  changeCandidateStage: (id, newStage, actor = 'recruiter') =>
    set((state) => {
      const candidate = state.candidates[id];
      if (!candidate) return state;

      const oldStage = candidate.stage;

      // Don't process if stage hasn't changed
      if (oldStage === newStage) return state;

      // Update candidate stage
      const updatedCandidate = {
        ...candidate,
        stage: newStage,
        updatedAt: Date.now()
      };

      // Inject audit log
      get().addAuditLog({
        entityType: 'candidate',
        entityId: id,
        action: 'stage_changed',
        actor: actor as 'recruiter' | 'ai_assistant' | 'system',
        actorName: actor === 'ai_assistant' ? 'AI Assistant' : undefined,
        details: {
          candidateName: candidate.name,
          from: oldStage,
          to: newStage,
          jobId: candidate.jobId
        }
      });

      return {
        candidates: {
          ...state.candidates,
          [id]: updatedCandidate
        }
      };
    }),

  getCandidate: (id) => get().candidates[id],

  getCandidatesByJob: (jobId) =>
    Object.values(get().candidates)
      .filter((c) => c.jobId === jobId)
      .sort((a, b) => b.appliedAt - a.appliedAt),

  getCandidatesByStage: (jobId, stage) =>
    Object.values(get().candidates)
      .filter((c) => c.jobId === jobId && c.stage === stage)
      .sort((a, b) => (b.score || 0) - (a.score || 0))
});
