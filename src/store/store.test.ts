import { useStore, initializeStore } from './index';

/**
 * Test suite for Zustand store
 * 
 * These tests demonstrate:
 * 1. Candidate stage transitions with audit log injection
 * 2. Rubric weight validation
 * 3. State consistency across operations
 */

describe('TalentSage Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useStore.setState({
      jobs: {},
      candidates: {},
      rubrics: {},
      auditLogs: []
    });
  });

  describe('Candidate Stage Transitions', () => {
    it('should update candidate stage and create audit log', () => {
      const store = useStore.getState();
      
      // Add a candidate
      const candidate = {
        id: 'test-candidate-1',
        jobId: 'job-1',
        name: 'Test Candidate',
        email: 'test@example.com',
        phone: '+1-555-0000',
        location: 'Test City',
        stage: 'applied' as const,
        skills: ['React', 'TypeScript'],
        experience: 5,
        appliedAt: Date.now(),
        updatedAt: Date.now()
      };
      
      store.addCandidate(candidate);
      
      // Change stage
      store.changeCandidateStage('test-candidate-1', 'shortlisted');
      
      // Verify stage changed
      const updated = store.getCandidate('test-candidate-1');
      expect(updated?.stage).toBe('shortlisted');
      
      // Verify audit log was created
      const logs = store.getLogsByEntity('candidate', 'test-candidate-1');
      expect(logs.length).toBeGreaterThan(0);
      
      const stageChangeLog = logs.find(log => log.action === 'stage_changed');
      expect(stageChangeLog).toBeDefined();
      expect(stageChangeLog?.details.from).toBe('applied');
      expect(stageChangeLog?.details.to).toBe('shortlisted');
    });

    it('should not create duplicate audit log if stage unchanged', () => {
      const store = useStore.getState();
      
      const candidate = {
        id: 'test-candidate-2',
        jobId: 'job-1',
        name: 'Test Candidate 2',
        email: 'test2@example.com',
        phone: '+1-555-0001',
        location: 'Test City',
        stage: 'applied' as const,
        skills: ['React'],
        experience: 3,
        appliedAt: Date.now(),
        updatedAt: Date.now()
      };
      
      store.addCandidate(candidate);
      
      const initialLogCount = store.auditLogs.length;
      
      // Try to change to same stage
      store.changeCandidateStage('test-candidate-2', 'applied');
      
      // Verify no new log was created
      expect(store.auditLogs.length).toBe(initialLogCount);
    });

    it('should maintain consistency when multiple candidates change stages', () => {
      const store = useStore.getState();
      
      // Add multiple candidates
      const candidates = [
        {
          id: 'cand-1',
          jobId: 'job-1',
          name: 'Candidate 1',
          email: 'c1@example.com',
          phone: '+1-555-0001',
          location: 'City 1',
          stage: 'applied' as const,
          skills: ['React'],
          experience: 3,
          appliedAt: Date.now(),
          updatedAt: Date.now()
        },
        {
          id: 'cand-2',
          jobId: 'job-1',
          name: 'Candidate 2',
          email: 'c2@example.com',
          phone: '+1-555-0002',
          location: 'City 2',
          stage: 'applied' as const,
          skills: ['Vue'],
          experience: 4,
          appliedAt: Date.now(),
          updatedAt: Date.now()
        }
      ];
      
      candidates.forEach(c => store.addCandidate(c));
      
      // Change stages
      store.changeCandidateStage('cand-1', 'shortlisted');
      store.changeCandidateStage('cand-2', 'interview');
      
      // Verify all updates are reflected
      expect(store.getCandidate('cand-1')?.stage).toBe('shortlisted');
      expect(store.getCandidate('cand-2')?.stage).toBe('interview');
      
      // Verify separate audit logs
      const logs1 = store.getLogsByEntity('candidate', 'cand-1');
      const logs2 = store.getLogsByEntity('candidate', 'cand-2');
      
      expect(logs1.some(log => log.details.to === 'shortlisted')).toBe(true);
      expect(logs2.some(log => log.details.to === 'interview')).toBe(true);
    });
  });

  describe('Rubric Weight Validation', () => {
    it('should normalize weights if they do not sum to 100', () => {
      const store = useStore.getState();
      
      const rubric = {
        id: 'test-rubric-1',
        jobId: 'job-1',
        criteria: [
          { id: 'c1', name: 'Skill 1', description: 'Test', weight: 30 },
          { id: 'c2', name: 'Skill 2', description: 'Test', weight: 30 },
          { id: 'c3', name: 'Skill 3', description: 'Test', weight: 30 }
        ],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      store.setRubric(rubric);
      
      const saved = store.getRubric('test-rubric-1');
      const totalWeight = saved?.criteria.reduce((sum, c) => sum + c.weight, 0);
      
      // Should be normalized to 100
      expect(totalWeight).toBeCloseTo(100, 1);
    });

    it('should accept valid weights that sum to 100', () => {
      const store = useStore.getState();
      
      const rubric = {
        id: 'test-rubric-2',
        jobId: 'job-2',
        criteria: [
          { id: 'c1', name: 'Skill 1', description: 'Test', weight: 40 },
          { id: 'c2', name: 'Skill 2', description: 'Test', weight: 35 },
          { id: 'c3', name: 'Skill 3', description: 'Test', weight: 25 }
        ],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      store.setRubric(rubric);
      
      const saved = store.getRubric('test-rubric-2');
      
      // Weights should be unchanged
      expect(saved?.criteria[0].weight).toBe(40);
      expect(saved?.criteria[1].weight).toBe(35);
      expect(saved?.criteria[2].weight).toBe(25);
    });

    it('should create audit log when rubric is updated', () => {
      const store = useStore.getState();
      
      const rubric = {
        id: 'test-rubric-3',
        jobId: 'job-3',
        criteria: [
          { id: 'c1', name: 'Skill 1', description: 'Test', weight: 50 },
          { id: 'c2', name: 'Skill 2', description: 'Test', weight: 50 }
        ],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      store.setRubric(rubric);
      
      // Verify audit log was created
      const logs = store.getLogsByEntity('rubric', 'test-rubric-3');
      expect(logs.length).toBeGreaterThan(0);
      expect(logs[0].action).toBe('rubric_created');
    });
  });

  describe('LocalStorage Persistence', () => {
    it('should persist rubrics to localStorage', () => {
      const store = useStore.getState();
      
      const rubric = {
        id: 'persist-test',
        jobId: 'job-1',
        criteria: [
          { id: 'c1', name: 'Test', description: 'Test', weight: 100 }
        ],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      store.setRubric(rubric);
      
      // Check localStorage
      const stored = localStorage.getItem('talentsage_rubrics');
      expect(stored).toBeTruthy();
      
      const parsed = JSON.parse(stored!);
      expect(parsed['persist-test']).toBeDefined();
      expect(parsed['persist-test'].jobId).toBe('job-1');
    });
  });
});
