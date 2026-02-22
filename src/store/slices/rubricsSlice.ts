import { StateCreator } from 'zustand';
import { Rubric, RubricCriterion } from '../types';
import { AuditSlice } from './auditSlice';
import { validateRubricWeights, normalizeRubricWeights } from '../utils/rubricValidation';

export interface RubricsSlice {
  rubrics: Record<string, Rubric>;
  setRubric: (rubric: Rubric) => void;
  updateRubric: (id: string, updates: Partial<Rubric>) => void;
  updateRubricCriteria: (id: string, criteria: RubricCriterion[]) => void;
  getRubric: (id: string) => Rubric | undefined;
  getRubricByJob: (jobId: string) => Rubric | undefined;
}

const generateRubricId = () => `rubric-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const createRubricsSlice: StateCreator<
  RubricsSlice & AuditSlice,
  [],
  [],
  RubricsSlice
> = (set, get) => ({
  rubrics: {},

  setRubric: (rubric) => {
    // Validate weights before saving
    if (!validateRubricWeights(rubric.criteria)) {
      console.warn('Rubric weights do not sum to 100%, normalizing...');
      rubric.criteria = normalizeRubricWeights(rubric.criteria) as RubricCriterion[];
    }

    set((state) => ({
      rubrics: { ...state.rubrics, [rubric.id]: rubric }
    }));

    // Log rubric creation
    get().addAuditLog({
      entityType: 'rubric',
      entityId: rubric.id,
      action: 'rubric_created',
      actor: 'recruiter',
      details: {
        jobId: rubric.jobId,
        criteriaCount: rubric.criteria.length
      }
    });

    // Persist to localStorage
    saveRubricsToStorage(get().rubrics);
  },

  updateRubric: (id, updates) =>
    set((state) => {
      const rubric = state.rubrics[id];
      if (!rubric) return state;

      const updatedRubric = { ...rubric, ...updates, updatedAt: Date.now() };

      // Log rubric update
      get().addAuditLog({
        entityType: 'rubric',
        entityId: id,
        action: 'rubric_updated',
        actor: 'recruiter',
        details: {
          jobId: rubric.jobId,
          changes: Object.keys(updates)
        }
      });

      const newRubrics = {
        ...state.rubrics,
        [id]: updatedRubric
      };

      // Persist to localStorage
      saveRubricsToStorage(newRubrics);

      return { rubrics: newRubrics };
    }),

  updateRubricCriteria: (id, criteria) => {
    const rubric = get().rubrics[id];
    if (!rubric) return;

    // Validate and normalize weights
    if (!validateRubricWeights(criteria)) {
      console.warn('Criteria weights do not sum to 100%, normalizing...');
      criteria = normalizeRubricWeights(criteria) as RubricCriterion[];
    }

    set((state) => {
      const updatedRubric = {
        ...rubric,
        criteria,
        updatedAt: Date.now()
      };

      // Log criteria update
      get().addAuditLog({
        entityType: 'rubric',
        entityId: id,
        action: 'criteria_updated',
        actor: 'recruiter',
        details: {
          jobId: rubric.jobId,
          criteriaCount: criteria.length,
          totalWeight: criteria.reduce((sum, c) => sum + c.weight, 0)
        }
      });

      const newRubrics = {
        ...state.rubrics,
        [id]: updatedRubric
      };

      // Persist to localStorage
      saveRubricsToStorage(newRubrics);

      return { rubrics: newRubrics };
    });
  },

  getRubric: (id) => get().rubrics[id],

  getRubricByJob: (jobId) =>
    Object.values(get().rubrics).find((r) => r.jobId === jobId)
});

// localStorage persistence helpers
const STORAGE_KEY = 'talentsage_rubrics';

const saveRubricsToStorage = (rubrics: Record<string, Rubric>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rubrics));
  } catch (error) {
    console.error('Failed to save rubrics to localStorage:', error);
  }
};

export const loadRubricsFromStorage = (): Record<string, Rubric> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load rubrics from localStorage:', error);
    return {};
  }
};
