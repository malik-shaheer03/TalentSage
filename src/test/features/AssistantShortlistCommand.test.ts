import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../../store';
import { parseCommand, executeCommand } from '../../features/assistant/commandParser';
import { Candidate } from '../../types/models';

describe('Assistant Shortlist Command Updates Candidate Stages', () => {
  const mockCandidates: Record<string, Candidate> = {
    'cand-1': {
      id: 'cand-1',
      jobId: 'job-1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '+1234567890',
      location: 'San Francisco, CA',
      stage: 'applied',
      score: 92,
      skills: ['React', 'TypeScript', 'Node.js'],
      experience: 6,
      appliedAt: Date.now() - 86400000,
      updatedAt: Date.now() - 86400000
    },
    'cand-2': {
      id: 'cand-2',
      jobId: 'job-1',
      name: 'Bob Smith',
      email: 'bob@example.com',
      phone: '+1234567891',
      location: 'Seattle, WA',
      stage: 'applied',
      score: 88,
      skills: ['Vue', 'JavaScript', 'Python'],
      experience: 5,
      appliedAt: Date.now() - 172800000,
      updatedAt: Date.now() - 172800000
    },
    'cand-3': {
      id: 'cand-3',
      jobId: 'job-1',
      name: 'Charlie Davis',
      email: 'charlie@example.com',
      phone: '+1234567892',
      location: 'Austin, TX',
      stage: 'applied',
      score: 85,
      skills: ['Angular', 'TypeScript', 'Java'],
      experience: 4,
      appliedAt: Date.now() - 259200000,
      updatedAt: Date.now() - 259200000
    },
    'cand-4': {
      id: 'cand-4',
      jobId: 'job-1',
      name: 'Diana Prince',
      email: 'diana@example.com',
      phone: '+1234567893',
      location: 'Boston, MA',
      stage: 'applied',
      score: 78,
      skills: ['React', 'Redux', 'GraphQL'],
      experience: 3,
      appliedAt: Date.now() - 345600000,
      updatedAt: Date.now() - 345600000
    },
    'cand-5': {
      id: 'cand-5',
      jobId: 'job-1',
      name: 'Eve Wilson',
      email: 'eve@example.com',
      phone: '+1234567894',
      location: 'Denver, CO',
      stage: 'applied',
      score: 72,
      skills: ['HTML', 'CSS', 'JavaScript'],
      experience: 2,
      appliedAt: Date.now() - 432000000,
      updatedAt: Date.now() - 432000000
    }
  };

  const mockJob = {
    id: 'job-1',
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'full-time' as const,
    status: 'open' as const,
    description: 'Looking for experienced frontend developers',
    requirements: ['5+ years experience', 'React expertise'],
    candidateIds: ['cand-1', 'cand-2', 'cand-3', 'cand-4', 'cand-5'],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  beforeEach(() => {
    // Reset store with test data
    useStore.setState({
      candidates: { ...mockCandidates },
      jobs: { [mockJob.id]: mockJob },
      auditLogs: []
    });
  });

  it('should parse "shortlist top candidates" command correctly', () => {
    const command1 = parseCommand('shortlist top candidates');
    const command2 = parseCommand('short list the best candidates');
    const command3 = parseCommand('please shortlist top 3');

    expect(command1).toBeDefined();
    expect(command1?.type).toBe('shortlist');
    expect(command1?.confidence).toBe(1.0);

    expect(command2).toBeDefined();
    expect(command2?.type).toBe('shortlist');

    expect(command3).toBeDefined();
    expect(command3?.type).toBe('shortlist');
  });

  it('should move top 3 candidates by score to shortlisted stage', () => {
    const store = useStore.getState();
    const command = parseCommand('shortlist top candidates');

    expect(command).toBeDefined();

    // Execute the command
    const result = executeCommand(command!, store, {});

    // Verify command succeeded
    expect(result.success).toBe(true);
    expect(result.message).toContain('Successfully shortlisted');

    // Get updated candidates
    const updatedStore = useStore.getState();

    // Top 3 by score: Alice (92), Bob (88), Charlie (85)
    expect(updatedStore.candidates['cand-1'].stage).toBe('shortlisted');
    expect(updatedStore.candidates['cand-2'].stage).toBe('shortlisted');
    expect(updatedStore.candidates['cand-3'].stage).toBe('shortlisted');

    // Bottom 2 should remain in applied
    expect(updatedStore.candidates['cand-4'].stage).toBe('applied');
    expect(updatedStore.candidates['cand-5'].stage).toBe('applied');
  });

  it('should create audit logs for each shortlisted candidate', () => {
    const store = useStore.getState();
    const initialLogCount = store.auditLogs.length;
    
    const command = parseCommand('shortlist top candidates');
    executeCommand(command!, store, {});

    const updatedStore = useStore.getState();
    const newLogs = updatedStore.auditLogs;

    // Should have created 3 new audit logs (one for each shortlisted candidate)
    expect(newLogs.length).toBeGreaterThan(initialLogCount);

    const stageChangeLogs = newLogs.filter(
      log => log.action === 'stage_changed' && log.details.to === 'shortlisted'
    );

    expect(stageChangeLogs.length).toBe(3);

    // Verify logs are for the correct candidates
    const shortlistedIds = stageChangeLogs.map(log => log.entityId);
    expect(shortlistedIds).toContain('cand-1');
    expect(shortlistedIds).toContain('cand-2');
    expect(shortlistedIds).toContain('cand-3');

    // Verify actor is 'ai_assistant'
    stageChangeLogs.forEach(log => {
      expect(log.actor).toBe('ai_assistant');
      expect(log.actorName).toBe('AI Assistant');
      expect(log.details.from).toBe('applied');
      expect(log.details.to).toBe('shortlisted');
    });
  });

  it('should return error when no applied candidates exist', () => {
    // Move all candidates to shortlisted
    const store = useStore.getState();
    Object.keys(mockCandidates).forEach(id => {
      store.changeCandidateStage(id, 'shortlisted', 'recruiter');
    });

    const command = parseCommand('shortlist top candidates');
    const result = executeCommand(command!, store, {});

    // Should return error message
    expect(result.success).toBe(false);
    expect(result.message).toContain('No candidates in the applied stage');
  });

  it('should handle case with fewer than 3 applied candidates', () => {
    // Keep only 2 candidates in applied stage
    const store = useStore.getState();
    store.changeCandidateStage('cand-3', 'interview', 'recruiter');
    store.changeCandidateStage('cand-4', 'rejected', 'recruiter');
    store.changeCandidateStage('cand-5', 'rejected', 'recruiter');

    const command = parseCommand('shortlist top candidates');
    const result = executeCommand(command!, store, {});

    expect(result.success).toBe(true);
    expect(result.message).toContain('Successfully shortlisted 2');

    const updatedStore = useStore.getState();

    // Only cand-1 and cand-2 should be shortlisted
    expect(updatedStore.candidates['cand-1'].stage).toBe('shortlisted');
    expect(updatedStore.candidates['cand-2'].stage).toBe('shortlisted');
  });

  it('should sort candidates correctly by score in descending order', () => {
    const store = useStore.getState();
    
    // Verify initial scores
    expect(store.candidates['cand-1'].score).toBe(92); // Highest
    expect(store.candidates['cand-2'].score).toBe(88);
    expect(store.candidates['cand-3'].score).toBe(85);
    expect(store.candidates['cand-4'].score).toBe(78);
    expect(store.candidates['cand-5'].score).toBe(72); // Lowest

    const command = parseCommand('shortlist top candidates');
    executeCommand(command!, store, {});

    const updatedStore = useStore.getState();

    // Verify the top 3 by score are shortlisted
    const shortlistedCandidates = Object.values(updatedStore.candidates)
      .filter(c => c.stage === 'shortlisted')
      .sort((a, b) => (b.score || 0) - (a.score || 0));

    expect(shortlistedCandidates.length).toBe(3);
    expect(shortlistedCandidates[0].id).toBe('cand-1'); // 92
    expect(shortlistedCandidates[1].id).toBe('cand-2'); // 88
    expect(shortlistedCandidates[2].id).toBe('cand-3'); // 85
  });

  it('should include candidate names in success message', () => {
    const store = useStore.getState();
    const command = parseCommand('shortlist top candidates');
    const result = executeCommand(command!, store, {});

    expect(result.success).toBe(true);
    
    // Should mention candidate names
    expect(result.message).toContain('Alice Johnson');
    expect(result.message).toContain('Bob Smith');
    expect(result.message).toContain('Charlie Davis');
  });

  it('should not re-shortlist already shortlisted candidates', () => {
    const store = useStore.getState();
    
    // Manually shortlist cand-1
    store.changeCandidateStage('cand-1', 'shortlisted', 'recruiter');
    const logsAfterManual = store.auditLogs.length;

    // Run shortlist command
    const command = parseCommand('shortlist top candidates');
    executeCommand(command!, store, {});

    const updatedStore = useStore.getState();

    // cand-1 should still be shortlisted (no duplicate)
    expect(updatedStore.candidates['cand-1'].stage).toBe('shortlisted');

    // New top 3 from applied: cand-2, cand-3, cand-4
    expect(updatedStore.candidates['cand-2'].stage).toBe('shortlisted');
    expect(updatedStore.candidates['cand-3'].stage).toBe('shortlisted');
    expect(updatedStore.candidates['cand-4'].stage).toBe('shortlisted');

    // cand-5 should still be applied
    expect(updatedStore.candidates['cand-5'].stage).toBe('applied');

    // Should only create 3 new logs (for the newly shortlisted)
    const newLogsCount = updatedStore.auditLogs.length - logsAfterManual;
    expect(newLogsCount).toBe(3);
  });

  it('should work with various command phrasings', () => {
    const testPhrases = [
      'shortlist top candidates',
      'short list the best candidates',
      'please shortlist top 3',
      'shortlist candidates',
      'short list top performers'
    ];

    testPhrases.forEach(phrase => {
      const command = parseCommand(phrase);
      expect(command).toBeDefined();
      expect(command?.type).toBe('shortlist');
    });
  });
});
