import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { JobsSlice, createJobsSlice } from './slices/jobsSlice';
import { CandidatesSlice, createCandidatesSlice } from './slices/candidatesSlice';
import { RubricsSlice, createRubricsSlice, loadRubricsFromStorage } from './slices/rubricsSlice';
import { AuditSlice, createAuditSlice } from './slices/auditSlice';
import { ScreeningsSlice, createScreeningsSlice } from './slices/screeningsSlice';
import { seedJobs, seedCandidates, seedRubrics } from './seedData';

type StoreState = JobsSlice & CandidatesSlice & RubricsSlice & AuditSlice & ScreeningsSlice;

export const useStore = create<StoreState>()(
  devtools(
    (...args) => ({
      ...createJobsSlice(...args),
      ...createCandidatesSlice(...args),
      ...createRubricsSlice(...args),
      ...createAuditSlice(...args),
      ...createScreeningsSlice(...args)
    }),
    { name: 'TalentSage Store' }
  )
);

// Initialize store with seed data
export const initializeStore = () => {
  const store = useStore.getState();

  // Load jobs
  seedJobs.forEach((job) => store.addJob(job));

  // Load candidates
  seedCandidates.forEach((candidate) => store.addCandidate(candidate));

  // Load rubrics from localStorage first, fallback to seed data
  const storedRubrics = loadRubricsFromStorage();
  const rubricsToLoad = Object.keys(storedRubrics).length > 0 ? storedRubrics : seedRubrics;

  if (Object.keys(storedRubrics).length > 0) {
    // Hydrate from localStorage
    Object.values(storedRubrics).forEach((rubric) => {
      useStore.setState((state) => ({
        rubrics: { ...state.rubrics, [rubric.id]: rubric }
      }));
    });
  } else {
    // Use seed data
    seedRubrics.forEach((rubric) => store.setRubric(rubric));
  }

  // Create initial audit logs for seed data
  seedCandidates.forEach((candidate) => {
    store.addAuditLog({
      entityType: 'candidate',
      entityId: candidate.id,
      action: 'application_received',
      actor: 'system',
      details: {
        candidateName: candidate.name,
        jobId: candidate.jobId,
        initialStage: candidate.stage
      }
    });
  });

  console.log('✓ Store initialized with seed data');
};

// Export types for components
export type { StoreState };
