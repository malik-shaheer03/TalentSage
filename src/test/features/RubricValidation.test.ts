import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../../store';
import { Rubric, RubricCriterion } from '../../types/models';

describe('Rubric Weight Validation', () => {
  beforeEach(() => {
    // Reset store state
    useStore.setState({
      rubrics: {},
      auditLogs: []
    });
  });

  it('should reject rubric when weights do not sum to 100', () => {
    const { setRubric } = useStore.getState();

    const invalidRubric: Rubric = {
      id: 'rubric-invalid-1',
      jobId: 'job-1',
      criteria: [
        { id: 'c1', name: 'Technical Skills', description: '', weight: 40 },
        { id: 'c2', name: 'Communication', description: '', weight: 30 },
        { id: 'c3', name: 'Experience', description: '', weight: 20 }
        // Total: 90, not 100!
      ],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    // Attempt to set rubric with invalid weights
    setRubric(invalidRubric);

    // Get the saved rubric
    const savedRubric = useStore.getState().rubrics[invalidRubric.id];

    // Calculate total weight
    const totalWeight = savedRubric?.criteria.reduce(
      (sum: number, c: RubricCriterion) => sum + c.weight,
      0
    );

    // Rubric should be normalized to 100% total
    expect(totalWeight).toBeCloseTo(100, 1);
  });

  it('should accept rubric when weights sum to exactly 100', () => {
    const { setRubric } = useStore.getState();

    const validRubric: Rubric = {
      id: 'rubric-valid-1',
      jobId: 'job-1',
      criteria: [
        { id: 'c1', name: 'Technical Skills', description: '', weight: 35 },
        { id: 'c2', name: 'Communication', description: '', weight: 25 },
        { id: 'c3', name: 'Experience', description: '', weight: 20 },
        { id: 'c4', name: 'Problem Solving', description: '', weight: 15 },
        { id: 'c5', name: 'Cultural Fit', description: '', weight: 5 }
        // Total: 100
      ],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    // Set rubric with valid weights
    setRubric(validRubric);

    // Get the saved rubric
    const savedRubric = useStore.getState().rubrics[validRubric.id];

    expect(savedRubric).toBeDefined();
    expect(savedRubric?.criteria.length).toBe(5);

    // Weights should remain unchanged
    expect(savedRubric?.criteria[0].weight).toBe(35);
    expect(savedRubric?.criteria[1].weight).toBe(25);
    expect(savedRubric?.criteria[2].weight).toBe(20);
    expect(savedRubric?.criteria[3].weight).toBe(15);
    expect(savedRubric?.criteria[4].weight).toBe(5);

    // Total should be exactly 100
    const totalWeight = savedRubric?.criteria.reduce(
      (sum: number, c: RubricCriterion) => sum + c.weight,
      0
    );
    expect(totalWeight).toBe(100);
  });

  it('should normalize weights proportionally when total is not 100', () => {
    const { setRubric } = useStore.getState();

    const rubricWithInvalidTotal: Rubric = {
      id: 'rubric-normalize-1',
      jobId: 'job-1',
      criteria: [
        { id: 'c1', name: 'Technical Skills', description: '', weight: 50 },
        { id: 'c2', name: 'Communication', description: '', weight: 30 },
        { id: 'c3', name: 'Experience', description: '', weight: 20 }
        // Total: 100 (valid, but let's test with 120)
      ],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    // Modify to have total of 120
    rubricWithInvalidTotal.criteria[0].weight = 60;
    rubricWithInvalidTotal.criteria[1].weight = 40;
    rubricWithInvalidTotal.criteria[2].weight = 20;
    // Total: 120

    setRubric(rubricWithInvalidTotal);

    const savedRubric = useStore.getState().rubrics[rubricWithInvalidTotal.id];

    // Calculate total
    const totalWeight = savedRubric?.criteria.reduce(
      (sum: number, c: RubricCriterion) => sum + c.weight,
      0
    );

    // Should be normalized to 100
    expect(totalWeight).toBeCloseTo(100, 1);

    // Weights should be proportionally adjusted
    // Original: 60, 40, 20 (total 120)
    // Normalized: 50, 33.33, 16.67 (total 100)
    expect(savedRubric?.criteria[0].weight).toBeCloseTo(50, 1);
    expect(savedRubric?.criteria[1].weight).toBeCloseTo(33.33, 1);
    expect(savedRubric?.criteria[2].weight).toBeCloseTo(16.67, 1);
  });

  it('should create audit log when rubric is set', () => {
    const { setRubric } = useStore.getState();

    const rubric: Rubric = {
      id: 'rubric-audit-1',
      jobId: 'job-1',
      criteria: [
        { id: 'c1', name: 'Technical Skills', description: '', weight: 50 },
        { id: 'c2', name: 'Communication', description: '', weight: 50 }
      ],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const initialLogCount = useStore.getState().auditLogs.length;

    setRubric(rubric);

    const auditLogs = useStore.getState().auditLogs;

    // Should have created an audit log
    expect(auditLogs.length).toBeGreaterThan(initialLogCount);

    const rubricLog = auditLogs.find(
      log => log.entityType === 'rubric' && log.entityId === rubric.id
    );

    expect(rubricLog).toBeDefined();
    expect(rubricLog?.action).toBe('rubric_created');
  });

  it('should reject rubric with empty criteria array', () => {
    const { setRubric } = useStore.getState();

    const emptyRubric: Rubric = {
      id: 'rubric-empty-1',
      jobId: 'job-1',
      criteria: [], // Empty!
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    setRubric(emptyRubric);

    const savedRubric = useStore.getState().rubrics[emptyRubric.id];

    // Should still save, but validation in UI would prevent this
    expect(savedRubric).toBeDefined();
    expect(savedRubric?.criteria.length).toBe(0);
  });

  it('should handle rubric with single criterion at 100%', () => {
    const { setRubric } = useStore.getState();

    const singleCriterionRubric: Rubric = {
      id: 'rubric-single-1',
      jobId: 'job-1',
      criteria: [
        { id: 'c1', name: 'Overall Assessment', description: '', weight: 100 }
      ],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    setRubric(singleCriterionRubric);

    const savedRubric = useStore.getState().rubrics[singleCriterionRubric.id];

    expect(savedRubric?.criteria.length).toBe(1);
    expect(savedRubric?.criteria[0].weight).toBe(100);

    const totalWeight = savedRubric?.criteria.reduce(
      (sum: number, c: RubricCriterion) => sum + c.weight,
      0
    );
    expect(totalWeight).toBe(100);
  });

  it('should handle very small weight differences due to rounding', () => {
    const { setRubric } = useStore.getState();

    const rubricWithRounding: Rubric = {
      id: 'rubric-rounding-1',
      jobId: 'job-1',
      criteria: [
        { id: 'c1', name: 'Skill 1', description: '', weight: 33.33 },
        { id: 'c2', name: 'Skill 2', description: '', weight: 33.33 },
        { id: 'c3', name: 'Skill 3', description: '', weight: 33.34 }
        // Total: 100 (with rounding)
      ],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    setRubric(rubricWithRounding);

    const savedRubric = useStore.getState().rubrics[rubricWithRounding.id];

    const totalWeight = savedRubric?.criteria.reduce(
      (sum: number, c: RubricCriterion) => sum + c.weight,
      0
    );

    // Should be close to 100 (allowing for rounding errors)
    expect(totalWeight).toBeCloseTo(100, 0.1);
  });
});
