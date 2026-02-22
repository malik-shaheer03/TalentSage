import { StateCreator } from 'zustand';
import { Job } from '../../types';

export interface JobsSlice {
  jobs: Record<string, Job>;
  addJob: (job: Job) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  getJob: (id: string) => Job | undefined;
  getJobsByStatus: (status: Job['status']) => Job[];
}

export const createJobsSlice: StateCreator<
  JobsSlice,
  [],
  [],
  JobsSlice
> = (set, get) => ({
  jobs: {},

  addJob: (job) =>
    set((state) => ({
      jobs: { ...state.jobs, [job.id]: job }
    })),

  updateJob: (id, updates) =>
    set((state) => {
      const job = state.jobs[id];
      if (!job) return state;

      return {
        jobs: {
          ...state.jobs,
          [id]: { ...job, ...updates, updatedAt: Date.now() }
        }
      };
    }),

  getJob: (id) => get().jobs[id],

  getJobsByStatus: (status) =>
    Object.values(get().jobs).filter((job) => job.status === status)
});
